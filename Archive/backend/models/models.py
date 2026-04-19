from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import datetime
import enum

Base = declarative_base()

class FlightStatus(enum.Enum):
    SCHEDULED = "scheduled"
    DELAYED = "delayed"
    CANCELLED = "cancelled"
    DEPARTED = "departed"
    ARRIVED = "arrived"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    miles_balance = Column(Integer, default=0)
    loyalty_tier = Column(String, default="Silver")
    
    bookings = relationship("Booking", back_populates="user")
    miles_history = relationship("MilesHistory", back_populates="user")

class Flight(Base):
    __tablename__ = "flights"
    id = Column(String, primary_key=True)
    airline_name = Column(String)
    airline_code = Column(String)
    flight_number = Column(String)
    departure_airport = Column(String)
    arrival_airport = Column(String)
    departure_time = Column(DateTime)
    arrival_time = Column(DateTime)
    price = Column(Float)
    currency = Column(String, default="INR")
    status = Column(Enum(FlightStatus), default=FlightStatus.SCHEDULED)
    aircraft = Column(String)
    amenities = Column(JSON)
    
    bookings = relationship("Booking", back_populates="flight")

class Booking(Base):
    __tablename__ = "bookings"
    pnr = Column(String, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    flight_id = Column(String, ForeignKey("flights.id"))
    passenger_details = Column(JSON)
    status = Column(String, default="confirmed")
    seat_number = Column(String)
    ancillaries = Column(JSON)
    total_amount = Column(Float)
    booking_date = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="bookings")
    flight = relationship("Flight", back_populates="bookings")

class MilesHistory(Base):
    __tablename__ = "miles_history"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    transaction_type = Column(String) # "earned" or "redeemed"
    amount = Column(Integer)
    description = Column(String)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="miles_history")
