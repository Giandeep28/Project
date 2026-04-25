package models;

import java.io.Serializable;

/**
 * Booking data model — matches the schema expected by the frontend payload and backend response.
 */
public class Booking implements Serializable {
    private static final long serialVersionUID = 1L;

    private String bookingId;
    private String flightId;
    private String from;          // Added for Dashboard alignment
    private String to;            // Added for Dashboard alignment
    private String contactEmail;  
    private String seatId;        // Used as seatClass
    private double totalFare;
    private long   bookingTimestamp;
    private String status;

    public Booking() {}

    public Booking(String bookingId, String flightId, String from, String to, String contactEmail, String seatId, double totalFare) {
        this.bookingId        = bookingId;
        this.flightId         = flightId;
        this.from             = from;
        this.to               = to;
        this.contactEmail     = contactEmail;
        this.seatId           = seatId;
        this.totalFare        = totalFare;
        this.bookingTimestamp = System.currentTimeMillis();
        this.status           = "PENDING";
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public String getBookingId()                        { return bookingId; }
    public void   setBookingId(String v)                { this.bookingId = v; }
    public String getFlightId()                         { return flightId; }
    public void   setFlightId(String v)                 { this.flightId = v; }
    public String getFrom()                             { return from; }
    public void   setFrom(String v)                     { this.from = v; }
    public String getTo()                               { return to; }
    public void   setTo(String v)                       { this.to = v; }
    public String getPassengerName()                    { return contactEmail; }
    public void   setPassengerName(String v)            { this.contactEmail = v; }
    public String getContactEmail()                     { return contactEmail; }
    public void   setContactEmail(String v)             { this.contactEmail = v; }
    public String getSeatId()                           { return seatId; }
    public void   setSeatId(String v)                   { this.seatId = v; }
    public double getTotalFare()                        { return totalFare; }
    public void   setTotalFare(double v)                { this.totalFare = v; }
    public long   getBookingTimestamp()                 { return bookingTimestamp; }
    public void   setBookingTimestamp(long v)           { this.bookingTimestamp = v; }
    public String getStatus()                           { return status; }
    public void   setStatus(String v)                   { this.status = v; }
}
