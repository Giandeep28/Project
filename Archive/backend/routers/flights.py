from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import datetime

router = APIRouter(prefix="/api/flights", tags=["Flights"])

@router.get("/search")
async def search_flights(
    origin: str = Query(..., description="IATA code of origin airport"),
    destination: str = Query(..., description="IATA code of destination airport"),
    date: str = Query(..., description="Departure date in YYYY-MM-DD"),
    adults: int = 1,
    trip_type: str = "oneway"
):
    # Mock Flight Search logic (in production, call AmadeusService)
    # We simulate high-fidelity results
    flights = []
    for i in range(5):
        flights.append({
            "id": f"SV-{100 + i}",
            "airline_name": "SkyVoyage Elite",
            "airline_code": "SV",
            "flight_number": f"SV{500+i}",
            "departure": {"code": origin, "time": f"{10+i}:00"},
            "arrival": {"code": destination, "time": f"{14+i}:30"},
            "duration": "4h 30m",
            "price": 18500 + i * 5000,
            "cabin": "Premium"
        })
    return {"status": "success", "results": flights}

@router.get("/airports")
async def search_airports(q: str = Query(..., min_length=2)):
    # Mock Airport Search
    airports = [
        {"code": "DEL", "name": "Indira Gandhi International", "city": "Delhi"},
        {"code": "BOM", "name": "Chhatrapati Shivaji International", "city": "Mumbai"},
        {"code": "LHR", "name": "Heathrow Airport", "city": "London"},
        {"code": "JFK", "name": "John F. Kennedy", "city": "New York"}
    ]
    results = [a for a in airports if q.upper() in a['code'] or q.lower() in a['city'].lower()]
    return {"airports": results}
