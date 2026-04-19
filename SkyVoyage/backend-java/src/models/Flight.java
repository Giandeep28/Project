package models;

import java.io.Serializable;

public class Flight implements Serializable {
    private String id;
    private String airlineName;
    private String airlineCode;
    private String airlineLogo;
    private String flightNumber;
    private String departureAirportCode;
    private String arrivalAirportCode;
    private String departureTime;
    private String arrivalTime;
    private String duration;
    private double price;
    private int stops;
    private String aircraft;

    public Flight() {}

    public Flight(String id, String airlineName, String airlineCode, String airlineLogo, String flightNumber,
                  String departureAirportCode, String arrivalAirportCode, String departureTime, String arrivalTime,
                  String duration, double price, int stops, String aircraft) {
        this.id = id;
        this.airlineName = airlineName;
        this.airlineCode = airlineCode;
        this.airlineLogo = airlineLogo;
        this.flightNumber = flightNumber;
        this.departureAirportCode = departureAirportCode;
        this.arrivalAirportCode = arrivalAirportCode;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.duration = duration;
        this.price = price;
        this.stops = stops;
        this.aircraft = aircraft;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getAirlineName() { return airlineName; }
    public void setAirlineName(String airlineName) { this.airlineName = airlineName; }
    public String getAirlineCode() { return airlineCode; }
    public void setAirlineCode(String airlineCode) { this.airlineCode = airlineCode; }
    public String getAirlineLogo() { return airlineLogo; }
    public void setAirlineLogo(String airlineLogo) { this.airlineLogo = airlineLogo; }
    public String getFlightNumber() { return flightNumber; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }
    public String getDepartureAirportCode() { return departureAirportCode; }
    public void setDepartureAirportCode(String departureAirportCode) { this.departureAirportCode = departureAirportCode; }
    public String getArrivalAirportCode() { return arrivalAirportCode; }
    public void setArrivalAirportCode(String arrivalAirportCode) { this.arrivalAirportCode = arrivalAirportCode; }
    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }
    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public int getStops() { return stops; }
    public void setStops(int stops) { this.stops = stops; }
    public String getAircraft() { return aircraft; }
    public void setAircraft(String aircraft) { this.aircraft = aircraft; }
}
