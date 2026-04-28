package controllers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import utils.ApiUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class MealsController implements HttpHandler {
    private String rawJson;
    private Map<String, Object> mealsDb;

    public MealsController() {
        loadDatabase();
    }

    private void loadDatabase() {
        try {
            // Locate database/airline_meals.json relative to project root
            File dbPath = new File("../database/airline_meals.json");
            if (!dbPath.exists()) {
                dbPath = new File("database/airline_meals.json");
            }
            
            if (dbPath.exists()) {
                rawJson = Files.readString(dbPath.toPath());
                mealsDb = utils.SimpleJson.parseObject(rawJson);
            } else {
                System.err.println("Database file not found: " + dbPath.getAbsolutePath());
                mealsDb = new HashMap<>();
                mealsDb.put("airlines", new HashMap<>());
            }
        } catch (Exception e) {
            System.err.println("Error loading meals database: " + e.getMessage());
            mealsDb = new HashMap<>();
        }
    }

    @Override
    public void handle(HttpExchange ex) throws IOException {
        try {
            String path = ex.getRequestURI().getPath();
            
            if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) {
                ApiUtils.writeJson(ex, 204, "");
                return;
            }

            if (path.contains("/stopover")) {
                getStopoverMeals(ex);
                return;
            }

            // Path format: /api/food/meals/{code} or /api/food/meals/{code}/category/{cat}
            String[] segments = path.split("/");
            // segments: ["", "api", "food", "meals", "{code}", "category", "{cat}"]
            if (segments.length == 5) {
                getAirlineMeals(segments[4], ex);
            } else if (segments.length == 7 && segments[5].equals("category")) {
                getMealsByCategory(segments[4], segments[6], ex);
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

    private void getStopoverMeals(HttpExchange ex) throws IOException {
        String airline = ApiUtils.getParam(ex, "airline");
        String stopoverAirport = ApiUtils.getParam(ex, "stopover_airport");
        String arrivalTime = ApiUtils.getParam(ex, "arrival_time");
        String departureTime = ApiUtils.getParam(ex, "departure_time");

        if (airline == null || stopoverAirport == null || arrivalTime == null || departureTime == null) {
            ApiUtils.writeError(ex, 400, "Missing required parameters");
            return;
        }

        airline = airline.toUpperCase();
        Map<String, Object> airlines = (Map<String, Object>) mealsDb.get("airlines");
        Map<String, Object> airlineData = (Map<String, Object>) airlines.get(airline);

        if (airlineData == null) {
            ApiUtils.writeError(ex, 404, "Airline " + airline + " not found");
            return;
        }

        try {
            OffsetDateTime arrDt = OffsetDateTime.parse(arrivalTime.replace("Z", "+00:00"));
            OffsetDateTime depDt = OffsetDateTime.parse(departureTime.replace("Z", "+00:00"));

            long durationMins = Duration.between(arrDt, depDt).toMinutes();

            if (durationMins <= 0) {
                ApiUtils.writeError(ex, 400, "Departure time must be after arrival time");
                return;
            }

            OffsetDateTime startTime = arrDt.plusMinutes(30);
            OffsetDateTime endTime = depDt.plusMinutes(-45);

            List<String> slots = new ArrayList<>();
            OffsetDateTime currentTime = startTime;
            while (!currentTime.isAfter(endTime)) {
                slots.add(currentTime.toString());
                currentTime = currentTime.plusMinutes(30);
            }

            StringBuilder sb = new StringBuilder();
            sb.append("{");
            sb.append("\"airline\":\"").append(airlineData.get("name")).append("\",");
            sb.append("\"meals\":").append(utils.SimpleJson.stringify(airlineData.get("meals"))).append(",");
            sb.append("\"delivery_slots\":").append(utils.SimpleJson.stringify(slots)).append(",");
            sb.append("\"stopover_duration_minutes\":").append(durationMins);
            sb.append("}");

            ApiUtils.writeJson(ex, 200, sb.toString());
        } catch (DateTimeParseException e) {
            ApiUtils.writeError(ex, 400, "Invalid date format. Please use ISO format.");
        }
    }

    private void getAirlineMeals(String code, HttpExchange ex) throws IOException {
        code = code.toUpperCase();
        Map<String, Object> airlines = (Map<String, Object>) mealsDb.get("airlines");
        Object airlineData = airlines.get(code);

        if (airlineData == null) {
            ApiUtils.writeError(ex, 404, "Airline " + code + " not found");
            return;
        }

        ApiUtils.writeJson(ex, 200, utils.SimpleJson.stringify(airlineData));
    }

    private void getMealsByCategory(String code, String category, HttpExchange ex) throws IOException {
        code = code.toUpperCase();
        Map<String, Object> airlines = (Map<String, Object>) mealsDb.get("airlines");
        Map<String, Object> airlineData = (Map<String, Object>) airlines.get(code);

        if (airlineData == null) {
            ApiUtils.writeError(ex, 404, "Airline " + code + " not found");
            return;
        }

        List<Map<String, Object>> meals = (List<Map<String, Object>>) airlineData.get("meals");
        List<Map<String, Object>> filtered = new ArrayList<>();
        if (meals != null) {
            for (Map<String, Object> meal : meals) {
                String cat = (String) meal.get("category");
                if (cat != null && cat.equalsIgnoreCase(category)) {
                    filtered.add(meal);
                }
            }
        }

        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"airline\":\"").append(airlineData.get("name")).append("\",");
        sb.append("\"category\":\"").append(category).append("\",");
        sb.append("\"meals\":").append(utils.SimpleJson.stringify(filtered));
        sb.append("}");

        ApiUtils.writeJson(ex, 200, sb.toString());
    }
}
