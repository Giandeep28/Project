package controllers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import services.CacheManager;
import services.LiveFlightService;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.logging.Logger;

/**
 * Enterprise HttpHandler for flight retrieval.
 * Optimizes performance by implementing a Cache-First strategy followed by asynchronous live API fetching.
 */
public class FlightController implements HttpHandler {
    private static final Logger LOGGER = Logger.getLogger(FlightController.class.getName());
    private static final LiveFlightService liveFlightService = new LiveFlightService();
    private static final CacheManager cacheManager = new CacheManager();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Enforce CORS for premium frontend access
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
        exchange.getResponseHeaders().set("Content-Type", "application/json");

        if ("OPTIONS".equals(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if (!"GET".equals(exchange.getRequestMethod())) {
            String error = "{\"error\": \"Invalid Request Orbit\"}";
            sendResponse(exchange, 405, error);
            return;
        }

        // Parse query parameters
        String query = exchange.getRequestURI().getQuery();
        String origin = "DEL"; // Defaults
        String destination = "BOM";

        if (query != null) {
            String[] pairs = query.split("&");
            for (String pair : pairs) {
                String[] kv = pair.split("=");
                if (kv.length == 2) {
                    if (kv[0].equals("from")) origin = kv[1];
                    if (kv[0].equals("to")) destination = kv[1];
                }
            }
        }

        String cacheKey = "flights_" + origin + "_" + destination;
        String cachedResponse = cacheManager.get(cacheKey);

        if (cachedResponse != null) {
            sendResponse(exchange, 200, cachedResponse);
        } else {
            // Async fetch with service and update cache
            final String finalOrigin = origin;
            final String finalDestination = destination;
            
            liveFlightService.fetchLiveFlightsAsync(origin, destination)
                    .thenAccept(liveData -> {
                        try {
                            cacheManager.put(cacheKey, liveData);
                            sendResponse(exchange, 200, liveData);
                        } catch (IOException e) {
                            LOGGER.severe("Hub Transmission Failure: " + e.getMessage());
                        }
                    })
                    .exceptionally(ex -> {
                        try {
                            sendResponse(exchange, 500, "{\"error\": \"Celestial Engine Stall\"}");
                        } catch (IOException e) {
                            LOGGER.severe("Critial Failure: " + e.getMessage());
                        }
                        return null;
                    });
        }
    }

    private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}
