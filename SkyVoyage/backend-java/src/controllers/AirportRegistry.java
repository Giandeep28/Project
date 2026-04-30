package controllers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class AirportRegistry implements HttpHandler {

    public static class Airport {
        String iata;
        String icao;
        String name;
        String city;
        String country;
        double lat;
        double lon;
        String timezone;
        String currency;
        List<String> airlines = new ArrayList<>();

        public String toJson() {
            String airlinesJson = airlines.stream()
                    .map(s -> "\"" + s + "\"")
                    .collect(Collectors.joining(",", "[", "]"));
            
            return String.format(
                "{\"iata\":\"%s\",\"icao\":\"%s\",\"name\":\"%s\",\"city\":\"%s\",\"country\":\"%s\",\"lat\":%f,\"lon\":%f,\"timezone\":\"%s\",\"currency\":\"%s\",\"code\":\"%s\",\"airlines\":%s}",
                iata, icao, name, city, country, lat, lon, timezone, currency, iata, airlinesJson
            );
        }
    }

    private static final List<Airport> airports = new ArrayList<>();

    public AirportRegistry() {
        if (airports.isEmpty()) {
            loadAirports();
        }
    }

    public static Airport getAirport(String iata) {
        if (iata == null) return null;
        for (Airport a : airports) {
            if (iata.equalsIgnoreCase(a.iata)) return a;
        }
        return null;
    }

    private static void loadAirports() {
        try {
            String dbPath = "../database/airports_geo.json";
            String json = Files.readString(Paths.get(dbPath), StandardCharsets.UTF_8);

            // A simple JSON parser since we can't use external libraries easily
            // Each object is enclosed in {}
            Matcher m = Pattern.compile("\\{.*?\\}", Pattern.DOTALL).matcher(json);
            while (m.find()) {
                String obj = m.group();
                Airport a = new Airport();
                a.iata = extractStr(obj, "iata");
                a.icao = extractStr(obj, "icao");
                a.name = extractStr(obj, "name");
                a.city = extractStr(obj, "city");
                a.country = extractStr(obj, "country");
                a.lat = extractDouble(obj, "lat");
                a.lon = extractDouble(obj, "lon");
                a.timezone = extractStr(obj, "timezone");
                a.currency = extractStr(obj, "currency");

                // Dynamic Airline Assignment Logic
                if ("India".equalsIgnoreCase(a.country)) {
                    a.airlines.addAll(Arrays.asList("IndiGo", "Air India", "SpiceJet", "Vistara", "Akasa Air"));
                    if (Arrays.asList("DEL", "BOM", "BLR", "HYD", "MAA").contains(a.iata)) {
                        a.airlines.addAll(Arrays.asList("Emirates", "British Airways", "Lufthansa", "Singapore Airlines", "Qatar Airways"));
                    }
                } else if ("UAE".equalsIgnoreCase(a.country)) {
                    a.airlines.addAll(Arrays.asList("Emirates", "Etihad Airways", "FlyDubai", "Air Arabia", "Air India", "IndiGo"));
                } else if ("United Kingdom".equalsIgnoreCase(a.country)) {
                    a.airlines.addAll(Arrays.asList("British Airways", "Virgin Atlantic", "EasyJet", "Ryanair", "Emirates", "Air India"));
                } else if ("USA".equalsIgnoreCase(a.country)) {
                    a.airlines.addAll(Arrays.asList("Delta", "United", "American Airlines", "JetBlue", "British Airways", "Emirates"));
                } else {
                    a.airlines.addAll(Arrays.asList("SkyVoyage Celestial", "Star Alliance", "Global Connect", "OneWorld"));
                }

                if (a.iata != null && !a.iata.isEmpty()) {
                    airports.add(a);
                }
            }
            System.out.println("[AirportRegistry] Loaded " + airports.size() + " airports.");
        } catch (IOException e) {
            System.err.println("[AirportRegistry] Failed to load airports_geo.json: " + e.getMessage());
        }
    }

    private static String extractStr(String json, String key) {
        String marker = "\"" + key + "\":\\s*\"";
        Matcher m = Pattern.compile(marker + "([^\"]*)\"").matcher(json);
        if (m.find()) return m.group(1);
        return "";
    }

    private static double extractDouble(String json, String key) {
        String marker = "\"" + key + "\":\\s*([0-9.\\-]+)";
        Matcher m = Pattern.compile(marker).matcher(json);
        if (m.find()) {
            try {
                return Double.parseDouble(m.group(1));
            } catch (NumberFormatException ignored) {}
        }
        return 0.0;
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

            String path = ex.getRequestURI().getPath();
            String query = ex.getRequestURI().getQuery();

            if (path.equals("/api/airports/all")) {
                handleAll(ex);
            } else if (path.equals("/api/airports/search")) {
                handleSearch(ex, query);
            } else if (path.startsWith("/api/airports/country/")) {
                String country = path.substring("/api/airports/country/".length());
                handleCountry(ex, country);
            } else if (path.startsWith("/api/airports/")) {
                String iata = path.substring("/api/airports/".length());
                handleIata(ex, iata);
            } else {
                // The root /api/airports acts like search for backward compatibility
                handleSearch(ex, query);
            }

        } catch (Exception e) {
            e.printStackTrace();
            sendJson(ex, 500, "{\"error\":\"Internal Server Error\"}");
        } finally {
            ex.close();
        }
    }

    private void handleAll(HttpExchange ex) throws IOException {
        String jsonList = airports.stream()
                .map(Airport::toJson)
                .collect(Collectors.joining(",", "[", "]"));
        sendJson(ex, 200, jsonList);
    }

    private void handleSearch(HttpExchange ex, String queryStr) throws IOException {
        String q = "";
        if (queryStr != null) {
            for (String p : queryStr.split("&")) {
                if (p.startsWith("q=")) {
                    q = java.net.URLDecoder.decode(p.substring(2), "UTF-8").toLowerCase().trim();
                }
            }
        }

        if (q.isEmpty()) {
            handleAll(ex);
            return;
        }

        final String fq = q;

        List<Airport> matches = new ArrayList<>();
        
        // Pass 1: exact IATA match
        airports.stream().filter(a -> a.iata.toLowerCase().equals(fq)).forEach(matches::add);
        
        // Pass 2: City starts with
        airports.stream().filter(a -> !matches.contains(a) && a.city.toLowerCase().startsWith(fq)).forEach(matches::add);
        
        // Pass 3: Airport name contains
        airports.stream().filter(a -> !matches.contains(a) && a.name.toLowerCase().contains(fq)).forEach(matches::add);

        // Pass 4: Country contains
        airports.stream().filter(a -> !matches.contains(a) && a.country.toLowerCase().contains(fq)).forEach(matches::add);

        // Top 10 matches
        String jsonList = matches.stream().limit(10)
                .map(Airport::toJson)
                .collect(Collectors.joining(",", "[", "]"));
        sendJson(ex, 200, jsonList);
    }

    private void handleCountry(HttpExchange ex, String countryStr) throws IOException {
        String country = java.net.URLDecoder.decode(countryStr, "UTF-8").toLowerCase();
        String jsonList = airports.stream()
                .filter(a -> a.country.toLowerCase().equalsIgnoreCase(country))
                .map(Airport::toJson)
                .collect(Collectors.joining(",", "[", "]"));
        sendJson(ex, 200, jsonList);
    }

    private void handleIata(HttpExchange ex, String iataStr) throws IOException {
        String iata = java.net.URLDecoder.decode(iataStr, "UTF-8").toLowerCase();
        Optional<Airport> airport = airports.stream()
                .filter(a -> a.iata.toLowerCase().equals(iata))
                .findFirst();

        if (airport.isPresent()) {
            sendJson(ex, 200, airport.get().toJson());
        } else {
            sendJson(ex, 404, "{\"error\":\"Airport not found\"}");
        }
    }

    private void sendJson(HttpExchange ex, int status, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        ex.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        ex.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(bytes);
        }
    }
}
