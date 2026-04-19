from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(UserBase):
    id: int
    loyalty_tier: str
    miles_balance: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class BookingCreate(BaseModel):
    flight_id: str
    passengers: List[Dict[str, Any]]
    seat: Optional[str]
    ancillaries: Dict[str, Any]
    total_amount: float

class BookingOut(BaseModel):
    pnr: str
    flight_id: str
    passenger_details: List[Dict[str, Any]]
    seat_number: Optional[str]
    ancillaries: Dict[str, Any]
    total_amount: float
    status: str
    booking_date: datetime
    earned_miles: int

    class Config:
        from_attributes = True

class BookingStats(BaseModel):
    total_revenue: float
    active_bookings: int
    cancelled_bookings: int
    total_miles_awarded: int
