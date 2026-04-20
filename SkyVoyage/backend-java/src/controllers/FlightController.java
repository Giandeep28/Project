package controllers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.logging.Logger;

/**
 * GET /api/flights?origin=DEL&dest=BOM&date=2026-05-01&guests=1
 *
 * Returns a JSON envelope:
 * { "flights": [...], "count": N, "origin": "DEL", "destination": "BOM" }
 *
 * Each flight object matches the exact schema required by SearchResults.jsx.
 * CORS origin: http://localhost:3000
 * exchange.close() is called in a finally block on every path.
 */
public class FlightController implements HttpHandler {

    private static final Logger LOGGER = Logger.getLogger(FlightController.class.getName());

    // ── CORS ──────────────────────────────────────────────────────────────────

    private void cors(HttpExchange ex) {
        String origin = ex.getRequestHeaders().getFirst("Origin");
        String allow  = (origin != null &&
                (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")))
                ? origin : "http://localhost:3000";
        ex.getResponseHeaders().set("Access-Control-Allow-Origin",      allow);
        ex.getResponseHeaders().set("Access-Control-Allow-Methods",     "GET, OPTIONS");
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
            if (!"GET".equalsIgnoreCase(ex.getRequestMethod())) {
                send(ex, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            // Parse query params
            String rawQ   = ex.getRequestURI().getQuery();
            String origin = null, dest = null, date = "", guests = "1";
            if (rawQ != null) {
                for (String pair : rawQ.split("&")) {
                    String[] kv = pair.split("=", 2);
                    if (kv.length == 2) {
                        String k = java.net.URLDecoder.decode(kv[0], StandardCharsets.UTF_8);
                        String v = java.net.URLDecoder.decode(kv[1], StandardCharsets.UTF_8);
                        switch (k) {
                            case "origin" -> origin = v.toUpperCase().trim();
                            case "dest"   -> dest   = v.toUpperCase().trim();
                            case "date"   -> date   = v;
                            case "guests" -> guests = v;
                        }
                    }
                }
            }

            if (origin == null || origin.isEmpty() || dest == null || dest.isEmpty()) {
                send(ex, 400, "{\"error\":\"origin and dest query params are required\"}");
                return;
            }

            String json = buildFlightJson(origin, dest, date);
            send(ex, 200, json);

        } finally {
            ex.close();
        }
    }

    // ── Data ██████████████████████████████████████████████████████████████████

    /**
     * Builds a realistic flight catalogue for the given origin/dest pair.
     * All prices INR, durations in minutes, times ISO-8601.
     */
    private String buildFlightJson(String origin, String dest, String date) {
        String baseDate;
        if (date != null && date.matches("\\d{4}-\\d{2}-\\d{2}")) {
            baseDate = date;
        } else {
            baseDate = LocalDateTime.now().plusDays(1).format(DateTimeFormatter.ISO_LOCAL_DATE);
        }

        List<String> indianAirports = Arrays.asList(
            "DEL", "BOM", "BLR", "MAA", "CCU", "HYD", "COK", "PNQ", "AMD", "GOI", 
            "JAI", "LKO", "VNS", "ATQ", "NAG", "IXC", "SXR", "GAU"
        );
        boolean isDomestic = indianAirports.contains(origin) && indianAirports.contains(dest);

        // Vistara removed per user request (merged with Air India)
        String[][] domesticAirlines = {
            {"Air India", "AI"}, {"IndiGo", "6E"}, {"SpiceJet", "SG"}, {"Akasa Air", "QP"}
        };
        String[][] intlAirlines = {
            {"Air India", "AI"}, {"IndiGo", "6E"}, {"SpiceJet", "SG"}, {"Akasa Air", "QP"},
            {"Emirates", "EK"}, {"British Airways", "BA"}, {"Singapore Airlines", "SQ"}, 
            {"Qatar Airways", "QR"}, {"Lufthansa", "LH"}, {"Etihad Airways", "EY"}
        };

        String[][] airlines = isDomestic ? domesticAirlines : intlAirlines;
        int baseDur = isDomestic ? 90 : 360;
        int durVar = isDomestic ? 90 : 500;
        int basePrice = isDomestic ? 4000 : 30000;
        int priceVar = isDomestic ? 6000 : 80000;
        
        Random rng = new Random((origin + dest).hashCode()); // stable random
        
        StringBuilder sb = new StringBuilder();
        sb.append("{\"flights\":[");
        int count = isDomestic ? 12 : 10;
        for (int i = 0; i < count; i++) {
            // Strictly guarantee every airline is shown at least once
            String[] al = airlines[i % airlines.length];
            String airline = al[0];
            String code = al[1];
            String fno = code + "-" + (100 + rng.nextInt(900));
            String logo = "https://pics.avs.io/200/80/" + code + ".png";
            
            int dur = baseDur + rng.nextInt(durVar);
            int stops = isDomestic ? (rng.nextDouble() < 0.7 ? 0 : 1) : (rng.nextDouble() < 0.4 ? 0 : (rng.nextDouble() < 0.8 ? 1 : 2));
            double price = basePrice + rng.nextInt(priceVar);
            
            int depH = rng.nextInt(24);
            int depM = rng.nextInt(60);
            
            LocalDateTime depTime = LocalDateTime.parse(baseDate + "T00:00:00").plusHours(depH).plusMinutes(depM);
            LocalDateTime arrTime = depTime.plusMinutes(dur);
            
            String depStr = depTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            String arrStr = arrTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            
            String[] classes = {"ECONOMY", "BUSINESS", "FIRST"};
            String cls = classes[rng.nextInt(3)];
            int seats = 1 + rng.nextInt(60);
            
            double raw = (20000.0 / price) * (200.0 / dur) * 50;
            double score = Math.min(100, Math.max(0, Math.round(raw)));
            
            if (i > 0) sb.append(",");
            sb.append(String.format(
                "{\"id\":\"f-%03d\",\"airline\":\"%s\",\"airlineLogo\":\"%s\",\"flightNumber\":\"%s\"," +
                "\"origin\":\"%s\",\"destination\":\"%s\"," +
                "\"departureTime\":\"%s\",\"arrivalTime\":\"%s\"," +
                "\"duration\":%d,\"stops\":%d,\"price\":%.0f," +
                "\"seatClass\":\"%s\",\"seatsAvailable\":%d,\"score\":%.0f}",
                i+1, airline, logo, fno, origin, dest, depStr, arrStr,
                dur, stops, price, cls, seats, score
            ));
        }
        sb.append(String.format("],\"count\":%d,\"origin\":\"%s\",\"destination\":\"%s\"}", count, origin, dest));
        return sb.toString();
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private void send(HttpExchange ex, int status, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        ex.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        ex.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(bytes);
        }
    }
}
