package controllers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import services.StorageManager;
import models.Booking;
import threads.PaymentSimulatorThread;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

public class BookingController implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Enable CORS
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type,Authorization");

        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            InputStream is = exchange.getRequestBody();
            String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            System.out.println("[BOOKING-REQ] Received Payload: " + body);

            // Simple "parser" for prototype (Pure Java)
            String bookingId = "SV-BK-" + System.currentTimeMillis();
            Booking booking = new Booking(bookingId, "SV101", "Voyager Elite", "14A", 8450.0);
            
            // Extract data from body (very basic)
            if (body.contains("\"amount\":")) {
                String sub = body.substring(body.indexOf("\"amount\":") + 9);
                String val = sub.split("[,}]")[0].trim();
                booking.setTotalFare(Double.parseDouble(val));
            }
            if (body.contains("\"seat\":")) {
                String sub = body.substring(body.indexOf("\"seat\":") + 7);
                String val = sub.split("[\",}]")[0].trim();
                booking.setSeatId(val);
            }
            if (body.contains("\"flightId\":")) {
                String sub = body.substring(body.indexOf("\"flightId\":") + 11);
                String val = sub.split("[\",}]")[0].trim();
                booking.setFlightId(val);
            }
            if (body.contains("\"passengerName\":")) {
                String sub = body.substring(body.indexOf("\"passengerName\":") + 16);
                String val = sub.split("[\",}]")[0].trim();
                booking.setPassengerName(val);
            }

            // Start Payment Simulation Thread
            PaymentSimulatorThread paymentThread = new PaymentSimulatorThread(booking);
            paymentThread.start();

            try {
                paymentThread.join(); // Wait for simulation to finish
                if (paymentThread.getTransactionStatus()) {
                    booking.setStatus("PROTOTYPE_SIMULATED");
                    StorageManager.getInstance().persistBooking(booking);
                    sendResponse(exchange, "{\"status\":\"success\", \"bookingId\":\"" + booking.getBookingId() + "\"}", 200);
                } else {
                    sendResponse(exchange, "{\"status\":\"failure\", \"message\":\"Payment Simulation Failed\"}", 402);
                }
            } catch (InterruptedException e) {
                sendResponse(exchange, "{\"status\":\"error\", \"message\":\"Internal Processing Error\"}", 500);
            }
        } else if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
            // Admin Data Fetch
            List<Booking> bookings = StorageManager.getInstance().getAllBookings();
            String jsonResponse = "{\"status\":\"success\", \"bookings\":[" + 
                bookings.stream().map(b -> String.format(
                    "{\"bookingId\":\"%s\",\"flightId\":\"%s\",\"passengerName\":\"%s\",\"seatId\":\"%s\",\"amount\":%.2f,\"status\":\"%s\"}",
                    b.getBookingId(), b.getFlightId(), b.getPassengerName(), b.getSeatId(), b.getTotalFare(), b.getStatus()
                )).collect(Collectors.joining(",")) + 
            "]}";

            byte[] responseBytes = jsonResponse.getBytes();
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, responseBytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(responseBytes);
            }
        } else {
            exchange.sendResponseHeaders(405, -1);
        }
    }

    private void sendResponse(HttpExchange exchange, String response, int statusCode) throws IOException {
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}
