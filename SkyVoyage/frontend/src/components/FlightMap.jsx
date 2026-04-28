import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Custom plane icon creator
const createPlaneIcon = (heading) => {
  return L.divIcon({
    className: 'custom-plane-icon',
    html: `<div style="transform: rotate(${heading || 0}deg); font-size: 20px; line-height: 1; text-align: center; color: #1e3a8a; text-shadow: 0px 0px 2px white;">✈</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

export default function FlightMap() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFlights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/api/tracking/live');
      setFlights(response.data.slice(0, 3000));
    } catch (err) {
      console.error('Error fetching flights:', err);
      setError('Failed to load live flight data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlights();
    const interval = setInterval(() => {
      fetchFlights();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchFlights]);

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      {/* Controls Overlay */}
      <div style={{
        position: 'absolute', top: 20, right: 20, zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)', padding: '16px',
        borderRadius: 8, boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column', gap: 12,
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#111827' }}>
          {flights.length} flights tracked live
        </div>
        <button 
          onClick={fetchFlights}
          disabled={loading}
          style={{
            background: '#C8A84B', color: '#111827', border: 'none',
            padding: '8px 16px', borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 700, opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s'
          }}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
        {error && <div style={{ color: '#ef4444', fontSize: '13px', maxWidth: '150px' }}>{error}</div>}
      </div>

      {loading && flights.length === 0 && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          zIndex: 1000, background: 'rgba(10, 15, 26, 0.85)', color: 'white',
          padding: '24px 40px', borderRadius: 12, fontSize: '18px', fontWeight: 600,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 12
        }}>
          <div style={{ 
            width: 24, height: 24, border: '3px solid rgba(200,168,75,0.3)', 
            borderTopColor: '#C8A84B', borderRadius: '50%', animation: 'spin 1s linear infinite' 
          }} />
          Loading Live Radar...
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <MapContainer 
        center={[20, 0]} 
        zoom={3} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        worldCopyJump={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {flights.map(flight => (
          flight.lat && flight.lon && (
            <Marker 
              key={flight.id || flight.callsign || Math.random()} 
              position={[flight.lat, flight.lon]}
              icon={createPlaneIcon(flight.heading)}
            >
              <Popup className="flight-popup">
                <div style={{ minWidth: '160px', color: '#111827' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', borderBottom: '2px solid #C8A84B', paddingBottom: '6px', fontWeight: 800 }}>
                    Flight {flight.callsign || 'Unknown'}
                  </h3>
                  <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>Country</span>
                      <span style={{ fontWeight: 600 }}>{flight.origin_country || 'Unknown'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>Altitude</span>
                      <span style={{ fontWeight: 600 }}>{flight.altitude_m !== null ? Math.round(flight.altitude_m) + ' m' : 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>Speed</span>
                      <span style={{ fontWeight: 600 }}>{flight.speed_kmh !== null ? Math.round(flight.speed_kmh) + ' km/h' : 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6B7280' }}>Heading</span>
                      <span style={{ fontWeight: 600 }}>{flight.heading !== null ? Math.round(flight.heading) + '°' : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
}
