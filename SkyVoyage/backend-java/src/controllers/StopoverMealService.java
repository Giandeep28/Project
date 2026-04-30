package controllers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import utils.ApiUtils;
import utils.SimpleJson;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.Duration;
import java.util.*;

public class StopoverMealService implements HttpHandler {

    private static final String DATABASE_DIR = "../database";
    private static final String ORDERS_FILE = DATABASE_DIR + "/stopover_orders.json";
    private static final int CANCELLATION_THRESHOLD_MINUTES = 45;

    public StopoverMealService() {
        try {
            File dir = new File(DATABASE_DIR);
            if (!dir.exists()) dir.mkdirs();
            File file = new File(ORDERS_FILE);
            if (!file.exists()) {
                Files.writeString(Paths.get(ORDERS_FILE), "[]", StandardCharsets.UTF_8);
            }
        } catch (IOException e) {
            System.err.println("StopoverMealService Init Error: " + e.getMessage());
        }
    }

    @Override
    public void handle(HttpExchange ex) throws IOException {
        String method = ex.getRequestMethod().toUpperCase();
        String path = ex.getRequestURI().getPath();

        if ("OPTIONS".equalsIgnoreCase(method)) {
            ApiUtils.addCors(ex);
            ex.sendResponseHeaders(204, -1);
            ex.close();
            return;
        }

        try {
            if ("POST".equals(method) && path.equals("/api/stopover/order")) {
                handleCreateOrder(ex);
            } else if ("GET".equals(method) && path.startsWith("/api/stopover/track")) {
                handleTrackOrder(ex);
            } else if ("GET".equals(method) && path.startsWith("/api/stopover/orders/")) {
                String bookingId = path.substring("/api/stopover/orders/".length());
                handleGetOrdersByBooking(ex, bookingId);
            } else {
                ApiUtils.writeError(ex, 404, "Endpoint not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            ApiUtils.writeError(ex, 500, "Internal Server Error: " + e.getMessage());
        } finally {
            ex.close();
        }
    }

    private void handleCreateOrder(HttpExchange ex) throws IOException {
        String body;
        try (InputStream is = ex.getRequestBody()) {
            body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }

        Map<String, Object> orderData = SimpleJson.parseObject(body);
        
        // Validation
        String bookingId = (String) orderData.get("bookingId");
        String flightNumber = (String) orderData.get("flightNumber");
        String stopoverAirport = (String) orderData.get("stopoverAirport");
        String deliveryTime = (String) orderData.get("deliveryTime");
        
        if (bookingId == null || flightNumber == null || stopoverAirport == null || deliveryTime == null) {
            ApiUtils.writeError(ex, 400, "Missing required stopover order fields");
            return;
        }

        String orderId = "SM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        orderData.put("orderId", orderId);
        orderData.put("status", "ORDERED");
        orderData.put("createdAt", Instant.now().toString());

        saveOrder(orderData);

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", orderId);
        response.put("status", "ORDERED");
        response.put("message", "Stopover meal pre-ordered successfully. You can track it upon landing.");
        
        ApiUtils.writeJson(ex, 201, SimpleJson.stringify(response));
    }

    private void handleTrackOrder(HttpExchange ex) throws IOException {
        String orderId = ApiUtils.getParam(ex, "orderId");
        if (orderId == null) {
            ApiUtils.writeError(ex, 400, "Missing orderId parameter");
            return;
        }

        List<Map<String, Object>> orders = loadOrders();
        Map<String, Object> targetOrder = null;
        for (Map<String, Object> order : orders) {
            if (orderId.equals(order.get("orderId"))) {
                targetOrder = order;
                break;
            }
        }

        if (targetOrder == null) {
            ApiUtils.writeError(ex, 404, "Order not found");
            return;
        }

        // Check flight status and auto-cancel if necessary
        checkAndSyncStatus(targetOrder);
        
        ApiUtils.writeJson(ex, 200, SimpleJson.stringify(targetOrder));
    }

    private void handleGetOrdersByBooking(HttpExchange ex, String bookingId) throws IOException {
        if (bookingId == null || bookingId.isEmpty()) {
            ApiUtils.writeError(ex, 400, "Missing bookingId");
            return;
        }

        List<Map<String, Object>> allOrders = loadOrders();
        List<Map<String, Object>> matchingOrders = new ArrayList<>();
        
        for (Map<String, Object> order : allOrders) {
            if (bookingId.equals(order.get("bookingId"))) {
                checkAndSyncStatus(order);
                matchingOrders.add(order);
            }
        }

        ApiUtils.writeJson(ex, 200, SimpleJson.stringify(matchingOrders));
    }

    private void checkAndSyncStatus(Map<String, Object> order) {
        String currentStatus = (String) order.get("status");
        if ("CANCELLED".equals(currentStatus) || "DELIVERED".equals(currentStatus)) {
            return;
        }

        // Simulate getting flight delay from LiveFlightService
        // In a real app, we'd fetch actual flight data here
        int delayMinutes = simulateFlightDelay((String) order.get("flightNumber"));
        
        if (delayMinutes > CANCELLATION_THRESHOLD_MINUTES) {
            order.put("status", "CANCELLED");
            order.put("cancellationReason", "Flight delay (" + delayMinutes + " mins) exceeds stopover window.");
            updateOrderInFile(order);
        } else {
            // Update tracking status based on time passed since "scheduled delivery"
            updateDeliveryTracking(order);
        }
    }

    private int simulateFlightDelay(String flightNumber) {
        // Logic: Deterministic mock delay based on flight number hash
        // Some flights are always late in this simulation
        int hash = Math.abs(flightNumber.hashCode());
        if (hash % 10 == 0) return 60; // 10% chance of a long delay
        if (hash % 5 == 0) return 20;  // 20% chance of a short delay
        return 0;
    }

    private void updateDeliveryTracking(Map<String, Object> order) {
        // Simple logic to move status forward based on current time
        // This makes the UI feel "alive"
        String createdAtStr = (String) order.get("createdAt");
        Instant createdAt = Instant.parse(createdAtStr);
        long minutesPassed = Duration.between(createdAt, Instant.now()).toMinutes();

        String status = (String) order.get("status");
        if (minutesPassed > 30 && "ORDERED".equals(status)) {
            order.put("status", "PREPARING");
            updateOrderInFile(order);
        } else if (minutesPassed > 60 && "PREPARING".equals(status)) {
            order.put("status", "READY");
            updateOrderInFile(order);
        }
    }

    private synchronized void saveOrder(Map<String, Object> newOrder) throws IOException {
        List<Map<String, Object>> orders = loadOrders();
        orders.add(newOrder);
        Files.writeString(Paths.get(ORDERS_FILE), SimpleJson.stringify(orders), StandardCharsets.UTF_8);
    }

    private synchronized void updateOrderInFile(Map<String, Object> updatedOrder) {
        try {
            List<Map<String, Object>> orders = loadOrders();
            for (int i = 0; i < orders.size(); i++) {
                if (updatedOrder.get("orderId").equals(orders.get(i).get("orderId"))) {
                    orders.set(i, updatedOrder);
                    break;
                }
            }
            Files.writeString(Paths.get(ORDERS_FILE), SimpleJson.stringify(orders), StandardCharsets.UTF_8);
        } catch (IOException e) {
            System.err.println("Failed to update order: " + e.getMessage());
        }
    }

    private List<Map<String, Object>> loadOrders() throws IOException {
        String content = Files.readString(Paths.get(ORDERS_FILE), StandardCharsets.UTF_8);
        List<Object> rawList = SimpleJson.parseArray(content);
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object o : rawList) {
            if (o instanceof Map) {
                list.add((Map<String, Object>) o);
            }
        }
        return list;
    }
}
