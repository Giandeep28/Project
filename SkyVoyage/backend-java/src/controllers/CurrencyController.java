package controllers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import utils.ApiUtils;
import utils.SimpleJson;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

public class CurrencyController implements HttpHandler {
    private static final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private static volatile Map<String, Object> cachedRates = null;
    private static volatile String cachedBase = "USD";
    private static volatile long cacheTimestamp = 0L;
    private static final long CACHE_TTL_MS = 3_600_000L; // 1 hour
    private static final Object CACHE_LOCK = new Object();

    @Override
    public void handle(HttpExchange ex) throws IOException {
        try {
            String path = ex.getRequestURI().getPath();
            
            if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) {
                ApiUtils.writeJson(ex, 204, "");
                return;
            }

            if (path.contains("/rates/")) {
                String[] segments = path.split("/");
                // segments: ["", "api", "currency", "rates", "{from}", "{to}"]
                if (segments.length == 6) {
                    getConversionRate(segments[4], segments[5], ex);
                } else {
                    ApiUtils.writeError(ex, 400, "Invalid conversion path");
                }
            } else if (path.contains("/rates")) {
                getAllRates(ex);
            } else {
                ApiUtils.writeError(ex, 404, "Not Found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            ApiUtils.writeError(ex, 500, "Internal Server Error: " + e.getMessage());
        } finally {
            ex.close();
        }
    }

    private void getAllRates(HttpExchange ex) throws IOException {
        try {
            Map<String, Object> data = fetchRates();
            ApiUtils.writeJson(ex, 200, SimpleJson.stringify(data));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "rates unavailable");
            ApiUtils.writeJson(ex, 200, SimpleJson.stringify(error));
        }
    }

    private void getConversionRate(String from, String to, HttpExchange ex) throws IOException {
        try {
            from = from.toUpperCase();
            to = to.toUpperCase();

            Map<String, Object> data = fetchRates();
            @SuppressWarnings("unchecked")
            Map<String, Object> rates = (Map<String, Object>) data.get("rates");

            if (!rates.containsKey(from) || !rates.containsKey(to)) {
                ApiUtils.writeError(ex, 400, "Invalid currency code");
                return;
            }

            double fromRate = (double) rates.get(from);
            double toRate = (double) rates.get(to);
            double rate = toRate / fromRate;

            Map<String, Object> result = new HashMap<>();
            result.put("from", from);
            result.put("to", to);
            result.put("rate", rate);
            result.put("updated", data.get("updated"));
            ApiUtils.writeJson(ex, 200, SimpleJson.stringify(result));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "rates unavailable");
            ApiUtils.writeJson(ex, 200, SimpleJson.stringify(error));
        }
    }

    private Map<String, Object> fetchRates() throws Exception {
        long currentTime = System.currentTimeMillis();

        if (cachedRates != null && (currentTime - cacheTimestamp) < CACHE_TTL_MS) {
            return buildResponse(cachedBase, cachedRates, cacheTimestamp, false);
        }

        synchronized (CACHE_LOCK) {
            if (cachedRates != null && (currentTime - cacheTimestamp) < CACHE_TTL_MS) {
                return buildResponse(cachedBase, cachedRates, cacheTimestamp, false);
            }

            try {
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("https://open.er-api.com/v6/latest/USD"))
                        .timeout(Duration.ofSeconds(10))
                        .GET()
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() == 200) {
                    Map<String, Object> root = SimpleJson.parseObject(response.body());
                    cachedRates = (Map<String, Object>) root.get("rates");
                    cachedBase = (String) root.get("base_code");
                    cacheTimestamp = currentTime;
                    return buildResponse(cachedBase, cachedRates, cacheTimestamp, false);
                }
            } catch (Exception e) {
                System.err.println("Currency API failed: " + e.getMessage());
            }

            if (cachedRates != null) {
                return buildResponse(cachedBase, cachedRates, cacheTimestamp, true);
            }

            throw new Exception("rates unavailable");
        }
    }

    private Map<String, Object> buildResponse(String base, Map<String, Object> rates, long updated, boolean stale) {
        Map<String, Object> res = new HashMap<>();
        res.put("base", base);
        res.put("rates", rates);
        res.put("updated", updated / 1000L);
        if (stale) res.put("stale", true);
        return res;
    }
}
