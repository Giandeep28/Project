from fastapi import APIRouter, HTTPException, Query
from datetime import datetime, timedelta
import json
import os

router = APIRouter(prefix="/api/meals", tags=["meals"])

# Load database at startup
DB_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))),
    "database",
    "airline_meals.json"
)

try:
    with open(DB_PATH, "r", encoding="utf-8") as f:
        meals_db = json.load(f)
except Exception as e:
    print(f"Error loading meals database: {e}")
    meals_db = {"airlines": {}}

@router.get("/stopover")
def get_stopover_meals(
    airline: str = Query(..., description="Airline code"),
    stopover_airport: str = Query(..., description="Stopover airport code"),
    arrival_time: str = Query(..., description="Arrival time in ISO format"),
    departure_time: str = Query(..., description="Departure time in ISO format")
):
    airline = airline.upper()
    airline_data = meals_db.get("airlines", {}).get(airline)
    if not airline_data:
        raise HTTPException(status_code=404, detail=f"Airline {airline} not found")
        
    try:
        arr_dt = datetime.fromisoformat(arrival_time.replace("Z", "+00:00"))
        dep_dt = datetime.fromisoformat(departure_time.replace("Z", "+00:00"))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Please use ISO format.")
        
    duration_mins = int((dep_dt - arr_dt).total_seconds() / 60)
    
    if duration_mins <= 0:
        raise HTTPException(status_code=400, detail="Departure time must be after arrival time")
        
    # Time slots: every 30 minutes between arrival+30min and departure-45min
    start_time = arr_dt + timedelta(minutes=30)
    end_time = dep_dt - timedelta(minutes=45)
    
    slots = []
    current_time = start_time
    while current_time <= end_time:
        slots.append(current_time.isoformat())
        current_time += timedelta(minutes=30)
        
    return {
        "airline": airline_data.get("name"),
        "meals": airline_data.get("meals", []),
        "delivery_slots": slots,
        "stopover_duration_minutes": duration_mins
    }

@router.get("/{airline_code}")
def get_airline_meals(airline_code: str):
    airline_code = airline_code.upper()
    airline_data = meals_db.get("airlines", {}).get(airline_code)
    if not airline_data:
        raise HTTPException(status_code=404, detail=f"Airline {airline_code} not found")
    return airline_data

@router.get("/{airline_code}/category/{category}")
def get_airline_meals_by_category(airline_code: str, category: str):
    airline_code = airline_code.upper()
    airline_data = meals_db.get("airlines", {}).get(airline_code)
    if not airline_data:
        raise HTTPException(status_code=404, detail=f"Airline {airline_code} not found")
    
    meals = airline_data.get("meals", [])
    filtered_meals = [m for m in meals if m.get("category", "").lower() == category.lower()]
    return {
        "airline": airline_data.get("name"),
        "category": category,
        "meals": filtered_meals
    }
