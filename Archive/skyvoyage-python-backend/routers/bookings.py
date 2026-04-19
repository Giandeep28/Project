from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from backend.schemas.schemas import BookingCreate, BookingOut, BookingStats
import uuid
import datetime

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

# Mock database
bookings_db = {}

@router.post("/", response_model=BookingOut)
async def create_booking(booking: BookingCreate):
    pnr = str(uuid.uuid4())[:8].upper()
    
    # Calculate Loyalty Miles (1 Mile per ₹50)
    earned_miles = int(booking.total_amount / 50)
    
    new_booking = {
        "pnr": pnr,
        "flight_id": booking.flight_id,
        "passenger_details": booking.passengers,
        "seat_number": booking.seat,
        "ancillaries": booking.ancillaries,
        "total_amount": booking.total_amount,
        "status": "confirmed",
        "booking_date": datetime.datetime.now(),
        "earned_miles": earned_miles
    }
    
    bookings_db[pnr] = new_booking
    return new_booking

@router.get("/me", response_model=List[BookingOut])
async def get_my_bookings():
    # Return all mock bookings
    return list(bookings_db.values())

@router.get("/{pnr}", response_model=BookingOut)
async def get_booking(pnr: str):
    if pnr not in bookings_db:
        raise HTTPException(status_code=404, detail="Booking not found")
    return bookings_db[pnr]

@router.delete("/{pnr}")
async def cancel_booking(pnr: str):
    if pnr not in bookings_db:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    bookings_db[pnr]["status"] = "cancelled"
    return {"message": "Voyage cancelled successfully", "pnr": pnr, "refund_status": "processing"}

@router.get("/admin/stats", response_model=BookingStats)
async def get_admin_stats():
    total_rev = sum(b["total_amount"] for b in bookings_db.values() if b["status"] == "confirmed")
    total_count = len(bookings_db)
    
    return {
        "total_revenue": total_rev,
        "active_bookings": total_count,
        "cancelled_bookings": sum(1 for b in bookings_db.values() if b["status"] == "cancelled"),
        "total_miles_awarded": sum(b["earned_miles"] for b in bookings_db.values() if b["status"] == "confirmed")
    }
