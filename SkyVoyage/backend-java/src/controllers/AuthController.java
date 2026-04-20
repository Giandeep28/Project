package controllers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import services.StorageManager;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * Handles:
 *   POST /api/auth/login   — { email, password } → { id, email, role, token }
 *   POST /api/auth/logout  — clears session (stateless) → { success: true }
 *   GET  /api/auth/me      — reads Authorization: Bearer <token> → user or 401
 *
 * Credential key: "email" (not "username") — matches ApiClient.js and Login.jsx.
 * CORS origin: http://localhost:3000
 * exchange.close() called in finally on every path.
 */
public class AuthController implements HttpHandler {

    private static final String ADMIN_EMAIL    = "admin@skyvoyage.com";
    private static final String ADMIN_PASSWORD = "skyvoyage2026";

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

            String path   = ex.getRequestURI().getPath();
            String method = ex.getRequestMethod().toUpperCase();

            if (path.endsWith("/register")  && "POST".equals(method)) { doRegister(ex);  return; }
            if (path.endsWith("/login")  && "POST".equals(method)) { doLogin(ex);  return; }
            if (path.endsWith("/logout") && "POST".equals(method)) { doLogout(ex); return; }
            if (path.endsWith("/me")     && "GET".equals(method))  { doMe(ex);     return; }

            send(ex, 405, "{\"error\":\"Method not allowed\"}");
        } finally {
            ex.close();
        }
    }

    // ── POST /api/auth/register ───────────────────────────────────────────────

    private void doRegister(HttpExchange ex) throws IOException {
        String body;
        try (InputStream is = ex.getRequestBody()) {
            body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }

        String email    = parseStr(body, "email");
        String password = parseStr(body, "password");
        String name     = parseStr(body, "name");
        String phone    = parseStr(body, "phone");

        if (email.isEmpty() || password.isEmpty() || name.isEmpty() || phone.isEmpty()) {
            send(ex, 400, "{\"error\":\"Missing required fields\"}");
            return;
        }

        boolean created = StorageManager.getInstance().registerUser(email, password, name, phone);
        if (!created) {
            send(ex, 409, "{\"error\":\"User already exists\"}");
            return;
        }

        send(ex, 201, "{\"success\":true,\"message\":\"User successfully created\"}");
    }

    // ── POST /api/auth/login ──────────────────────────────────────────────────

    private void doLogin(HttpExchange ex) throws IOException {
        String body;
        try (InputStream is = ex.getRequestBody()) {
            body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }

        String email    = parseStr(body, "email");
        String password = parseStr(body, "password");

        boolean isAdmin = ADMIN_EMAIL.equalsIgnoreCase(email) && ADMIN_PASSWORD.equals(password);
        String savedPass = StorageManager.getInstance().getUserPassword(email);
        boolean isUser = !isAdmin && savedPass != null && savedPass.equals(password);

        if (!isAdmin && !isUser) {
            send(ex, 401, "{\"error\":\"Invalid credentials\",\"message\":\"Email or password is incorrect\"}");
            return;
        }

        String role = isAdmin ? "admin" : "user";
        long   exp     = System.currentTimeMillis() + 3_600_000L;
        String payload = String.format(
            "{\"id\":\"u1\",\"email\":\"%s\",\"role\":\"%s\",\"exp\":%d}",
            email, role, exp);
        String token = "SV_" + Base64.getEncoder().encodeToString(payload.getBytes(StandardCharsets.UTF_8));

        send(ex, 200, String.format(
            "{\"id\":\"u1\",\"email\":\"%s\",\"role\":\"%s\",\"token\":\"%s\"}",
            email, role, token));
    }

    // ── POST /api/auth/logout ─────────────────────────────────────────────────

    private void doLogout(HttpExchange ex) throws IOException {
        // Stateless JWT — client is responsible for discarding the token.
        send(ex, 200, "{\"success\":true,\"message\":\"Logged out\"}");
    }

    // ── GET /api/auth/me ──────────────────────────────────────────────────────

    private void doMe(HttpExchange ex) throws IOException {
        String auth = ex.getRequestHeaders().getFirst("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            send(ex, 401, "{\"error\":\"No token provided\"}");
            return;
        }
        String token = auth.substring(7);
        try {
            String encoded = token.startsWith("SV_") ? token.substring(3) : token;
            String decoded = new String(Base64.getDecoder().decode(encoded), StandardCharsets.UTF_8);
            String email   = parseStr(decoded, "email");
            String role    = parseStr(decoded, "role");
            long   exp     = parseLng(decoded, "exp");
            if (System.currentTimeMillis() > exp) {
                send(ex, 401, "{\"error\":\"Token expired\"}");
                return;
            }
            send(ex, 200, String.format(
                "{\"id\":\"u1\",\"email\":\"%s\",\"role\":\"%s\"}", email, role));
        } catch (Exception e) {
            send(ex, 401, "{\"error\":\"Invalid token\"}");
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String parseStr(String json, String key) {
        String marker = "\"" + key + "\":\"";
        int idx = json.indexOf(marker);
        if (idx < 0) return "";
        String sub = json.substring(idx + marker.length());
        int end = sub.indexOf('"');
        return end >= 0 ? sub.substring(0, end).trim() : "";
    }

    private long parseLng(String json, String key) {
        String marker = "\"" + key + "\":";
        int idx = json.indexOf(marker);
        if (idx < 0) return 0L;
        String sub = json.substring(idx + marker.length()).trim();
        String num = sub.split("[,}\\]]")[0].trim();
        try { return Long.parseLong(num); }
        catch (NumberFormatException e) { return 0L; }
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
