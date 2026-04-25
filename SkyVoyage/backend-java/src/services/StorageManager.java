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
    private final ConcurrentHashMap<String, String> userCredentials = new ConcurrentHashMap<>();

    private final String STORAGE_DIR = "database/files";
    private final String BOOKING_MIRROR = STORAGE_DIR + "/bookings_mirror.json";
    private final String USER_MIRROR = STORAGE_DIR + "/users_mirror.json";

    public StorageManager() {
        new File(STORAGE_DIR).mkdirs();
    }

    public static synchronized StorageManager getInstance() {
        if (instance == null) {
            instance = new StorageManager();
        }
        return instance;
    }

    public Booking getBookingById(String id) {
        return bookingMemoryMap.get(id);
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
            String entry = String.format("{\"bookingId\":\"%s\", \"flightId\":\"%s\", \"from\":\"%s\", \"to\":\"%s\", \"contactEmail\":\"%s\", \"seatClass\":\"%s\", \"totalFare\":%.2f, \"status\":\"%s\"}\n",
                booking.getBookingId(), booking.getFlightId(), booking.getFrom(), booking.getTo(), booking.getContactEmail(), booking.getSeatId(), booking.getTotalFare(), booking.getStatus());
            writer.write(entry);
        } catch (IOException e) {
            System.err.println("[STORAGE-ERR] Failed to sync to disk: " + e.getMessage());
        }
    }

    public List<Booking> getAllBookings() {
        return new ArrayList<>(bookingMemoryMap.values());
    }

    public synchronized boolean registerUser(String email, String password, String name, String phone) {
        if (userCredentials.containsKey(email.toLowerCase())) return false;
        userCredentials.put(email.toLowerCase(), password);
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(USER_MIRROR, true), java.nio.charset.StandardCharsets.UTF_8))) {
            writer.write(String.format("{\"email\":\"%s\", \"password\":\"%s\", \"name\":\"%s\", \"phone\":\"%s\"}\n", email.toLowerCase(), password, name, phone));
        } catch (IOException e) {
            System.err.println("[STORAGE-ERR] Failed to sync user to disk: " + e.getMessage());
        }
        System.out.println("[STORAGE] Successfully registered user: " + email);
        return true;
    }

    public String getUserPassword(String email) {
        return userCredentials.get(email.toLowerCase());
    }
}
