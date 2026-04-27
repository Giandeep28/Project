from fastapi import APIRouter, HTTPException, Query
import httpx
import os
import json
import random
from datetime import datetime, date, timedelta
from typing import Optional

router = APIRouter(prefix="/api/tracking", tags=["tracking"])

AVIATIONSTACK_KEY = os.getenv("AVIATIONSTACK_API_KEY", "")

# --- EXISTING OPENSKY ENDPOINTS (PRESERVED) ---

@router.get("/live")
async def get_live_flights():
    url = "https://opensky-network.org/api/states/all"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            
            states = data.get("states", [])
            flights = []
            
            if not states:
                return []
                
            for state in states:
                if len(state) > 13:
                    lon = state[5]
                    lat = state[6]
                    on_ground = state[13]
                    
                    if lat is not None and lon is not None and not on_ground:
                        callsign = str(state[1]).strip() if state[1] else ""
                        velocity_ms = state[9]
                        speed_kmh = velocity_ms * 3.6 if velocity_ms is not None else None
                        
                        flight = {
                            "id": state[0],
                            "callsign": callsign,
                            "origin_country": state[2],
                            "lat": lat,
                            "lon": lon,
                            "altitude_m": state[7],
                            "speed_kmh": speed_kmh,
                            "heading": state[10]
                        }
                        flights.append(flight)
                        
                        if len(flights) >= 3000:
                            break
                            
            return flights
    except Exception as e:
        raise HTTPException(status_code=503, detail="Failed to fetch flight data from OpenSky Network")

@router.get("/flight/{icao24}")
async def get_flight_detail(icao24: str):
    url = f"https://opensky-network.org/api/states/all?icao24={icao24}"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            
            states = data.get("states")
            if not states:
                raise HTTPException(status_code=404, detail="Flight not found")
                
            state = states[0]
            if len(state) > 13:
                lon = state[5]
                lat = state[6]
                callsign = str(state[1]).strip() if state[1] else ""
                velocity_ms = state[9]
                speed_kmh = velocity_ms * 3.6 if velocity_ms is not None else None
                
                return {
                    "id": state[0],
                    "callsign": callsign,
                    "origin_country": state[2],
                    "lat": lat,
                    "lon": lon,
                    "altitude_m": state[7],
                    "speed_kmh": speed_kmh,
                    "heading": state[10]
                }
            else:
                raise HTTPException(status_code=404, detail="Incomplete flight data")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=503, detail="Failed to fetch flight data from OpenSky Network")


# --- NEW AVIATIONSTACK INTEGRATION ENDPOINTS ---

AIRCRAFT_MAP = {
    "321": "Airbus A321",
    "73H": "Boeing 737-800",
    "77W": "Boeing 777-300ER",
    "320": "Airbus A320",
    "738": "Boeing 737-800",
    "789": "Boeing 787-9",
    "333": "Airbus A330-300",
    "388": "Airbus A380-800",
    "744": "Boeing 747-400",
    "E90": "Embraer E190",
    "AT7": "ATR 72",
    "DH8": "Bombardier Dash 8"
}

STATUS_MAP = {
    "active": "IN_AIR",
    "landed": "LANDED",
    "scheduled": "SCHEDULED",
    "cancelled": "CANCELLED",
    "diverted": "DIVERTED"
}

def map_aircraft(iata_code: str) -> str:
    if not iata_code:
        return "Unknown"
    return AIRCRAFT_MAP.get(iata_code, iata_code)

def generate_mock_flight(airline: str, number: str, date_str: str, route_from="DEL", route_to="BOM") -> dict:
    seed = sum(ord(c) for c in (airline + number + date_str))
    rng = random.Random(seed)
    
    status = rng.choices(["SCHEDULED", "IN_AIR", "LANDED", "DELAYED", "CANCELLED"], weights=[0.2, 0.4, 0.3, 0.08, 0.02])[0]
    
    delay_dep = rng.randint(15, 60) if status == "DELAYED" else rng.choice([0, 0, 5])
    delay_arr = rng.randint(15, 45) if status == "DELAYED" else rng.choice([0, 0, -5, 10])
    
    base_dt = datetime.fromisoformat(f"{date_str}T00:00:00+00:00") + timedelta(hours=rng.randint(5, 20), minutes=rng.choice([0, 15, 30, 45]))
    sched_dep = base_dt
    actual_dep = sched_dep + timedelta(minutes=delay_dep)
    
    duration = rng.randint(90, 400)
    sched_arr = sched_dep + timedelta(minutes=duration)
    actual_arr = actual_dep + timedelta(minutes=duration) + timedelta(minutes=delay_arr)
    
    return {
        "flight_number": f"{airline}{number}",
        "callsign": f"{airline} {number}",
        "airline": {"name": f"Airline {airline}", "iata": airline},
        "status": status,
        "departure": {
            "airport": f"Airport {route_from}",
            "city": f"City {route_from}",
            "iata": route_from,
            "scheduled": sched_dep.isoformat(),
            "actual": actual_dep.isoformat() if status != "SCHEDULED" else None,
            "delay_minutes": delay_dep,
            "gate": f"{rng.choice(['A','B','C','D'])}{rng.randint(1, 25)}",
            "terminal": str(rng.randint(1, 3))
        },
        "arrival": {
            "airport": f"Airport {route_to}",
            "city": f"City {route_to}",
            "iata": route_to,
            "scheduled": sched_arr.isoformat(),
            "actual": actual_arr.isoformat() if status in ["LANDED", "IN_AIR"] else None,
            "delay_minutes": delay_arr,
            "gate": f"{rng.choice(['A','B','C','D'])}{rng.randint(1, 25)}",
            "terminal": str(rng.randint(1, 3))
        },
        "aircraft": {
            "type": map_aircraft(rng.choice(list(AIRCRAFT_MAP.keys()))), 
            "registration": f"VT-{rng.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}{rng.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}"
        },
        "duration_minutes": duration,
        "live": {
            "lat": rng.uniform(10.0, 30.0) if status == "IN_AIR" else None,
            "lon": rng.uniform(70.0, 90.0) if status == "IN_AIR" else None,
            "altitude_ft": rng.randint(30000, 38000) if status == "IN_AIR" else None,
            "speed_kmh": rng.randint(750, 900) if status == "IN_AIR" else None
        }
    }

