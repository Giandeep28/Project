from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import auth, flights, bookings

app = FastAPI(
    title="SkyVoyage | Production Aviation API",
    description="Enterprise-grade modular backend for the SkyVoyage platform.",
    version="3.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Modular Routers
app.include_router(auth.router)
app.include_router(flights.router)
app.include_router(bookings.router)

@app.get("/health")
async def health_check():
    return {
        "status": "operational",
        "version": "3.0.0",
        "services": {
            "auth": "up",
            "flights": "up",
            "bookings": "up",
            "database": "sqlite/persistent"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
