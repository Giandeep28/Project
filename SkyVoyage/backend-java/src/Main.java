import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import controllers.FlightController;
import controllers.BookingController;
import controllers.AuthController;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

public class Main {

    private static void cors(HttpExchange ex) {
        String origin = ex.getRequestHeaders().getFirst("Origin");
        // Allow both Vite dev server ports
        if (origin != null && (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:"))) {
            ex.getResponseHeaders().add("Access-Control-Allow-Origin", origin);
        } else {
            ex.getResponseHeaders().add("Access-Control-Allow-Origin", "http://localhost:3000");
        }
        ex.getResponseHeaders().add("Access-Control-Allow-Credentials", "true");
        ex.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        ex.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        ex.getResponseHeaders().add("Content-Type", "application/json");
    }

    public static void main(String[] args) {
        try {
            int port = 8080;
            HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
            
            // Register Controllers
            server.createContext("/api/flights", new FlightController());
            server.createContext("/api/bookFlight", new BookingController());
            server.createContext("/api/login", new AuthController());
            
            // Health Endpoint for monitoring
            server.createContext("/api/health", exchange -> {
                cors(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1); return;
                }
                String response = "{\"status\":\"UP\", \"system\":\"SkyVoyage Core\"}";
                byte[] bytes = response.getBytes("UTF-8");
                exchange.sendResponseHeaders(200, bytes.length);
                exchange.getResponseBody().write(bytes);
                exchange.getResponseBody().close();
            });

            // Airport Search Endpoint — 3-tier fallback anchor (Step 12C)
            server.createContext("/api/airports", exchange -> {
                cors(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1); return;
                }
                String rawQ = exchange.getRequestURI().getQuery();
                String q = "";
                if (rawQ != null) for (String p : rawQ.split("&")) if (p.startsWith("q="))
                    q = java.net.URLDecoder.decode(p.substring(2), "UTF-8").toLowerCase();

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
                for (String[] a : DB) {
                    if (a[0].toLowerCase().startsWith(fq) || a[1].toLowerCase().contains(fq)
                        || a[2].toLowerCase().contains(fq) || a[3].toLowerCase().contains(fq)) {
                        if (!first) json.append(",");
                        json.append(String.format(
                            "{\"code\":\"%s\",\"city\":\"%s\",\"name\":\"%s\",\"country\":\"%s\"}",
                            a[0], a[1], a[2], a[3]));
                        first = false;
                    }
                }
                json.append("]");
                byte[] resp = json.toString().getBytes("UTF-8");
                exchange.sendResponseHeaders(200, resp.length);
                exchange.getResponseBody().write(resp);
                exchange.getResponseBody().close();
            });
            
            // Multithreaded Core Engine using a Fixed Thread Pool
            ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor) Executors.newFixedThreadPool(10);
            server.setExecutor(threadPoolExecutor);
            
            System.out.println("=================================================");
            System.out.println("  \uD83D\uDE80 SKYVOYAGE CORE ENGINE - ONLINE");
            System.out.println("  \uD83D\uDCCD PORT: " + port);
            System.out.println("  \u2699\uFE0F  CORE: Pure Native Java (com.sun.net.httpserver)");
            System.out.println("  \uD83E\uDDF5 THREADS: Fixed Pool (10)");
            System.out.println("  \uD83C\uDFE6 AIRPORT API: /api/airports?q=<query>");
            System.out.println("=================================================");
            
            server.start();
            
        } catch (IOException e) {
            System.err.println("CRITICAL: SkyVoyage Core Engine failed to launch: " + e.getMessage());
        }
    }
}
