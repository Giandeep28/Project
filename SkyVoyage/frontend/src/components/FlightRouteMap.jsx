import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom plane icon
const createPlaneIcon = (heading) => {
  return L.divIcon({
    className: 'custom-plane-icon',
    html: `<div style="transform: rotate(${heading || 0}deg); font-size: 24px; color: #1e3a8a; text-shadow: 0 0 3px white;">✈</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Helper to calculate arc points (Beizer curve approximation)
const getArcPoints = (start, end, segments = 50) => {
  const points = [];
  const [lat1, lon1] = start;
  const [lat2, lon2] = end;

  // Midpoint with offset for arc
  const midLat = (lat1 + lat2) / 2 + (Math.abs(lon2 - lon1) * 0.1);
  const midLon = (lon1 + lon2) / 2;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Quadratic Bezier
    const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * midLat + t * t * lat2;
    const lon = (1 - t) * (1 - t) * lon1 + 2 * (1 - t) * t * midLon + t * t * lon2;
    points.push([lat, lon]);
  }
  return points;
};

// Component to fit map to bounds
function FitBounds({ points }) {
  const map = useMap();
  React.useEffect(() => {
    if (points && points.length > 0) {
      map.fitBounds(L.polyline(points).getBounds(), { padding: [50, 50] });
    }
  }, [points, map]);
  return null;
}

export default function FlightRouteMap({ flight }) {
  const dep = flight?.departure;
  const arr = flight?.arrival;
  const live = flight?.live;

  const points = useMemo(() => {
    if (dep?.lat && arr?.lat) {
      return getArcPoints([dep.lat, dep.lon], [arr.lat, arr.lon]);
    }
    return [];
  }, [dep, arr]);

  // Calculate interpolation position if IN_AIR and no live lat/lon
  const interpolatedPos = useMemo(() => {
    if (flight?.status !== 'IN_AIR' || !dep || !arr || points.length === 0) return null;
    
    const now = new Date().getTime();
    const start = new Date(dep.actual || dep.scheduled).getTime();
    const end = new Date(arr.actual || arr.scheduled).getTime();
    
    const progress = Math.min(1, Math.max(0, (now - start) / (end - start)));
    const idx = Math.floor(progress * (points.length - 1));
    
    // Calculate heading (rough)
    const nextIdx = Math.min(idx + 1, points.length - 1);
    const p1 = points[idx];
    const p2 = points[nextIdx];
    const heading = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * (180 / Math.PI);
    
    return { pos: p1, heading: heading + 90 }; // Plane icon is oriented north
  }, [flight, dep, arr, points]);

  const planePos = live?.lat ? [live.lat, live.lon] : interpolatedPos?.pos;
  const planeHeading = live?.heading || interpolatedPos?.heading || 0;

  if (!dep?.lat || !arr?.lat) {
    return (
      <div style={{ height: 300, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
        Map coordinates unavailable for this flight
      </div>
    );
  }

  return (
    <div style={{ height: 400, width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid #ddd', position: 'relative' }}>
      <MapContainer center={[dep.lat, dep.lon]} zoom={4} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={points} color="#4a7fd4" weight={2} dashArray="5, 10" opacity={0.6} />
        
        {/* Departure Marker */}
        <Marker position={[dep.lat, dep.lon]} icon={L.divIcon({ className: 'dep-dot', html: '<div style="width:10px;height:10px;background:#1a2e5a;border:2px solid white;border-radius:50%;"></div>', iconSize:[10,10]})}>
        </Marker>

        {/* Arrival Marker */}
        <Marker position={[arr.lat, arr.lon]} icon={L.divIcon({ className: 'arr-dot', html: '<div style="width:10px;height:10px;background:#e67e22;border:2px solid white;border-radius:50%;"></div>', iconSize:[10,10]})}>
        </Marker>

        {/* Moving Plane */}
        {planePos && (
          <Marker position={planePos} icon={createPlaneIcon(planeHeading)} />
        )}

        <FitBounds points={points} />
      </MapContainer>
      
      <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1000, background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: 4, fontSize: 10, color: '#555' }}>
        {live?.lat ? '📡 Live Data' : '⏱️ Estimated Position'}
      </div>
    </div>
  );
}
