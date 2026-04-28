package utils;

import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Random;

public class ApiUtils {

    public static void addCors(HttpExchange ex) {
        String origin = ex.getRequestHeaders().getFirst("Origin");
        String allow = (origin != null && (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")))
                ? origin : "http://localhost:3000";
        ex.getResponseHeaders().set("Access-Control-Allow-Origin", allow);
        ex.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        ex.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        ex.getResponseHeaders().set("Access-Control-Allow-Credentials", "true");
        ex.getResponseHeaders().set("Access-Control-Max-Age", "86400");
    }

    public static void writeJson(HttpExchange ex, int status, String json) throws IOException {
        addCors(ex);
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        ex.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        ex.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(bytes);
        }
    }

    public static void writeError(HttpExchange ex, int status, String detail) throws IOException {
        String json = String.format("{\"detail\":\"%s\"}", detail.replace("\"", "\\\""));
        writeJson(ex, status, json);
    }

    public static String getParam(HttpExchange ex, String name) {
        String query = ex.getRequestURI().getQuery();
        if (query == null) return null;
        for (String param : query.split("&")) {
            String[] entry = param.split("=");
            if (entry.length > 1 && entry[0].equals(name)) {
                return java.net.URLDecoder.decode(entry[1], StandardCharsets.UTF_8);
            }
        }
        return null;
    }

    public static String requireParam(HttpExchange ex, String name) throws IllegalArgumentException {
        String val = getParam(ex, name);
        if (val == null || val.isEmpty()) {
            throw new IllegalArgumentException("Missing required parameter: " + name);
        }
        return val;
    }

    public static <T> T chooseWeighted(Random rng, T[] items, double[] weights) {
        double r = rng.nextDouble();
        double sum = 0;
        for (int i = 0; i < items.length; i++) {
            sum += weights[i];
            if (r < sum) return items[i];
        }
        return items[items.length - 1];
    }

    public static int chooseFrom(Random rng, int[] choices) {
        return choices[rng.nextInt(choices.length)];
    }
}
