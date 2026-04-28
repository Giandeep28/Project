import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import FlightStatusCard from '../components/FlightStatusCard';
import FlightHistoryTable from '../components/FlightHistoryTable';

const Skeleton = () => (
  <div style={{ background: 'white', borderRadius: 8, padding: 24, marginBottom: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', animation: 'pulse 1.5s infinite' }}>
    <div style={{ height: 32, width: '40%', background: '#eee', borderRadius: 4, marginBottom: 16 }}></div>
    <div style={{ height: 400, width: '100%', background: '#f9f9f9', borderRadius: 8, marginBottom: 24 }}></div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 16 }}>
      <div style={{ height: 80, background: '#eee', borderRadius: 4 }}></div>
      <div style={{ height: 80, background: '#eee', borderRadius: 4 }}></div>
      <div style={{ height: 80, background: '#eee', borderRadius: 4 }}></div>
    </div>
    <style>{`@keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }`}</style>
  </div>
);

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
  const [lastUpdated, setLastUpdated] = useState(null);
  const [timer, setTimer] = useState(0);
  
  const refreshTimerRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    if (flightData?.status === 'IN_AIR') {
      counterRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(counterRef.current);
    }
    return () => clearInterval(counterRef.current);
  }, [flightData]);

  useEffect(() => {
    return () => clearInterval(refreshTimerRef.current);
  }, []);

  const parseFlightInput = (airlineField, numberField) => {
    const input = numberField.trim().toUpperCase().replace(/\s+/g, " ");
    const match = input.match(/^([A-Z]{2,3})\s*(\d{1,4})$/);
    if (match) return { code: match[1], num: match[2] };
    
    let code = airlineField.trim().toUpperCase();
    const map = {
      "INDIGO": "6E", "AIR INDIA": "AI", "SPICEJET": "SG", "VISTARA": "UK",
      "EMIRATES": "EK", "QATAR": "QR", "ETIHAD": "EY", "BRITISH AIRWAYS": "BA"
    };
    if (map[code]) code = map[code];
    
    return { code: code.substring(0, 2), num: input.replace(/\D/g, "") };
  };

  const searchByNumber = async () => {
    const parsed = parseFlightInput(airline, flightNum);
    if (!parsed || !parsed.code || !parsed.num) {
      setError("Please enter a valid flight number (e.g. 6E 4420)");
      return;
    }
    fetchFlight(parsed.code, parsed.num);
  };

  const fetchFlight = async (code, num) => {
    const today = new Date().toISOString().split("T")[0];
    setLoading(true);
    setError(null);
    clearInterval(refreshTimerRef.current);

    try {
      const res = await axios.get(`http://localhost:8080/api/tracking/flight`, {
        params: { airline: code, number: num, date: today }
      });
      setFlightData(res.data.flight);
      setLastUpdated(new Date());
      setTimer(0);
      
      try {
        const histRes = await axios.get(`http://localhost:8080/api/tracking/history`, {
          params: { airline: code, number: num }
        });
        setHistoryData(histRes.data.history || []);
      } catch(e) {}
      
      if (res.data.flight?.status === "IN_AIR") {
        refreshTimerRef.current = setInterval(() => fetchFlight(code, num), 60000);
      }
    } catch (err) {
      setError("Flight not found. Please check the flight number.");
    } finally {
      setLoading(false);
    }
  };

  const searchByRoute = async () => {
    if (!fromCity || !toCity) {
      setError("Enter both departure and arrival airports.");
      return;
    }
    setLoading(true);
    setError(null);
    setFlightData(null);
    setHistoryData([]);
    
    const today = new Date().toISOString().split("T")[0];
    try {
      const res = await axios.get(`http://localhost:8080/api/tracking/route`, {
        params: { from_airport: fromCity.trim().toUpperCase(), to_airport: toCity.trim().toUpperCase(), date: today }
      });
      if (res.data.flights && res.data.flights.length > 0) {
        setFlightData(res.data.flights[0]);
        setRouteResults(res.data.flights);
      } else {
        setError("No flights found on this route today.");
      }
    } catch (err) {
      setError("Route search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", paddingTop: "64px" }}>
      {/* Search Header */}
      <div style={{ backgroundColor: "#1a2e5a", padding: "48px 24px", color: 'white' }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.02em' }}>LIVE FLIGHT TRACKER</h1>
          <p style={{ color: '#aac4f0', marginBottom: 32, fontSize: 16 }}>Track any flight in the world with real-time radar data.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, background: 'rgba(255,255,255,0.05)', padding: 32, borderRadius: 12, backdropFilter: 'blur(10px)' }}>
            {/* By Number */}
            <div>
              <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20, color: '#4a7fd4' }}>Search by Flight Number</h3>
              <div style={{ display: 'flex', gap: 12 }}>
                <input value={airline} onChange={e => setAirline(e.target.value)} placeholder="Airline (e.g. AI)" style={{ flex: 1, padding: '14px', borderRadius: 8, border: 'none', background: 'white', color: '#333' }} />
                <input value={flightNum} onChange={e => setFlightNum(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchByNumber()} placeholder="Flight #" style={{ flex: 1, padding: '14px', borderRadius: 8, border: 'none', background: 'white', color: '#333' }} />
                <button onClick={searchByNumber} style={{ background: '#4a7fd4', border: 'none', borderRadius: 8, width: 50, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
                </button>
              </div>
            </div>

            {/* By Route */}
            <div>
              <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20, color: '#4a7fd4' }}>Search by Route</h3>
              <div style={{ display: 'flex', gap: 12 }}>
                <input value={fromCity} onChange={e => setFromCity(e.target.value)} placeholder="From (e.g. DEL)" style={{ flex: 1, padding: '14px', borderRadius: 8, border: 'none', background: 'white', color: '#333' }} />
                <input value={toCity} onChange={e => setToCity(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchByRoute()} placeholder="To (e.g. BOM)" style={{ flex: 1, padding: '14px', borderRadius: 8, border: 'none', background: 'white', color: '#333' }} />
                <button onClick={searchByRoute} style={{ background: '#e8871a', color: 'white', border: 'none', borderRadius: 8, padding: '0 20px', fontWeight: 800, cursor: 'pointer' }}>GO</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1000, margin: "-20px auto 40px", padding: "0 24px", position: 'relative', zIndex: 10 }}>
        {loading ? <Skeleton /> : (
          <>
            {error && (
              <div style={{ background: "#fee2e2", border: "1px solid #ef4444", borderRadius: 8, padding: 16, color: "#991b1b", marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>⚠️</span> {error}
              </div>
            )}
            
            {flightData && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 13, color: '#666', fontWeight: 600 }}>
                    {lastUpdated && `LAST UPDATED: ${lastUpdated.toLocaleTimeString()}`}
                  </div>
                  {flightData.status === 'IN_AIR' && (
                    <div style={{ fontSize: 13, color: '#4a7fd4', fontWeight: 700 }}>
                      REFRESHING IN {60 - timer}s...
                    </div>
                  )}
                </div>
                <FlightStatusCard flight={flightData} />
              </>
            )}

            {routeResults.length > 1 && (
              <div style={{ marginTop: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, color: '#1a2e5a' }}>OTHER FLIGHTS TODAY</h3>
                {routeResults.slice(1).map((f, i) => <FlightStatusCard key={i} flight={f} compact />)}
              </div>
            )}

            {historyData.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, color: '#1a2e5a' }}>RECENT FLIGHT HISTORY</h3>
                <FlightHistoryTable history={historyData} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