def map_aviationstack_flight(f: dict) -> dict:
    f_flight = f.get("flight", {}) or {}
    f_dep = f.get("departure", {}) or {}
    f_arr = f.get("arrival", {}) or {}
    f_ac = f.get("aircraft", {}) or {}
    f_live = f.get("live", {}) or {}
    f_airline = f.get("airline", {}) or {}
    
    # Calculate duration
    duration = None
    if f_arr.get("scheduled") and f_dep.get("scheduled"):
        try:
            d_arr = datetime.fromisoformat(f_arr["scheduled"])
            d_dep = datetime.fromisoformat(f_dep["scheduled"])
            duration = int((d_arr - d_dep).total_seconds() / 60)
        except:
            pass
            
    dep_city = f_dep.get("timezone", "").split("/")[-1].replace("_", " ") if f_dep.get("timezone") else ""
    arr_city = f_arr.get("timezone", "").split("/")[-1].replace("_", " ") if f_arr.get("timezone") else ""
    
    return {
        "flight_number": f_flight.get("iata"),
        "callsign": (f_flight.get("icao", "") + " " + f_flight.get("number", "")).strip(),
        "airline": {"name": f_airline.get("name"), "iata": f_airline.get("iata")},
        "status": STATUS_MAP.get(f.get("flight_status", "scheduled"), "SCHEDULED"),
        "departure": {
            "airport": f_dep.get("airport"),
            "city": dep_city,
            "iata": f_dep.get("iata"),
            "scheduled": f_dep.get("scheduled"),
            "actual": f_dep.get("actual") or f_dep.get("estimated"),
            "delay_minutes": f_dep.get("delay"),
            "gate": f_dep.get("gate"),
            "terminal": f_dep.get("terminal")
        },
        "arrival": {
            "airport": f_arr.get("airport"),
            "city": arr_city,
            "iata": f_arr.get("iata"),
            "scheduled": f_arr.get("scheduled"),
            "actual": f_arr.get("actual") or f_arr.get("estimated"),
            "delay_minutes": f_arr.get("delay"),
            "gate": f_arr.get("gate"),
            "terminal": f_arr.get("terminal")
        },
        "aircraft": {
            "type": map_aircraft(f_ac.get("iata")),
            "registration": f_ac.get("registration")
        },
        "duration_minutes": duration,
        "live": {
            "lat": f_live.get("latitude") if f_live else None,
            "lon": f_live.get("longitude") if f_live else None,
            "altitude_ft": f_live.get("altitude") if f_live else None,
            "speed_kmh": f_live.get("speed_horizontal") if f_live else None
        }
    }


IATA_TO_ICAO = {
    "6E": "IGO", "AI": "AIC", "UK": "VTI", "SG": "SEJ", "EK": "UAE",
    "QR": "QTR", "EY": "ETD", "BA": "BAW", "LH": "DLH", "SQ": "SIA",
    "TG": "THA", "CX": "CPA", "AF": "AFR", "KL": "KLM", "UA": "UAL",
    "AA": "AAL", "DL": "DAL"
}

def get_icao_callsign(airline: str, number: str) -> str:
    prefix = IATA_TO_ICAO.get(airline.upper(), airline.upper())
    return f"{prefix}{number}"

async def search_opensky_live(callsign: str) -> Optional[dict]:
    url = "https://opensky-network.org/api/states/all"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(url)
            if res.status_code == 200:
                states = res.json().get("states", [])
                for s in states:
                    s_callsign = str(s[1]).strip()
                    if s_callsign == callsign:
                        return {
                            "lat": s[6],
                            "lon": s[5],
                            "altitude_ft": s[7] * 3.28084 if s[7] else None,
                            "speed_kmh": s[9] * 3.6 if s[9] else None,
                            "heading": s[10],
                            "origin_country": s[2]
                        }
    except:
        pass
    return None

