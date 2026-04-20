import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import controllers.FlightController;
import controllers.BookingController;
import controllers.AuthController;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

public class Main {

    static final String ALLOWED_ORIGIN = "http://localhost:3000";

    /** Adds the full CORS header block to any response. */
    public static void addCors(HttpExchange ex) {
        String origin = ex.getRequestHeaders().getFirst("Origin");
        String allow  = (origin != null &&
                (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")))
                ? origin : ALLOWED_ORIGIN;
        ex.getResponseHeaders().set("Access-Control-Allow-Origin",      allow);
        ex.getResponseHeaders().set("Access-Control-Allow-Methods",     "GET, POST, PUT, DELETE, OPTIONS");
        ex.getResponseHeaders().set("Access-Control-Allow-Headers",     "Content-Type, Authorization");
        ex.getResponseHeaders().set("Access-Control-Allow-Credentials", "true");
        ex.getResponseHeaders().set("Access-Control-Max-Age",           "86400");
    }

    /**
     * Handles a browser preflight:
     * - Adds CORS headers
     * - Sends 204 with no body
     * - Closes the exchange (MANDATORY — prevents browser from hanging)
     * Returns true so the caller can return immediately.
     */
    public static boolean preflight(HttpExchange ex) throws IOException {
        addCors(ex);
        if ("OPTIONS".equalsIgnoreCase(ex.getRequestMethod())) {
            ex.sendResponseHeaders(204, -1);
            ex.close();
            return true;
        }
        return false;
    }

    /** Writes a JSON body, sets Content-Type, and closes the exchange. */
    public static void sendJson(HttpExchange ex, int status, String json) throws IOException {
        addCors(ex);
        byte[] bytes = json.getBytes("UTF-8");
        ex.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        ex.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(bytes);
        } finally {
            ex.close();
        }
    }

    public static void main(String[] args) {
        try {
            int port = 8080;
            HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

            // ── Unified Route Registry ──────────────────────────────────────
            server.createContext("/api/flights",     new FlightController());
            server.createContext("/api/bookings",    new BookingController());
            server.createContext("/api/auth/register",  new AuthController());
            server.createContext("/api/auth/login",  new AuthController());
            server.createContext("/api/auth/logout", new AuthController());
            server.createContext("/api/auth/me",     new AuthController());

            // ── /api/health ─────────────────────────────────────────────────
            server.createContext("/api/health", exchange -> {
                try {
                    if (preflight(exchange)) return;
                    sendJson(exchange, 200, "{\"status\":\"UP\",\"system\":\"SkyVoyage Core\",\"port\":8080}");
                } catch (IOException e) {
                    exchange.close();
                }
            });

            // ── /api/airports ────────────────────────────────────────────────
            server.createContext("/api/airports", exchange -> {
                try {
                    if (preflight(exchange)) return;

                    String rawQ = exchange.getRequestURI().getQuery();
                    String q = "";
                    if (rawQ != null) {
                        for (String p : rawQ.split("&")) {
                            if (p.startsWith("q=")) {
                                q = java.net.URLDecoder.decode(p.substring(2), "UTF-8").toLowerCase();
                            }
                        }
                    }

                    String[][] DB = {
                        {"DEL","Delhi","Indira Gandhi International","India"},
                        {"BOM","Mumbai","Chhatrapati Shivaji Maharaj","India"},
                        {"BLR","Bengaluru","Kempegowda International","India"},
                        {"MAA","Chennai","Chennai International","India"},
                        {"CCU","Kolkata","Netaji Subhas Chandra Bose","India"},
                        {"HYD","Hyderabad","Rajiv Gandhi International","India"},
                        {"COK","Kochi","Cochin International","India"},
                        {"PNQ","Pune","Pune Airport","India"},
                        {"AMD","Ahmedabad","Sardar Vallabhbhai Patel","India"},
                        {"GOI","Goa","Dabolim Airport","India"},
                        {"JAI","Jaipur","Jaipur International","India"},
                        {"LKO","Lucknow","Chaudhary Charan Singh","India"},
                        {"VNS","Varanasi","Lal Bahadur Shastri","India"},
                        {"ATQ","Amritsar","Sri Guru Ram Dass Jee","India"},
                        {"NAG","Nagpur","Dr. Babasaheb Ambedkar","India"},
                        {"IXC","Chandigarh","Chandigarh Airport","India"},
                        {"SXR","Srinagar","Sheikh ul-Alam International","India"},
                        {"GAU","Guwahati","Lokpriya Gopinath Bordoloi","India"},
                        {"DXB","Dubai","Dubai International","UAE"},
                        {"LHR","London","Heathrow Airport","United Kingdom"},
                        {"SIN","Singapore","Changi Airport","Singapore"},
                        {"JFK","New York","JFK International","USA"},
                        {"HND","Tokyo","Haneda Airport","Japan"},
                        {"CDG","Paris","Charles de Gaulle","France"},
                        {"AMS","Amsterdam","Schiphol Airport","Netherlands"},
                        {"DOH","Doha","Hamad International","Qatar"},
                        {"AUH","Abu Dhabi","Zayed International","UAE"},
                        {"BKK","Bangkok","Suvarnabhumi Airport","Thailand"},
                        {"SYD","Sydney","Kingsford Smith Airport","Australia"},
                        {"HKG","Hong Kong","Hong Kong International","China HK"},
                        {"KUL","Kuala Lumpur","Kuala Lumpur International","Malaysia"},
                        {"ATH","Athens","Eleftherios Venizelos","Greece"},
                        {"LAX","Los Angeles","Los Angeles International","USA"},
                        {"FRA","Frankfurt","Frankfurt am Main","Germany"},
                    };

                    final String fq = q;
                    StringBuilder json = new StringBuilder("[");
                    boolean first = true;
                    int count = 0;
                    for (String[] a : DB) {
                        if (count >= 6) break;
                        if (a[0].toLowerCase().startsWith(fq) || a[1].toLowerCase().contains(fq)
                                || a[2].toLowerCase().contains(fq) || a[3].toLowerCase().contains(fq)) {
                            if (!first) json.append(",");
                            json.append(String.format(
                                "{\"code\":\"%s\",\"city\":\"%s\",\"name\":\"%s\",\"country\":\"%s\"}",
                                a[0], a[1], a[2], a[3]));
                            first = false;
                            count++;
                        }
                    }
                    json.append("]");
                    sendJson(exchange, 200, json.toString());
                } catch (IOException e) {
                    exchange.close();
                }
            });

            // ── Thread Pool ──────────────────────────────────────────────────
            ThreadPoolExecutor executor = (ThreadPoolExecutor) Executors.newFixedThreadPool(10);
            server.setExecutor(executor);

            System.out.println("=================================================");
            System.out.println("  SKYVOYAGE CORE ENGINE - ONLINE");
            System.out.println("  PORT: " + port);
            System.out.println("  CORS ORIGIN: " + ALLOWED_ORIGIN);
            System.out.println("  ROUTES:");
            System.out.println("    GET  /api/flights?origin=&dest=&date=&guests=");
            System.out.println("    POST /api/bookings");
            System.out.println("    GET  /api/bookings/{id}");
            System.out.println("    POST /api/auth/login");
            System.out.println("    POST /api/auth/logout");
            System.out.println("    GET  /api/auth/me");
            System.out.println("    GET  /api/airports?q=");
            System.out.println("    GET  /api/health");
            System.out.println("=================================================");

            server.start();

        } catch (IOException e) {
            System.err.println("CRITICAL: Failed to start: " + e.getMessage());
        }
    }
}
