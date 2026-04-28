import React from 'react';
import FlightRouteMap from './FlightRouteMap';

const formatDelay = (minutes) => {
  if (!minutes || minutes <= 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h} hour${h>1?"s":""} ${m} minute${m>1?"s":""}`;
  if (h > 0) return `${h} hour${h>1?"s":""}`;
  return `${m} minute${m>1?"s":""}`;
};

const formatDuration = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

const formatDateTime = (isoString, timezone) => {
  if (!isoString) return { time: "--:--", tz: "", date: "" };
  try {
    const d = new Date(isoString);
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone || 'UTC',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone || 'UTC',
      weekday: 'long', day: '2-digit', month: 'short', year: 'numeric'
    });
    
    let tzCode = timezone;
    const tzMap = {
      "Asia/Kolkata": "IST", "Australia/Sydney": "AEST",
      "Europe/London": "GMT", "America/New_York": "EST",
      "Asia/Dubai": "GST", "Asia/Singapore": "SGT"
    };
    if (tzMap[timezone]) tzCode = tzMap[timezone];
    
    return {
      time: timeFormatter.format(d).replace(' ', ''),
      tz: tzCode ? tzCode.split('/').pop().toUpperCase() : '',
      date: dateFormatter.format(d).toUpperCase().replace(/,/g, '')
    };
  } catch(e) {
    return { time: "--:--", tz: "", date: isoString };
  }
};

const calculateProgress = (flight) => {
  if (flight.status === 'LANDED') return 100;
  if (flight.status !== 'IN_AIR') return 0;
  const start = new Date(flight.departure?.actual || flight.departure?.scheduled).getTime();
  const end = new Date(flight.arrival?.actual || flight.arrival?.scheduled).getTime();
  const now = Date.now();
  const progress = ((now - start) / (end - start)) * 100;
  return Math.min(100, Math.max(0, Math.round(progress)));
};

export default function FlightStatusCard({ flight, compact = false }) {
  if (!flight) return null;

  const STATUS_CONFIG = {
    LANDED:    { bg: "#27ae60", textColor: "white", label: () => "ARRIVED" },
    IN_AIR:    { bg: "#1a5276", textColor: "white", label: () => flight.arrival?.delay_minutes > 0 ? `LATE` : "ON TIME" },
    DELAYED:   { bg: "#e67e22", textColor: "white", label: () => `DELAYED` },
    CANCELLED: { bg: "#c0392b", textColor: "white", label: () => "CANCELLED" },
    SCHEDULED: { bg: "#7f8c8d", textColor: "white", label: () => "SCHEDULED" },
    DIVERTED:  { bg: "#8e44ad", textColor: "white", label: () => "DIVERTED" }
  };

  const statusObj = STATUS_CONFIG[flight.status] || STATUS_CONFIG.SCHEDULED;
  const progress = calculateProgress(flight);

  return (
    <div style={{ background: "white", border: "1px solid #ddd", borderRadius: 8, overflow: 'hidden',
                  padding: 0, marginBottom: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>

      {/* Header Info */}
      <div style={{ padding: compact ? "12px 16px" : "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontSize: compact ? 18 : 24, fontWeight: 800, color: "#1a2e5a", margin: 0 }}>
              {flight.airline?.name} {flight.flight_number}
            </h2>
            <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
              {flight.callsign} • {flight.aircraft?.type || 'Unknown Aircraft'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{
              display: "inline-block",
              backgroundColor: statusObj.bg,
              color: statusObj.textColor,
              fontWeight: 700, fontSize: 12, textTransform: 'uppercase',
              padding: "4px 10px", borderRadius: 4
            }}>
              {statusObj.label()}
            </span>
            {flight.status === "IN_AIR" && (
              <div style={{ fontSize: 10, color: "#4a7fd4", marginTop: 4, fontWeight: 700 }}>
                📡 LIVE TRACKING
              </div>
            )}
          </div>
        </div>

        {/* Delay Reason Alert */}
        {flight.delay_reason && (
          <div style={{ marginTop: 12, padding: '8px 12px', background: '#fff3cd', color: '#856404', borderRadius: 4, fontSize: 12, border: '1px solid #ffeeba' }}>
            ⚠️ <strong>Delay Note:</strong> {flight.delay_reason}
          </div>
        )}
      </div>

      {/* Map Section */}
      {!compact && <FlightRouteMap flight={flight} />}

      {/* Route Timeline */}
      <div style={{ padding: "24px", background: '#fcfcfc' }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 16, alignItems: "start" }}>
          {/* Departure */}
          <div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#1a2e5a" }}>{flight.departure?.iata}</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#333" }}>{flight.departure?.city}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
              {flight.departure?.terminal ? `Terminal ${flight.departure.terminal}` : ''}
              {flight.departure?.gate ? ` · Gate ${flight.departure.gate}` : ''}
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#1a2e5a" }}>
                {formatDateTime(flight.departure?.actual || flight.departure?.scheduled, flight.departure?.timezone)?.time}
              </div>
              <div style={{ fontSize: 11, color: "#888" }}>
                {formatDateTime(flight.departure?.scheduled, flight.departure?.timezone)?.date}
              </div>
            </div>
          </div>

          {/* Progress Center */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10 }}>
            <div style={{ width: '100%', height: 4, background: '#eee', borderRadius: 2, position: 'relative', marginBottom: 8 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress}%`, background: '#4a7fd4', borderRadius: 2, transition: 'width 1s ease' }}></div>
              <div style={{ position: 'absolute', left: `${progress}%`, top: -4, transform: 'translateX(-50%)', fontSize: 14 }}>✈️</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#4a7fd4' }}>{progress}% COMPLETED</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{formatDuration(flight.duration_minutes || 0)} Travel Time</div>
          </div>

          {/* Arrival */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#1a2e5a" }}>{flight.arrival?.iata}</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#333" }}>{flight.arrival?.city}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
              {flight.arrival?.terminal ? `Terminal ${flight.arrival.terminal}` : ''}
              {flight.arrival?.gate ? ` · Gate ${flight.arrival.gate}` : ''}
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#1a2e5a" }}>
                {formatDateTime(flight.arrival?.actual || flight.arrival?.scheduled, flight.arrival?.timezone)?.time}
              </div>
              <div style={{ fontSize: 11, color: "#888" }}>
                {formatDateTime(flight.arrival?.scheduled, flight.arrival?.timezone)?.date}
              </div>
            </div>
          </div>
        </div>

        {/* Altitude / Speed Grid */}
        {flight.status === 'IN_AIR' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 24, paddingTop: 16, borderTop: '1px solid #eee', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Altitude</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1a2e5a' }}>{flight.live?.altitude_ft ? Math.round(flight.live.altitude_ft).toLocaleString() + ' ft' : '---'}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Speed</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1a2e5a' }}>{flight.live?.speed_kmh ? Math.round(flight.live.speed_kmh) + ' km/h' : '---'}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Aircraft</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1a2e5a' }}>{flight.aircraft?.registration || 'N/A'}</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '8px 24px', background: '#f5f5f5', fontSize: 11, color: '#aaa', display: 'flex', justifyContent: 'space-between' }}>
        <span>SkyVoyage Real-time Tracking Engine v2.0</span>
        {flight.data_source === "mock" && <span>Simulated data for demo</span>}
      </div>
    </div>
  );
}
