import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import FlightStatusCard from '../components/FlightStatusCard';
import FlightHistoryTable from '../components/FlightHistoryTable';

export default function FlightTracker() {
  const [airline, setAirline] = useState('');
  const [flightNum, setFlightNum] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  
  const [flightData, setFlightData] = useState(null);
  const [routeResults, setRouteResults] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const refreshTimerRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(refreshTimerRef.current);
  }, []);

  const parseFlightInput = (airlineField, numberField) => {
    const input = numberField.trim().toUpperCase().replace(/\s+/g, " ");
    const match = input.match(/^([A-Z]{2,3})\s*(\d{1,4})$/);
    if (match) return { code: match[1], num: match[2] };
    
    if (airlineField.trim()) {
      const aName = airlineField.trim().toLowerCase();
      let mappedCode = aName.substring(0, 2).toUpperCase();
      const map = {
        "indigo": "6E", "air india": "AI", "spicejet": "SG", "vistara": "UK",
        "emirates": "EK", "qatar": "QR", "etihad": "EY", "british airways": "BA",
        "lufthansa": "LH", "singapore airlines": "SQ", "thai": "TG", "air france": "AF",
        "klm": "KL", "united": "UA", "american": "AA", "delta": "DL"
      };
      if (map[aName]) mappedCode = map[aName];
      return { code: mappedCode, num: input.replace(/\D/g, "") };
    }
    return null;
  };

  const searchByNumber = async () => {
    const parsed = parseFlightInput(airline, flightNum);
    if (!parsed || !parsed.code || !parsed.num) {
      setError("Please enter a valid flight number (e.g. 6E 4420 or AI 302)");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    setLoading(true);
    setError(null);
    setFlightData(null);
    setRouteResults([]);
    setHistoryData([]);
    clearInterval(refreshTimerRef.current);

    try {
      const res = await axios.get(`http://localhost:8000/api/tracking/flight`, {
        params: { airline: parsed.code, number: parsed.num, date: today }
      });
      setFlightData(res.data.flight);
      
      try {
        const histRes = await axios.get(`http://localhost:8000/api/tracking/history`, {
          params: { airline: parsed.code, number: parsed.num }
        });
        setHistoryData(histRes.data.history || []);
      } catch(e) {
        console.error("History fetch failed", e);
      }
      
      if (res.data.flight?.status === "IN_AIR") {
        refreshTimerRef.current = setInterval(() => searchByNumber(), 60000);
      }
    } catch (err) {
      if (!err.response) {
        setError("The flight tracking server is currently offline. Please ensure the backend is running on port 8000.");
      } else {
        setError("Flight not found in live or scheduled databases. Please check the airline and flight number.");
      }
    } finally {
      setLoading(false);
    }
  };

  const searchByRoute = async () => {
    if (!fromCity || !toCity) {
      setError("Please enter both departure and arrival cities/airports.");
      return;
    }
    setLoading(true);
    setError(null);
    setFlightData(null);
    setRouteResults([]);
    setHistoryData([]);
    clearInterval(refreshTimerRef.current);

    const today = new Date().toISOString().split("T")[0];
    try {
      const res = await axios.get(`http://localhost:8000/api/tracking/route`, {
        params: { from_airport: fromCity.trim().toUpperCase(), to_airport: toCity.trim().toUpperCase(), date: today }
      });
      if (res.data.flights && res.data.flights.length > 0) {
        setFlightData(res.data.flights[0]);
        setRouteResults(res.data.flights);
      } else {
        setError("No flights found on this route today.");
      }
    } catch (err) {
      setError("Could not search route. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", paddingTop: "64px" }}>
      {/* ── SEARCH SECTION — Dark navy background ─────────────── */}
      <div style={{ backgroundColor: "#1a2e5a", padding: "32px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", gap: 24, alignItems: "stretch" }}>
          
          {/* LEFT PANEL — search by flight number */}
          <div style={{ flex: 1, backgroundColor: "#1a2e5a", color: "white" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: "white", marginTop: 0 }}>
              Quickly & Easily Track a Flight
            </h2>
            <hr style={{ borderColor: "rgba(255,255,255,0.2)", marginBottom: 20 }} />
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#ccc", display: "block", marginBottom: 4 }}>
              AIRLINE
            </label>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <input
                  value={airline}
                  onChange={e => setAirline(e.target.value)}
                  placeholder="e.g. IndiGo"
                  style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "none",
                           borderBottom: "2px solid #4a7fd4", background: "transparent", color: "white",
                           outline: "none", boxSizing: "border-box" }}
                />
                <div style={{ height: 16 }} />
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#ccc", display: "block", marginBottom: 4 }}>
                  FLIGHT #
                </label>
                <input
                  value={flightNum}
                  onChange={e => setFlightNum(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && searchByNumber()}
                  placeholder="e.g. 6E 4420"
                  style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "none",
                           borderBottom: "2px solid white", background: "white", color: "#333",
                           outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <button
                onClick={searchByNumber}
                style={{ width: 48, height: 48, borderRadius: 4, backgroundColor: "#4a7fd4",
                         border: "none", cursor: "pointer", display: "flex", alignItems: "center",
                         justifyContent: "center", flexShrink: 0 }}
                title="Search by flight number"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2.5"/>
                  <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* DIVIDER */}
          <div style={{ width: 1, backgroundColor: "rgba(255,255,255,0.15)", margin: "0 8px" }} />

          {/* RIGHT PANEL — search by route */}
          <div style={{ flex: 1, backgroundColor: "#3a6ea8", borderRadius: 4, padding: 20, color: "white" }}>
            <h3 style={{ fontStyle: "italic", fontWeight: 400, fontSize: 18, marginBottom: 16, color: "white", marginTop: 0 }}>
              Forgot the flight number?
            </h3>
            <hr style={{ borderColor: "rgba(255,255,255,0.3)", marginBottom: 16 }} />
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#ddd", display: "block", marginBottom: 4 }}>
              DEPARTURE AIRPORT OR CITY
            </label>
            <input
              value={fromCity}
              onChange={e => setFromCity(e.target.value)}
              placeholder="e.g. New Delhi"
              style={{ width: "100%", padding: "8px 10px", fontSize: 13, border: "none",
                       borderRadius: 2, background: "white", color: "#333", outline: "none",
                       boxSizing: "border-box", marginBottom: 12 }}
            />
            <div style={{ fontStyle: "italic", color: "#ddd", fontSize: 13, marginBottom: 12, textAlign: "center" }}>
              -and-
            </div>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#ddd", display: "block", marginBottom: 4 }}>
              ARRIVAL AIRPORT OR CITY
            </label>
            <input
              value={toCity}
              onChange={e => setToCity(e.target.value)}
              onKeyDown={e => e.key === "Enter" && searchByRoute()}
              placeholder="e.g. Mumbai"
              style={{ width: "100%", padding: "8px 10px", fontSize: 13, border: "none",
                       borderRadius: 2, background: "white", color: "#333", outline: "none",
                       boxSizing: "border-box", marginBottom: 16 }}
            />
            <button
              onClick={searchByRoute}
              style={{ width: "100%", padding: "10px", backgroundColor: "#e8871a",
                       border: "none", borderRadius: 2, color: "white", fontSize: 13,
                       fontWeight: 700, letterSpacing: 1, cursor: "pointer" }}
            >
              SEARCH
            </button>
          </div>

        </div>

        {/* Bottom links row (like FlightAware) */}
        <div style={{ maxWidth: 960, margin: "16px auto 0", textAlign: "center", color: "#aac4f0", fontSize: 13 }}>
          (<a href="#" style={{ color: "#aac4f0" }}>Worldwide airport delays</a>) &nbsp;
          (<a href="#" style={{ color: "#aac4f0" }}>Live flight cancellations</a>)
        </div>
      </div>

      {/* ── RESULTS SECTION ───────────────────────────────────── */}
      <div style={{ maxWidth: 960, margin: "24px auto", padding: "0 16px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: 40, color: "#555", fontSize: 16 }}>
            Searching for flight data...
          </div>
        )}
        {error && (
          <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 4,
                        padding: 16, color: "#856404", marginBottom: 16 }}>
            {error}
          </div>
        )}
        {flightData && <FlightStatusCard flight={flightData} />}
        {routeResults.length > 1 && (
          <div style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 14, color: "#555", marginBottom: 8 }}>
              All flights on this route today ({routeResults.length} found):
            </h3>
            {routeResults.slice(1).map((f, i) => (
              <FlightStatusCard key={i} flight={f} compact />
            ))}
          </div>
        )}
        {historyData.length > 0 && <FlightHistoryTable history={historyData} />}
      </div>
    </div>
  );
}
