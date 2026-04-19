package controllers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class AuthController implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Global CORS Headers (Set before method check)
        addCorsHeaders(exchange);

        String method = exchange.getRequestMethod();

        if (method.equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            exchange.close();
            return;
        }

        if (method.equalsIgnoreCase("POST")) {
            InputStream is = exchange.getRequestBody();
            String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);

            // Simple Credential Check (Prototype)
            if (body.contains("\"username\":\"admin\"") && body.contains("\"password\":\"skyvoyage2026\"")) {
                // Generate a "Prototype JWT" (Base64 encoded string)
                String payload = "{\"user\":\"admin\", \"role\":\"commander\", \"exp\":" + (System.currentTimeMillis() + 3600000) + "}";
                String token = Base64.getEncoder().encodeToString(payload.getBytes());
                
                String response = "{\"status\":\"success\", \"token\":\"V_LOG_" + token + "\", \"user\":\"Alexander\"}";
                sendResponse(exchange, response, 200);
            } else {
                sendResponse(exchange, "{\"status\":\"error\", \"message\":\"Unauthorized: Invalid Mission Credentials\"}", 401);
            }
        } else {
            sendResponse(exchange, "{\"status\":\"error\", \"message\":\"Method Not Allowed\"}", 405);
        }
    }

    private void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        exchange.getResponseHeaders().set("Access-Control-Max-Age", "3600");
    }

    private void sendResponse(HttpExchange exchange, String response, int statusCode) throws IOException {
        addCorsHeaders(exchange);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }
}
