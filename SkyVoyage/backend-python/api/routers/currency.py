from fastapi import APIRouter, HTTPException
import httpx
import time
from typing import Dict, Any

router = APIRouter(prefix="/api/currency", tags=["currency"])

# In-memory cache
cache = {
    "timestamp": 0,
    "rates": None,
    "base": "USD"
}

CACHE_TTL = 3600  # 1 hour in seconds

async def fetch_rates() -> Dict[str, Any]:
    current_time = time.time()
    
    # Return cache if valid
    if cache["rates"] is not None and (current_time - cache["timestamp"]) < CACHE_TTL:
        return {"base": cache["base"], "rates": cache["rates"], "updated": cache["timestamp"]}
        
    # Otherwise fetch new rates
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Primary API
            response = await client.get("https://open.er-api.com/v6/latest/USD")
            response.raise_for_status()
            data = response.json()
            
            cache["rates"] = data.get("rates", {})
            cache["base"] = data.get("base_code", "USD")
            cache["timestamp"] = current_time
            
            return {"base": cache["base"], "rates": cache["rates"], "updated": cache["timestamp"]}
    except Exception as e:
        print("Primary currency API failed, trying fallback:", e)
        try:
            # Fallback API
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get("https://api.exchangerate-api.com/v4/latest/USD")
                response.raise_for_status()
                data = response.json()
                
                cache["rates"] = data.get("rates", {})
                cache["base"] = data.get("base", "USD")
                cache["timestamp"] = current_time
                
                return {"base": cache["base"], "rates": cache["rates"], "updated": cache["timestamp"]}
        except Exception as fallback_e:
            print("Fallback currency API failed:", fallback_e)
            
            # Return old cache if we have it
            if cache["rates"] is not None:
                return {"base": cache["base"], "rates": cache["rates"], "updated": cache["timestamp"], "stale": True}
            
            raise HTTPException(status_code=503, detail="rates unavailable")

@router.get("/rates")
async def get_all_rates():
    try:
        data = await fetch_rates()
        return data
    except HTTPException:
        return {"error": "rates unavailable"}

@router.get("/rates/{from_currency}/{to_currency}")
async def get_conversion_rate(from_currency: str, to_currency: str):
    try:
        from_currency = from_currency.upper()
        to_currency = to_currency.upper()
        
        data = await fetch_rates()
        rates = data.get("rates", {})
        
        if from_currency not in rates or to_currency not in rates:
            raise HTTPException(status_code=400, detail="Invalid currency code")
            
        rate = rates[to_currency] / rates[from_currency]
        
        return {
            "from": from_currency,
            "to": to_currency,
            "rate": rate,
            "updated": data.get("updated")
        }
    except HTTPException:
        return {"error": "rates unavailable"}
    except Exception as e:
        return {"error": str(e)}
