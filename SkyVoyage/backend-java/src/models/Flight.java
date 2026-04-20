package models;

import java.io.Serializable;

/**
 * Flight data model — matches the JSON schema required by SearchResults.jsx.
 *
 * Fields:
 *   id, airline, flightNumber, origin, destination,
 *   departureTime (ISO-8601), arrivalTime (ISO-8601),
 *   duration (minutes), stops, price (INR),
 *   seatClass, seatsAvailable, score (0-100)
 */
public class Flight implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String airline;
    private String airlineLogo;
    private String flightNumber;
    private String origin;
    private String destination;
    private String departureTime;   // ISO-8601
    private String arrivalTime;     // ISO-8601
    private int    duration;        // minutes
    private int    stops;
    private double price;           // INR
    private String seatClass;       // ECONOMY | BUSINESS | FIRST
    private int    seatsAvailable;
    private double score;           // 0-100

    public Flight() {}

    public Flight(String id, String airline, String airlineLogo, String flightNumber,
                  String origin, String destination,
                  String departureTime, String arrivalTime,
                  int duration, int stops, double price,
                  String seatClass, int seatsAvailable, double score) {
        this.id             = id;
        this.airline        = airline;
        this.airlineLogo    = airlineLogo;
        this.flightNumber   = flightNumber;
        this.origin         = origin;
        this.destination    = destination;
        this.departureTime  = departureTime;
        this.arrivalTime    = arrivalTime;
        this.duration       = duration;
        this.stops          = stops;
        this.price          = price;
        this.seatClass      = seatClass;
        this.seatsAvailable = seatsAvailable;
        this.score          = score;
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public String getId()                         { return id; }
    public void   setId(String id)                { this.id = id; }
    public String getAirline()                    { return airline; }
    public void   setAirline(String v)            { this.airline = v; }
    public String getAirlineLogo()                { return airlineLogo; }
    public void   setAirlineLogo(String v)        { this.airlineLogo = v; }
    public String getFlightNumber()               { return flightNumber; }
    public void   setFlightNumber(String v)       { this.flightNumber = v; }
    public String getOrigin()                     { return origin; }
    public void   setOrigin(String v)             { this.origin = v; }
    public String getDestination()                { return destination; }
    public void   setDestination(String v)        { this.destination = v; }
    public String getDepartureTime()              { return departureTime; }
    public void   setDepartureTime(String v)      { this.departureTime = v; }
    public String getArrivalTime()                { return arrivalTime; }
    public void   setArrivalTime(String v)        { this.arrivalTime = v; }
    public int    getDuration()                   { return duration; }
    public void   setDuration(int v)              { this.duration = v; }
    public int    getStops()                      { return stops; }
    public void   setStops(int v)                 { this.stops = v; }
    public double getPrice()                      { return price; }
    public void   setPrice(double v)              { this.price = v; }
    public String getSeatClass()                  { return seatClass; }
    public void   setSeatClass(String v)          { this.seatClass = v; }
    public int    getSeatsAvailable()             { return seatsAvailable; }
    public void   setSeatsAvailable(int v)        { this.seatsAvailable = v; }
    public double getScore()                      { return score; }
    public void   setScore(double v)              { this.score = v; }
}