@router.get("/flight")
async def get_flight_status(airline: str = Query(...), number: str = Query(...), date: str = Query(...)):
    # 1. Try Live OpenSky First for "Godmode" feel
    icao_callsign = get_icao_callsign(airline, number)
    live_data = await search_opensky_live(icao_callsign)
    
    # 2. Try AviationStack for schedule data if key is real
    av_data = None
    is_placeholder = "your_free_key" in AVIATIONSTACK_KEY or not AVIATIONSTACK_KEY
    
    if not is_placeholder:
        url = "http://api.aviationstack.com/v1/flights"
        params = {"access_key": AVIATIONSTACK_KEY, "flight_iata": f"{airline}{number}", "limit": 1}
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(url, params=params)
                if res.status_code == 200:
                    data = res.json().get("data", [])
                    if data:
                        av_data = map_aviationstack_flight(data[0])
        except:
            pass

    # 3. Merge or Fallback to Mock
    if av_data:
        if live_data:
            av_data["live"] = live_data
            av_data["status"] = "IN_AIR"
        return {"flight": av_data, "data_source": "aviationstack" + ("+opensky" if live_data else "")}
    
    if live_data:
        # Construct a partial flight from live data
        mock = generate_mock_flight(airline, number, date)
        mock["live"] = live_data
        mock["status"] = "IN_AIR"
        mock["airline"]["name"] = f"{airline} (Live Tracked)"
        return {"flight": mock, "data_source": "opensky+mock"}

    # Mock fallback
    return {"flight": generate_mock_flight(airline, number, date), "data_source": "mock"}

@router.get("/route")
async def get_route_flights(from_airport: str = Query(...), to_airport: str = Query(...), date: str = Query(...)):
    if AVIATIONSTACK_KEY:
        url = "http://api.aviationstack.com/v1/flights"
        params = {
            "access_key": AVIATIONSTACK_KEY,
            "dep_iata": from_airport,
            "arr_iata": to_airport,
            "limit": 20
        }
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(url, params=params)
                if res.status_code == 200:
                    data = res.json().get("data", [])
                    flights = [map_aviationstack_flight(f) for f in data]
                    # Sort by scheduled departure
                    flights = sorted(flights, key=lambda x: x["departure"]["scheduled"] or "")
                    return {"flights": flights, "count": len(flights), "data_source": "aviationstack"}
        except Exception:
            pass
            
    # Mock fallback
    rng = random.Random(sum(ord(c) for c in (from_airport + to_airport + date)))
    num_flights = rng.randint(4, 8)
    flights = []
    for i in range(num_flights):
        airline = rng.choice(["6E", "AI", "UK", "SG", "QP"])
        number = str(rng.randint(100, 9999))
        f = generate_mock_flight(airline, number, date, from_airport, to_airport)
        # Shift hours so they distribute across the day
        hour = (rng.randint(5, 23) + i) % 24
        f["departure"]["scheduled"] = f["departure"]["scheduled"].replace("T0", f"T{hour:02d}").replace(f"T1", f"T{hour:02d}").replace(f"T2", f"T{hour:02d}")
        flights.append(f)
        
    flights = sorted(flights, key=lambda x: x["departure"]["scheduled"] or "")
    return {"flights": flights, "count": len(flights), "data_source": "mock"}

@router.get("/history")
async def get_flight_history(airline: str = Query(...), number: str = Query(...)):
    if AVIATIONSTACK_KEY:
        url = "http://api.aviationstack.com/v1/flights"
        params = {
            "access_key": AVIATIONSTACK_KEY,
            "flight_iata": f"{airline}{number}",
            "limit": 10
        }
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(url, params=params)
                if res.status_code == 200:
                    data = res.json().get("data", [])
                    history = [map_aviationstack_flight(f) for f in data]
                    if history:
                        route = {"from": history[0]["departure"]["iata"], "to": history[0]["arrival"]["iata"]}
                    else:
                        route = {"from": "Unknown", "to": "Unknown"}
                    return {"history": history, "route": route, "data_source": "aviationstack"}
        except Exception:
            pass
            
    # Mock fallback
    history = []
    today = datetime.now()
    for i in range(1, 11):
        dt = (today - timedelta(days=i)).strftime("%Y-%m-%d")
        f = generate_mock_flight(airline, number, dt)
        f["status"] = "LANDED"
        history.append(f)
        
    route = {"from": "DEL", "to": "BOM"}
    return {"history": history, "route": route, "data_source": "mock"}

@router.get("/health")
async def tracking_health():
    return {
        "status": "ok",
        "api": "aviationstack",
        "key_configured": bool(AVIATIONSTACK_KEY)
    }
