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
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class TrackingController implements HttpHandler {
    private static final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private static final String AVIATIONSTACK_KEY = System.getenv("AVIATIONSTACK_API_KEY") != null 
            ? System.getenv("AVIATIONSTACK_API_KEY") : "";

    private static final Map<String, String> AIRCRAFT_MAP = Map.ofEntries(
            Map.entry("321", "Airbus A321"),
            Map.entry("73H", "Boeing 737-800"),
            Map.entry("77W", "Boeing 777-300ER"),
            Map.entry("320", "Airbus A320"),
            Map.entry("738", "Boeing 737-800"),
            Map.entry("789", "Boeing 787-9"),
            Map.entry("333", "Airbus A330-300"),
            Map.entry("388", "Airbus A380-800"),
            Map.entry("744", "Boeing 747-400"),
            Map.entry("E90", "Embraer E190"),
            Map.entry("AT7", "ATR 72"),
            Map.entry("DH8", "Bombardier Dash 8")
    );

    private static final Map<String, String> STATUS_MAP = Map.of(
            "active", "IN_AIR",
            "landed", "LANDED",
            "scheduled", "SCHEDULED",
            "cancelled", "CANCELLED",
            "diverted", "DIVERTED"
    );

    private static final Map<String, String> IATA_TO_ICAO = Map.ofEntries(
            Map.entry("6E", "IGO"), Map.entry("AI", "AIC"), Map.entry("UK", "VTI"), Map.entry("SG", "SEJ"),
            Map.entry("EK", "UAE"), Map.entry("QR", "QTR"), Map.entry("EY", "ETD"), Map.entry("BA", "BAW"),
            Map.entry("LH", "DLH"), Map.entry("SQ", "SIA"), Map.entry("TG", "THA"), Map.entry("CX", "CPA"),
            Map.entry("AF", "AFR"), Map.entry("KL", "KLM"), Map.entry("UA", "UAL"), Map.entry("AA", "AAL"),
            Map.entry("DL", "DAL")
    );

    @Override
    public void handle(HttpExchange ex) throws IOException {
        try {
            String path = ex.getRequestURI().getPath();
            
            if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) {
                ApiUtils.writeJson(ex, 204, "");
                return;
            }

            if (path.contains("/live")) {
                getLiveFlights(ex);
            } else if (path.startsWith("/api/tracking/flight/")) {
                String icao24 = path.substring(path.lastIndexOf('/') + 1);
                getFlightDetail(icao24, ex);
            } else if (path.equals("/api/tracking/flight")) {
                getFlightStatus(ex);
            } else if (path.equals("/api/tracking/route")) {
                getRouteFlights(ex);
            } else if (path.equals("/api/tracking/history")) {
                getFlightHistory(ex);
            } else if (path.equals("/api/tracking/health")) {
                getHealth(ex);
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

    private void getLiveFlights(HttpExchange ex) throws IOException {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://opensky-network.org/api/states/all"))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            Map<String, Object> root = SimpleJson.parseObject(response.body());
            List<List<Object>> states = (List<List<Object>>) root.get("states");

            List<Map<String, Object>> flights = new ArrayList<>();
            if (states != null) {
                for (List<Object> state : states) {
                    if (state.size() > 13) {
                        Double lon = (Double) state.get(5);
                        Double lat = (Double) state.get(6);
                        Boolean onGround = (Boolean) state.get(13);

                        if (lat != null && lon != null && !onGround) {
                            String callsign = ((String) state.get(1)).trim();
                            Double velocityMs = (Double) state.get(9);
                            Double speedKmh = velocityMs != null ? velocityMs * 3.6 : null;

                            Map<String, Object> f = new HashMap<>();
                            f.put("id", state.get(0));
                            f.put("callsign", callsign);
                            f.put("origin_country", state.get(2));
                            f.put("lat", lat);
                            f.put("lon", lon);
                            f.put("altitude_m", state.get(7));
                            f.put("speed_kmh", speedKmh);
                            f.put("heading", state.get(10));
                            flights.add(f);

                            if (flights.size() >= 3000) break;
                        }
                    }
                }
            }
            ApiUtils.writeJson(ex, 200, SimpleJson.stringify(flights));
        } catch (Exception e) {
            ApiUtils.writeError(ex, 503, "Failed to fetch flight data from OpenSky Network");
        }
    }

    private void getFlightDetail(String icao24, HttpExchange ex) throws IOException {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://opensky-network.org/api/states/all?icao24=" + icao24))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            Map<String, Object> root = SimpleJson.parseObject(response.body());
            List<List<Object>> states = (List<List<Object>>) root.get("states");

            if (states == null || states.isEmpty()) {
                ApiUtils.writeError(ex, 404, "Flight not found");
                return;
            }

            List<Object> state = states.get(0);
            if (state.size() > 13) {
                Double lon = (Double) state.get(5);
                Double lat = (Double) state.get(6);
                String callsign = ((String) state.get(1)).trim();
                Double velocityMs = (Double) state.get(9);
                Double speedKmh = velocityMs != null ? velocityMs * 3.6 : null;

                Map<String, Object> f = new HashMap<>();
                f.put("id", state.get(0));
                f.put("callsign", callsign);
                f.put("origin_country", state.get(2));
                f.put("lat", lat);
                f.put("lon", lon);
                f.put("altitude_m", state.get(7));
                f.put("speed_kmh", speedKmh);
                f.put("heading", state.get(10));
                ApiUtils.writeJson(ex, 200, SimpleJson.stringify(f));
            } else {
                ApiUtils.writeError(ex, 404, "Incomplete flight data");
            }
        } catch (Exception e) {
            ApiUtils.writeError(ex, 503, "Failed to fetch flight data from OpenSky Network");
        }
    }

    private void getFlightStatus(HttpExchange ex) throws IOException {
        String airline = ApiUtils.getParam(ex, "airline");
        String number = ApiUtils.getParam(ex, "number");
        String date = ApiUtils.getParam(ex, "date");

        if (airline == null || number == null || date == null) {
            ApiUtils.writeError(ex, 400, "Missing required parameters");
            return;
        }

        String icaoCallsign = getIcaoCallsign(airline, number);
        Map<String, Object> liveData = searchOpenskyLive(icaoCallsign);

        Map<String, Object> avData = null;
        boolean isPlaceholder = AVIATIONSTACK_KEY.contains("your_free_key") || AVIATIONSTACK_KEY.isEmpty();

        if (!isPlaceholder) {
            String url = "http://api.aviationstack.com/v1/flights?access_key=" + AVIATIONSTACK_KEY 
                    + "&flight_iata=" + airline + number + "&limit=1";
            try {
                HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();
                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() == 200) {
                    Map<String, Object> root = SimpleJson.parseObject(response.body());
                    List<Map<String, Object>> data = (List<Map<String, Object>>) root.get("data");
                    if (data != null && !data.isEmpty()) {
                        avData = mapAviationstackFlight(data.get(0));
                    }
                }
            } catch (Exception ignored) {}
        }

        Map<String, Object> response = new HashMap<>();
        if (avData != null) {
            if (liveData != null) {
                avData.put("live", liveData);
                avData.put("status", "IN_AIR");
                response.put("flight", avData);
                response.put("data_source", "aviationstack+opensky");
            } else {
                response.put("flight", avData);
                response.put("data_source", "aviationstack");
            }
            ApiUtils.writeJson(ex, 200, SimpleJson.stringify(response));
            return;
        }

        if (liveData != null) {
            Map<String, Object> mock = generateMockFlight(airline, number, date, "DEL", "BOM");
            mock.put("live", liveData);
            mock.put("status", "IN_AIR");
            ((Map<String, Object>)mock.get("airline")).put("name", airline + " (Live Tracked)");
            response.put("flight", mock);
            response.put("data_source", "opensky+mock");
            ApiUtils.writeJson(ex, 200, SimpleJson.stringify(response));
            return;
        }

        response.put("flight", generateMockFlight(airline, number, date, "DEL", "BOM"));
        response.put("data_source", "mock");
        ApiUtils.writeJson(ex, 200, SimpleJson.stringify(response));
    }

    private void getRouteFlights(HttpExchange ex) throws IOException {
        String from = ApiUtils.getParam(ex, "from_airport");
        String to = ApiUtils.getParam(ex, "to_airport");
        String date = ApiUtils.getParam(ex, "date");

        if (from == null || to == null || date == null) {
            ApiUtils.writeError(ex, 400, "Missing required parameters");
            return;
        }

        if (!AVIATIONSTACK_KEY.isEmpty() && !AVIATIONSTACK_KEY.contains("your_free_key")) {
            String url = "http://api.aviationstack.com/v1/flights?access_key=" + AVIATIONSTACK_KEY 
                    + "&dep_iata=" + from + "&arr_iata=" + to + "&limit=20";
            try {
                HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();
                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() == 200) {
                    Map<String, Object> root = SimpleJson.parseObject(response.body());
                    List<Map<String, Object>> data = (List<Map<String, Object>>) root.get("data");
                    List<Map<String, Object>> flights = new ArrayList<>();
                    if (data != null) {
                        for (Map<String, Object> f : data) {
                            flights.add(mapAviationstackFlight(f));
                        }
                    }
                    flights.sort(Comparator.comparing(f -> (String)((Map<String, Object>)f.get("departure")).get("scheduled")));
                    Map<String, Object> res = new HashMap<>();
                    res.put("flights", flights);
                    res.put("count", flights.size());
                    res.put("data_source", "aviationstack");
                    ApiUtils.writeJson(ex, 200, SimpleJson.stringify(res));
                    return;
                }
            } catch (Exception ignored) {}
        }

        // Mock Fallback
        int seed = (from + to + date).chars().sum();
        Random rng = new Random(seed);
        int numFlights = rng.nextInt(5) + 4;
        List<Map<String, Object>> flights = new ArrayList<>();
        String[] pool = {"6E", "AI", "UK", "SG", "QP"};

        for (int i = 0; i < numFlights; i++) {
            String airline = pool[rng.nextInt(pool.length)];
            String number = String.valueOf(rng.nextInt(9900) + 100);
            Map<String, Object> f = generateMockFlight(airline, number, date, from, to);
            
            int hour = (rng.nextInt(19) + 5 + i) % 24;
            String hourStr = String.format("%02d", hour);
            String sched = (String)((Map<String, Object>)f.get("departure")).get("scheduled");
            sched = sched.replace("T0", "T" + hourStr).replace("T1", "T" + hourStr).replace("T2", "T" + hourStr);
            ((Map<String, Object>)f.get("departure")).put("scheduled", sched);
            
            flights.add(f);
        }
        flights.sort(Comparator.comparing(f -> (String)((Map<String, Object>)f.get("departure")).get("scheduled")));
        Map<String, Object> res = new HashMap<>();
        res.put("flights", flights);
        res.put("count", flights.size());
        res.put("data_source", "mock");
        ApiUtils.writeJson(ex, 200, SimpleJson.stringify(res));
    }

    private void getFlightHistory(HttpExchange ex) throws IOException {
        String airline = ApiUtils.getParam(ex, "airline");
        String number = ApiUtils.getParam(ex, "number");

        if (airline == null || number == null) {
            ApiUtils.writeError(ex, 400, "Missing required parameters");
            return;
        }

        if (!AVIATIONSTACK_KEY.isEmpty() && !AVIATIONSTACK_KEY.contains("your_free_key")) {
            String url = "http://api.aviationstack.com/v1/flights?access_key=" + AVIATIONSTACK_KEY 
                    + "&flight_iata=" + airline + number + "&limit=10";
            try {
                HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).GET().build();
                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() == 200) {
                    Map<String, Object> root = SimpleJson.parseObject(response.body());
                    List<Map<String, Object>> data = (List<Map<String, Object>>) root.get("data");
                    List<Map<String, Object>> history = new ArrayList<>();
                    if (data != null) {
                        for (Map<String, Object> f : data) {
                            history.add(mapAviationstackFlight(f));
                        }
                    }
                    Map<String, Object> route = new HashMap<>();
                    if (!history.isEmpty()) {
                        route.put("from", ((Map<String, Object>)history.get(0).get("departure")).get("iata"));
                        route.put("to", ((Map<String, Object>)history.get(0).get("arrival")).get("iata"));
                    } else {
                        route.put("from", "Unknown");
                        route.put("to", "Unknown");
                    }
                    Map<String, Object> res = new HashMap<>();
                    res.put("history", history);
                    res.put("route", route);
                    res.put("data_source", "aviationstack");
                    ApiUtils.writeJson(ex, 200, SimpleJson.stringify(res));
                    return;
                }
            } catch (Exception ignored) {}
        }

        // Mock Fallback
        List<Map<String, Object>> history = new ArrayList<>();
        OffsetDateTime today = OffsetDateTime.now();
        for (int i = 1; i <= 10; i++) {
            String dt = today.minusDays(i).format(DateTimeFormatter.ISO_LOCAL_DATE);
            Map<String, Object> f = generateMockFlight(airline, number, dt, "DEL", "BOM");
            f.put("status", "LANDED");
            history.add(f);
        }
        Map<String, Object> route = new HashMap<>();
        route.put("from", "DEL");
        route.put("to", "BOM");
        Map<String, Object> res = new HashMap<>();
        res.put("history", history);
        res.put("route", route);
        res.put("data_source", "mock");
        ApiUtils.writeJson(ex, 200, SimpleJson.stringify(res));
    }

    private void getHealth(HttpExchange ex) throws IOException {
        Map<String, Object> res = new HashMap<>();
        res.put("status", "ok");
        res.put("api", "aviationstack");
        res.put("key_configured", !AVIATIONSTACK_KEY.isEmpty());
        ApiUtils.writeJson(ex, 200, SimpleJson.stringify(res));
    }

    // --- Helpers ---

    private String getIcaoCallsign(String airline, String number) {
        String prefix = IATA_TO_ICAO.getOrDefault(airline.toUpperCase(), airline.toUpperCase());
        return prefix + number;
    }

    private Map<String, Object> searchOpenskyLive(String callsign) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://opensky-network.org/api/states/all"))
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                Map<String, Object> root = SimpleJson.parseObject(response.body());
                List<List<Object>> states = (List<List<Object>>) root.get("states");
                if (states != null) {
                    for (List<Object> s : states) {
                        String sCallsign = ((String) s.get(1)).trim();
                        if (sCallsign.equalsIgnoreCase(callsign)) {
                            Map<String, Object> live = new HashMap<>();
                            live.put("lat", s.get(6));
                            live.put("lon", s.get(5));
                            live.put("altitude_ft", (Double)s.get(7) * 3.28084);
                            live.put("speed_kmh", (Double)s.get(9) * 3.6);
                            live.put("heading", s.get(10));
                            live.put("origin_country", s.get(2));
                            return live;
                        }
                    }
                }
            }
        } catch (Exception ignored) {}
        return null;
    }

    private Map<String, Object> generateMockFlight(String airline, String number, String dateStr, String routeFrom, String routeTo) {
        int seed = (airline + number + dateStr).chars().sum();
        Random rng = new Random(seed);

        String[] statuses = {"SCHEDULED", "IN_AIR", "LANDED", "DELAYED", "CANCELLED"};
        double[] weights = {0.2, 0.4, 0.3, 0.08, 0.02};
        String status = ApiUtils.chooseWeighted(rng, statuses, weights);

        int delayDep = status.equals("DELAYED") ? rng.nextInt(46) + 15 : ApiUtils.chooseFrom(rng, new int[]{0, 0, 5});
        int delayArr = status.equals("DELAYED") ? rng.nextInt(31) + 15 : ApiUtils.chooseFrom(rng, new int[]{0, 0, -5, 10});

        OffsetDateTime baseDt = OffsetDateTime.parse(dateStr + "T00:00:00+00:00")
                .plusHours(rng.nextInt(16) + 5)
                .plusMinutes(ApiUtils.chooseFrom(rng, new int[]{0, 15, 30, 45}));
        
        OffsetDateTime schedDep = baseDt;
        OffsetDateTime actualDep = schedDep.plusMinutes(delayDep);
        int duration = rng.nextInt(311) + 90;
        OffsetDateTime schedArr = schedDep.plusMinutes(duration);
        OffsetDateTime actualArr = actualDep.plusMinutes(duration).plusMinutes(delayArr);

        String[] delayReasons = {
            "Heavy air traffic at destination",
            "Late arrival of incoming aircraft",
            "Technical inspection required",
            "Inclement weather at departure",
            "Security clearance delay"
        };
        String delayReason = (delayDep > 15 || delayArr > 15) ? delayReasons[rng.nextInt(delayReasons.length)] : null;

        Map<String, Object> f = new HashMap<>();
        f.put("flight_number", airline + number);
        f.put("callsign", airline + " " + number);
        Map<String, Object> alNode = new HashMap<>();
        alNode.put("name", "Airline " + airline);
        alNode.put("iata", airline);
        f.put("airline", alNode);
        f.put("status", status);
        f.put("delay_reason", delayReason);

        Map<String, Object> dep = new HashMap<>();
        dep.put("airport", "Airport " + routeFrom);
        dep.put("city", "City " + routeFrom);
        dep.put("iata", routeFrom);
        dep.put("scheduled", schedDep.toString());
        dep.put("actual", status.equals("SCHEDULED") ? null : actualDep.toString());
        dep.put("delay_minutes", delayDep);
        char gateGroup = (char)('A' + rng.nextInt(4));
        dep.put("gate", "" + gateGroup + (rng.nextInt(25) + 1));
        dep.put("terminal", "" + (rng.nextInt(3) + 1));
        
        AirportRegistry.Airport depApt = AirportRegistry.getAirport(routeFrom);
        if (depApt != null) {
            dep.put("lat", depApt.lat);
            dep.put("lon", depApt.lon);
            dep.put("airport", depApt.name);
            dep.put("city", depApt.city);
        }

        f.put("departure", dep);

        Map<String, Object> arr = new HashMap<>();
        arr.put("airport", "Airport " + routeTo);
        arr.put("city", "City " + routeTo);
        arr.put("iata", routeTo);
        arr.put("scheduled", schedArr.toString());
        arr.put("actual", (status.equals("LANDED") || status.equals("IN_AIR")) ? actualArr.toString() : null);
        arr.put("delay_minutes", delayArr);
        char gateGroupArr = (char)('A' + rng.nextInt(4));
        arr.put("gate", "" + gateGroupArr + (rng.nextInt(25) + 1));
        arr.put("terminal", "" + (rng.nextInt(3) + 1));

        AirportRegistry.Airport arrApt = AirportRegistry.getAirport(routeTo);
        if (arrApt != null) {
            arr.put("lat", arrApt.lat);
            arr.put("lon", arrApt.lon);
            arr.put("airport", arrApt.name);
            arr.put("city", arrApt.city);
        }

        f.put("arrival", arr);

        Map<String, Object> ac = new HashMap<>();
        String acType = AIRCRAFT_MAP.getOrDefault("320", "Airbus A320");
        ac.put("type", acType);
        ac.put("registration", "VT-" + (char)('A' + rng.nextInt(26)) + (char)('A' + rng.nextInt(26)));
        f.put("aircraft", ac);

        f.put("duration_minutes", duration);

        Map<String, Object> live = new HashMap<>();
        if (status.equals("IN_AIR")) {
            live.put("lat", 10.0 + (rng.nextDouble() * 20.0));
            live.put("lon", 70.0 + (rng.nextDouble() * 20.0));
            live.put("altitude_ft", 30000 + rng.nextInt(8001));
            live.put("speed_kmh", 750 + rng.nextInt(151));
        } else {
            live.put("lat", null);
            live.put("lon", null);
            live.put("altitude_ft", null);
            live.put("speed_kmh", null);
        }
        f.put("live", live);

        return f;
    }

    private Map<String, Object> mapAviationstackFlight(Map<String, Object> f) {
        Map<String, Object> res = new HashMap<>();
        Map<String, Object> f_flight = (Map<String, Object>) f.get("flight");
        Map<String, Object> f_dep = (Map<String, Object>) f.get("departure");
        Map<String, Object> f_arr = (Map<String, Object>) f.get("arrival");
        Map<String, Object> f_ac = (Map<String, Object>) f.get("aircraft");
        Map<String, Object> f_live = (Map<String, Object>) f.get("live");
        Map<String, Object> f_airline = (Map<String, Object>) f.get("airline");

        res.put("flight_number", f_flight != null ? f_flight.get("iata") : null);
        res.put("callsign", f_flight != null ? (f_flight.get("icao") + " " + f_flight.get("number")).trim() : "");
        
        Map<String, Object> alNode = new HashMap<>();
        alNode.put("name", f_airline != null ? f_airline.get("name") : null);
        alNode.put("iata", f_airline != null ? f_airline.get("iata") : null);
        res.put("airline", alNode);

        res.put("status", STATUS_MAP.getOrDefault((String)f.get("flight_status"), "SCHEDULED"));

        // Departure
        Map<String, Object> dep = new HashMap<>();
        dep.put("airport", f_dep != null ? f_dep.get("airport") : null);
        String depTimezone = f_dep != null ? (String)f_dep.getOrDefault("timezone", "") : "";
        String depCity = depTimezone.contains("/") ? depTimezone.substring(depTimezone.lastIndexOf('/') + 1).replace("_", " ") : "";
        dep.put("city", depCity);
        dep.put("iata", f_dep != null ? f_dep.get("iata") : null);
        dep.put("scheduled", f_dep != null ? f_dep.get("scheduled") : null);
        Object actualDep = f_dep != null ? (f_dep.get("actual") == null ? f_dep.get("estimated") : f_dep.get("actual")) : null;
        dep.put("actual", actualDep);
        dep.put("delay_minutes", f_dep != null ? f_dep.get("delay") : 0);
        dep.put("gate", f_dep != null ? f_dep.get("gate") : null);
        dep.put("terminal", f_dep != null ? f_dep.get("terminal") : null);
        
        AirportRegistry.Airport depApt = AirportRegistry.getAirport((String)dep.get("iata"));
        if (depApt != null) {
            dep.put("lat", depApt.lat);
            dep.put("lon", depApt.lon);
        }
        
        res.put("departure", dep);

        // Arrival
        Map<String, Object> arr = new HashMap<>();
        arr.put("airport", f_arr != null ? f_arr.get("airport") : null);
        String arrTimezone = f_arr != null ? (String)f_arr.getOrDefault("timezone", "") : "";
        String arrCity = arrTimezone.contains("/") ? arrTimezone.substring(arrTimezone.lastIndexOf('/') + 1).replace("_", " ") : "";
        arr.put("city", arrCity);
        arr.put("iata", f_arr != null ? f_arr.get("iata") : null);
        arr.put("scheduled", f_arr != null ? f_arr.get("scheduled") : null);
        Object actualArr = f_arr != null ? (f_arr.get("actual") == null ? f_arr.get("estimated") : f_arr.get("actual")) : null;
        arr.put("actual", actualArr);
        arr.put("delay_minutes", f_arr != null ? f_arr.get("delay") : 0);
        arr.put("gate", f_arr != null ? f_arr.get("gate") : null);
        arr.put("terminal", f_arr != null ? f_arr.get("terminal") : null);

        AirportRegistry.Airport arrApt = AirportRegistry.getAirport((String)arr.get("iata"));
        if (arrApt != null) {
            arr.put("lat", arrApt.lat);
            arr.put("lon", arrApt.lon);
        }

        res.put("arrival", arr);

        // Aircraft
        Map<String, Object> ac = new HashMap<>();
        String iataAc = f_ac != null ? (String)f_ac.getOrDefault("iata", "") : "";
        ac.put("type", AIRCRAFT_MAP.getOrDefault(iataAc, iataAc.isEmpty() ? "Unknown" : iataAc));
        ac.put("registration", f_ac != null ? f_ac.get("registration") : null);
        res.put("aircraft", ac);

        // Duration
        if (f_arr != null && f_dep != null && f_arr.get("scheduled") != null && f_dep.get("scheduled") != null) {
            try {
                OffsetDateTime d_arr = OffsetDateTime.parse((String)f_arr.get("scheduled"));
                OffsetDateTime d_dep = OffsetDateTime.parse((String)f_dep.get("scheduled"));
                res.put("duration_minutes", Duration.between(d_dep, d_arr).toMinutes());
            } catch (Exception ignored) {}
        } else {
            res.put("duration_minutes", null);
        }

        // Live
        Map<String, Object> live = new HashMap<>();
        if (f_live != null) {
            live.put("lat", f_live.get("latitude"));
            live.put("lon", f_live.get("longitude"));
            live.put("altitude_ft", f_live.get("altitude"));
            live.put("speed_kmh", f_live.get("speed_horizontal"));
        } else {
            live.put("lat", null);
            live.put("lon", null);
            live.put("altitude_ft", null);
            live.put("speed_kmh", null);
        }
        res.put("live", live);

        return res;
    }
}
