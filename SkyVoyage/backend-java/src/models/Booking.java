package models;

import java.io.Serializable;
import java.util.Date;

public class Booking implements Serializable {
    private String bookingId;
    private String flightId;
    private String passengerName;
    private String seatId;
    private double totalFare;
    private long bookingTimestamp;
    private String status;

    public Booking() {}

    public Booking(String bookingId, String flightId, String passengerName, String seatId, double totalFare) {
        this.bookingId = bookingId;
        this.flightId = flightId;
        this.passengerName = passengerName;
        this.seatId = seatId;
        this.totalFare = totalFare;
        this.bookingTimestamp = System.currentTimeMillis();
        this.status = "CONFIRMED";
    }

    // Getters and Setters
    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }
    public String getFlightId() { return flightId; }
    public void setFlightId(String flightId) { this.flightId = flightId; }
    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }
    public String getSeatId() { return seatId; }
    public void setSeatId(String seatId) { this.seatId = seatId; }
    public double getTotalFare() { return totalFare; }
    public void setTotalFare(double totalFare) { this.totalFare = totalFare; }
    public long getBookingTimestamp() { return bookingTimestamp; }
    public void setBookingTimestamp(long bookingTimestamp) { this.bookingTimestamp = bookingTimestamp; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
