import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FoodOrderService implements HttpHandler {

    private static final String DATABASE_DIR = "../database";
    private static final String MEALS_DB_PATH = DATABASE_DIR + "/airline_meals.json";
    private static final String ORDERS_DB_PATH = DATABASE_DIR + "/food_orders.json";

    public FoodOrderService() {
        File dir = new File(DATABASE_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        File ordersFile = new File(ORDERS_DB_PATH);
        if (!ordersFile.exists()) {
            try {
                Files.writeString(Paths.get(ORDERS_DB_PATH), "[]", StandardCharsets.UTF_8);
            } catch (IOException e) {
                System.err.println("Failed to create food_orders.json: " + e.getMessage());
            }
        }
    }

    private void cors(HttpExchange ex) {
        String origin = ex.getRequestHeaders().getFirst("Origin");
        String allow = (origin != null && (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:"))) ? origin : "http://localhost:3000";
        ex.getResponseHeaders().set("Access-Control-Allow-Origin", allow);
        ex.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        ex.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        ex.getResponseHeaders().set("Access-Control-Allow-Credentials", "true");
        ex.getResponseHeaders().set("Access-Control-Max-Age", "86400");
    }

    @Override
    public void handle(HttpExchange ex) throws IOException {
        cors(ex);
        try {
            if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) {
                ex.sendResponseHeaders(204, -1);
                return;
            }

            String method = ex.getRequestMethod().toUpperCase();
            String path = ex.getRequestURI().getPath();

            if ("POST".equals(method) && "/api/food/order".equals(path)) {
                handleCreateOrder(ex);
            } else if ("GET".equals(method) && path.startsWith("/api/food/orders/")) {
                String bookingId = path.substring("/api/food/orders/".length());
                handleGetOrders(ex, bookingId);
            } else {
                sendResponse(ex, 404, "{\"error\":\"Not Found\"}");
            }
        } finally {
            ex.close();
        }
    }

    private void handleCreateOrder(HttpExchange ex) throws IOException {
        String body;
        try (InputStream is = ex.getRequestBody()) {
            body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }

        String bookingId = extractJsonString(body, "bookingId");
        String passengerName = extractJsonString(body, "passengerName");
        String stopoverAirport = extractJsonString(body, "stopoverAirport");
        String airline = extractJsonString(body, "airline");
        String deliveryTime = extractJsonString(body, "deliveryTime");
        String items = extractJsonArray(body, "items");
        double totalUSD = extractJsonDouble(body, "totalUSD");

        if (bookingId == null || airline == null || deliveryTime == null) {
            sendResponse(ex, 400, "{\"error\":\"Missing required fields\"}");
            return;
        }

        // Validate deliveryTime exists
        if (deliveryTime.isEmpty()) {
            sendResponse(ex, 400, "{\"error\":\"Delivery time must be specified within the stopover window\"}");
            return;
        }

        // Validate airline exists in meal DB
        if (!isAirlineInMealDatabase(airline)) {
            sendResponse(ex, 400, "{\"error\":\"Airline " + airline + " meal data not found\"}");
            return;
        }

        String orderId = UUID.randomUUID().toString();
        String status = "CONFIRMED";
        String createdAt = Instant.now().toString();

        String newOrderJson = String.format(
                "{\"orderId\":\"%s\",\"bookingId\":\"%s\",\"passengerName\":\"%s\",\"stopoverAirport\":\"%s\",\"airline\":\"%s\",\"deliveryTime\":\"%s\",\"items\":%s,\"totalUSD\":%.2f,\"status\":\"%s\",\"createdAt\":\"%s\"}",
                orderId, bookingId, passengerName, stopoverAirport, airline, deliveryTime, items, totalUSD, status, createdAt);

        synchronized (this) {
            appendOrderToJsonFile(newOrderJson);
        }

        String response = String.format("{\"orderId\":\"%s\",\"status\":\"%s\",\"message\":\"Food order confirmed successfully.\"}", orderId, status);
        sendResponse(ex, 201, response);
    }

    private void handleGetOrders(HttpExchange ex, String bookingId) throws IOException {
        String allOrdersJson;
        synchronized (this) {
            allOrdersJson = Files.readString(Paths.get(ORDERS_DB_PATH), StandardCharsets.UTF_8);
        }

        // Extremely naive JSON array parsing to filter by bookingId
        StringBuilder result = new StringBuilder("[");
        boolean first = true;
        
        // Extract individual JSON objects from the array
        Matcher m = Pattern.compile("\\{.*?\"bookingId\":\"(.*?)\".*?\\}").matcher(allOrdersJson);
        while (m.find()) {
            if (m.group(1).equals(bookingId)) {
                if (!first) result.append(",");
                result.append(m.group(0));
                first = false;
            }
        }
        result.append("]");

        sendResponse(ex, 200, result.toString());
    }

    private synchronized void appendOrderToJsonFile(String newOrderJson) throws IOException {
        String content = Files.readString(Paths.get(ORDERS_DB_PATH), StandardCharsets.UTF_8).trim();
        if (content.equals("[]") || content.isEmpty()) {
            content = "[" + newOrderJson + "]";
        } else if (content.endsWith("]")) {
            content = content.substring(0, content.length() - 1) + "," + newOrderJson + "]";
        } else {
            content = "[" + newOrderJson + "]";
        }
        Files.writeString(Paths.get(ORDERS_DB_PATH), content, StandardCharsets.UTF_8);
    }

    private boolean isAirlineInMealDatabase(String airlineCode) {
        try {
            String mealsJson = Files.readString(Paths.get(MEALS_DB_PATH), StandardCharsets.UTF_8);
            return mealsJson.contains("\"" + airlineCode + "\":");
        } catch (IOException e) {
            System.err.println("Could not read meals DB: " + e.getMessage());
            return false;
        }
    }

    private void sendResponse(HttpExchange ex, int status, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        ex.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        ex.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(bytes);
        }
    }

    private String extractJsonString(String json, String key) {
        String marker = "\"" + key + "\":\"";
        int idx = json.indexOf(marker);
        if (idx < 0) return null;
        int end = json.indexOf("\"", idx + marker.length());
        if (end < 0) return null;
        return json.substring(idx + marker.length(), end);
    }

    private double extractJsonDouble(String json, String key) {
        String marker = "\"" + key + "\":";
        int idx = json.indexOf(marker);
        if (idx < 0) return 0.0;
        int end = json.indexOf(",", idx + marker.length());
        int end2 = json.indexOf("}", idx + marker.length());
        if (end < 0 || (end2 > 0 && end2 < end)) end = end2;
        if (end < 0) return 0.0;
        try {
            return Double.parseDouble(json.substring(idx + marker.length(), end).trim());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private String extractJsonArray(String json, String key) {
        String marker = "\"" + key + "\":";
        int idx = json.indexOf(marker);
        if (idx < 0) return "[]";
        int start = json.indexOf("[", idx);
        if (start < 0) return "[]";
        
        int brackets = 0;
        for (int i = start; i < json.length(); i++) {
            if (json.charAt(i) == '[') brackets++;
            else if (json.charAt(i) == ']') {
                brackets--;
                if (brackets == 0) {
                    return json.substring(start, i + 1);
                }
            }
        }
        return "[]";
    }
}
