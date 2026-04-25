package controllers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import models.Booking;
import services.StorageManager;
import threads.PaymentSimulatorThread;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Random;

/**
 * Handles /api/bookings
 *
 * POST /api/bookings  — create booking, return confirmed record
 * GET  /api/bookings  — list all bookings (admin)
 * GET  /api/bookings/{id} — fetch single booking or 404
 *
 * Response schema (POST success):
 * {
 *   "bookingId": "BK-XXXXXXXX",
 *   "pnr": "XXXXXX",
 *   "status": "CONFIRMED",
 *   "flightId": "string",
 *   "seatClass": "string",
 *   "contactEmail": "string",
 *   "totalPrice": number,
 *   "bookedAt": "ISO-8601"
 * }
 *
 * CORS origin: http://localhost:3000
 * exchange.close() called in finally on every path.
 */
public class BookingController implements HttpHandler {

    private static final String CHARS  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final Random RNG    = new Random();

    // ── CORS ──────────────────────────────────────────────────────────────────

    private void cors(HttpExchange ex) {
        String origin = ex.getRequestHeaders().getFirst("Origin");
        String allow  = (origin != null &&
                (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")))
                ? origin : "http://localhost:3000";
        ex.getResponseHeaders().set("Access-Control-Allow-Origin",      allow);
        ex.getResponseHeaders().set("Access-Control-Allow-Methods",     "GET, POST, OPTIONS");
        ex.getResponseHeaders().set("Access-Control-Allow-Headers",     "Content-Type, Authorization");
        ex.getResponseHeaders().set("Access-Control-Allow-Credentials", "true");
        ex.getResponseHeaders().set("Access-Control-Max-Age",           "86400");
    }

    // ── Handler ───────────────────────────────────────────────────────────────

    @Override
    public void handle(HttpExchange ex) throws IOException {
        cors(ex);
        try {
            if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) {
                ex.sendResponseHeaders(204, -1);
                return;
            }

            String method = ex.getRequestMethod().toUpperCase();
            String path   = ex.getRequestURI().getPath();

            switch (method) {
                case "POST" -> handleCreate(ex);
                case "GET"  -> {
                    // /api/bookings/{id}
                    if (path.matches(".*/bookings/[^/]+")) {
                        String id = path.substring(path.lastIndexOf('/') + 1);
                        handleGetOne(ex, id);
                    } else {
                        handleList(ex);
                    }
                }
                default -> send(ex, 405, "{\"error\":\"Method not allowed\"}");
            }
        } finally {
            ex.close();
        }
    }

    // ── POST /api/bookings ────────────────────────────────────────────────────

    private void handleCreate(HttpExchange ex) throws IOException {
        String body;
        try (InputStream is = ex.getRequestBody()) {
            body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }

        // Extract fields from JSON body
        String flightId     = parseStr(body, "flightId",     "UNKNOWN");
        String from         = parseStr(body, "from",         "---");
        String to           = parseStr(body, "to",           "---");
        String seatClass    = parseStr(body, "seatClass",    "ECONOMY");
        String contactEmail = parseStr(body, "contactEmail", "guest@skyvoyage.com");
        double totalPrice   = parseDbl(body, "totalPrice",   0.0);

        // Generate IDs
        String bookingId = "BK-" + randomAlpha(8);
        String pnr       = randomAlpha(6);
        String bookedAt  = Instant.now().toString();

        // Persist to storage
        Booking booking = new Booking(bookingId, flightId, from, to, contactEmail, seatClass, totalPrice);
        booking.setStatus("CONFIRMED");

        // Run payment simulation
        PaymentSimulatorThread payThread = new PaymentSimulatorThread(booking);
        payThread.start();
        try {
            payThread.join();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            send(ex, 500, "{\"error\":\"Payment processing interrupted\"}");
            return;
        }

        if (!payThread.getTransactionStatus()) {
            send(ex, 402, "{\"error\":\"Payment simulation failed\",\"message\":\"Card declined. Please try again.\"}");
            return;
        }

        booking.setStatus("CONFIRMED");
        StorageManager.getInstance().persistBooking(booking);

        send(ex, 200, String.format(
            "{\"bookingId\":\"%s\",\"pnr\":\"%s\",\"status\":\"CONFIRMED\"," +
            "\"flightId\":\"%s\",\"seatClass\":\"%s\",\"contactEmail\":\"%s\"," +
            "\"totalPrice\":%.2f,\"bookedAt\":\"%s\"}",
            bookingId, pnr, flightId, seatClass, contactEmail, totalPrice, bookedAt
        ));
    }

    // ── GET /api/bookings/{id} ────────────────────────────────────────────────

    private void handleGetOne(HttpExchange ex, String id) throws IOException {
        Booking b = StorageManager.getInstance().getBookingById(id);
        if (b == null) {
            send(ex, 404, "{\"error\":\"Booking not found\",\"id\":\"" + id + "\"}");
            return;
        }
        send(ex, 200, String.format(
            "{\"bookingId\":\"%s\",\"flightId\":\"%s\",\"passengerName\":\"%s\"," +
            "\"seatClass\":\"%s\",\"totalPrice\":%.2f,\"status\":\"%s\"}",
            b.getBookingId(), b.getFlightId(), b.getPassengerName(),
            b.getSeatId(), b.getTotalFare(), b.getStatus()
        ));
    }

    // ── GET /api/bookings ─────────────────────────────────────────────────────

    private void handleList(HttpExchange ex) throws IOException {
        var bookings = StorageManager.getInstance().getAllBookings();
        StringBuilder sb = new StringBuilder("{\"status\":\"success\",\"bookings\":[");
        boolean first = true;
        for (Booking b : bookings) {
            if (!first) sb.append(",");
            sb.append(String.format(
                "{\"bookingId\":\"%s\",\"flightId\":\"%s\",\"passengerName\":\"%s\"," +
                "\"seatId\":\"%s\",\"amount\":%.2f,\"from\":\"%s\",\"to\":\"%s\",\"status\":\"%s\"}",
                b.getBookingId(), b.getFlightId(), b.getPassengerName(),
                b.getSeatId(), b.getTotalFare(), b.getFrom(), b.getTo(), b.getStatus()
            ));
            first = false;
        }
        sb.append("]}");
        send(ex, 200, sb.toString());
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String randomAlpha(int len) {
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) sb.append(CHARS.charAt(RNG.nextInt(CHARS.length())));
        return sb.toString();
    }

    private String parseStr(String json, String key, String fallback) {
        String marker = "\"" + key + "\":\"";
        int idx = json.indexOf(marker);
        if (idx < 0) return fallback;
        String sub = json.substring(idx + marker.length());
        int end = sub.indexOf('"');
        return end >= 0 ? sub.substring(0, end).trim() : fallback;
    }

    private double parseDbl(String json, String key, double fallback) {
        String marker = "\"" + key + "\":";
        int idx = json.indexOf(marker);
        if (idx < 0) return fallback;
        String sub = json.substring(idx + marker.length()).trim();
        String num = sub.split("[,}\\]]")[0].trim();
        try { return Double.parseDouble(num); }
        catch (NumberFormatException e) { return fallback; }
    }

    private void send(HttpExchange ex, int status, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        ex.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        ex.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(bytes);
        }
    }
}
