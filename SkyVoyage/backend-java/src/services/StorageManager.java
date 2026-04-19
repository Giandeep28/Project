package services;

import models.Booking;
import models.Flight;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

public class StorageManager {
    private static StorageManager instance;
    private final ConcurrentHashMap<String, Flight> flightMemoryMap = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Booking> bookingMemoryMap = new ConcurrentHashMap<>();
    
    private final String STORAGE_DIR = "database/files";
    private final String FLIGHT_MIRROR = STORAGE_DIR + "/flights_mirror.json";
    private final String BOOKING_MIRROR = STORAGE_DIR + "/bookings_mirror.json";

    public StorageManager() {
        new File(STORAGE_DIR).mkdirs();
        seedInitialFlights();
    }

    public static synchronized StorageManager getInstance() {
        if (instance == null) {
            instance = new StorageManager();
        }
        return instance;
    }

    public void persistBooking(Booking booking) {
        // Dual-Write 1: Memory
        bookingMemoryMap.put(booking.getBookingId(), booking);
        
        // Dual-Write 2: JSON Mirror
        saveToDisk(BOOKING_MIRROR, booking);
        
        System.out.println("[STORAGE] Successfully persisted booking: " + booking.getBookingId());
    }

    public List<Flight> getAllFlights() {
        return new ArrayList<>(flightMemoryMap.values());
    }

    private synchronized void saveToDisk(String path, Booking booking) {
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(path, true), java.nio.charset.StandardCharsets.UTF_8))) {
            // Append as a simple line-delimited JSON for native I/O simplicity
            String entry = String.format("{\"bookingId\":\"%s\", \"flightId\":\"%s\", \"passengerName\":\"%s\", \"seatId\":\"%s\", \"totalFare\":%.2f, \"status\":\"%s\"}\n",
                booking.getBookingId(), booking.getFlightId(), booking.getPassengerName(), booking.getSeatId(), booking.getTotalFare(), booking.getStatus());
            writer.write(entry);
        } catch (IOException e) {
            System.err.println("[STORAGE-ERR] Failed to sync to disk: " + e.getMessage());
        }
    }

    private void seedInitialFlights() {
        flightMemoryMap.put("SV-502", new Flight("SV-502", "Air India", "AI", "https://pics.avs.io/200/80/AI.png", "AI-101", "DEL", "BOM", "2026-04-20T10:30:00", "2026-04-20T12:45:00", "2h 15m", 8450.0, 0, "Airbus A350"));
        flightMemoryMap.put("SV-108", new Flight("SV-108", "Emirates", "EK", "https://pics.avs.io/200/80/EK.png", "EK-512", "BOM", "DXB", "2026-04-20T14:00:00", "2026-04-20T16:30:00", "3h 30m", 28500.0, 0, "Boeing 777"));
        flightMemoryMap.put("SV-992", new Flight("SV-992", "Vistara", "UK", "https://pics.avs.io/200/80/UK.png", "UK-921", "DEL", "SIN", "2026-04-21T23:55:00", "2026-04-22T08:15:00", "5h 50m", 42300.0, 0, "Boeing 787 Dreamliner"));
    }

    public List<Booking> getAllBookings() {
        return new ArrayList<>(bookingMemoryMap.values());
    }
}
