import React from 'react';

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
    
    // Map standard IANA timezones to short codes if possible
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

const timeSinceLanding = (isoArrivalActual) => {
  if (!isoArrivalActual) return "";
  const diff = Date.now() - new Date(isoArrivalActual).getTime();
  if (diff < 0) return "";
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hours} HOURS ${mins} MINUTES AGO`;
};

const DottedArcSVG = () => (
  <svg width="60" height="55" viewBox="0 0 60 55" style={{ marginTop: 6 }}>
    {/* Row 1 (top, 2 dots): x=[38,46], y=6 */}
    <circle cx="38" cy="6" r="3" fill="#4a6fa5" />
    <circle cx="46" cy="6" r="3" fill="#4a6fa5" />
    
    {/* Row 2 (3 dots): x=[28,36,44], y=16 */}
    <circle cx="28" cy="16" r="3" fill="#4a6fa5" />
    <circle cx="36" cy="16" r="3" fill="#4a6fa5" />
    <circle cx="44" cy="16" r="3" fill="#4a6fa5" />
    
    {/* Row 3 (4 dots): x=[16,24,32,40], y=26 */}
    <circle cx="16" cy="26" r="3" fill="#4a6fa5" />
    <circle cx="24" cy="26" r="3" fill="#4a6fa5" />
    <circle cx="32" cy="26" r="3" fill="#4a6fa5" />
    <circle cx="40" cy="26" r="3" fill="#4a6fa5" />
    
    {/* Row 4 (5 dots): x=[6,14,22,30,38], y=36 */}
    <circle cx="6" cy="36" r="3" fill="#4a6fa5" />
    <circle cx="14" cy="36" r="3" fill="#4a6fa5" />
    <circle cx="22" cy="36" r="3" fill="#4a6fa5" />
    <circle cx="30" cy="36" r="3" fill="#4a6fa5" />
    <circle cx="38" cy="36" r="3" fill="#4a6fa5" />
    
    {/* Row 5 (bottom, 6 dots): x=[2,10,18,26,34,42], y=46 */}
    <circle cx="2" cy="46" r="3" fill="#4a6fa5" />
    <circle cx="10" cy="46" r="3" fill="#4a6fa5" />
    <circle cx="18" cy="46" r="3" fill="#4a6fa5" />
    <circle cx="26" cy="46" r="3" fill="#4a6fa5" />
    <circle cx="34" cy="46" r="3" fill="#4a6fa5" />
    <circle cx="42" cy="46" r="3" fill="#4a6fa5" />

    <text x="42" y="16" fontSize="20" fill="#4a6fa5" style={{ transform: "rotate(45deg)", transformOrigin: "42px 16px" }}>✈</text>
  </svg>
);

export default function FlightStatusCard({ flight, compact = false }) {
  if (!flight) return null;

  const STATUS_CONFIG = {
    LANDED:    { bg: "transparent", textColor: "#8B4513", label: () => `ARRIVED ${timeSinceLanding(flight.arrival?.actual)}` },
    IN_AIR:    { bg: "#1a5276",     textColor: "white",   label: () => flight.arrival?.delay_minutes > 0 ? `IN AIR — ${formatDelay(flight.arrival.delay_minutes)} LATE` : "IN AIR — ON TIME" },
    DELAYED:   { bg: "#e67e22",     textColor: "white",   label: () => `DELAYED — ${formatDelay(flight.departure?.delay_minutes)}` },
    CANCELLED: { bg: "#c0392b",     textColor: "white",   label: () => "CANCELLED" },
    SCHEDULED: { bg: "#7f8c8d",     textColor: "white",   label: () => "SCHEDULED" },
    DIVERTED:  { bg: "#8e44ad",     textColor: "white",   label: () => "DIVERTED" }
  };

  const statusObj = STATUS_CONFIG[flight.status] || STATUS_CONFIG.SCHEDULED;

  return (
    <div style={{ background: "white", border: "1px solid #ddd", borderRadius: 4,
                  padding: compact ? "12px 16px" : "20px 24px", marginBottom: 16 }}>

      {/* ── SECTION A: Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: compact ? 0 : 20 }}>
        {/* Dotted arc SVG — only show if !compact */}
        {!compact && <DottedArcSVG />}

        <div style={{ flex: 1 }}>
          {/* Flight name */}
          <h2 style={{ fontSize: compact ? 18 : 26, fontWeight: 700, color: "#1a2e5a", margin: 0 }}>
            {flight.airline?.name} {(flight.flight_number || "").replace(flight.airline?.iata || "", "")}
          </h2>
          {/* ICAO / IATA codes */}
          <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
            {flight.callsign} / {flight.flight_number}
            {/* Only show "Upgrade account" note in mock mode */}
            {flight.aircraft?.registration === "UNKNOWN" && (
              <span style={{ marginLeft: 8, fontSize: 11, color: "#aaa" }}>
                (registration unavailable in demo mode)
              </span>
            )}
          </div>

          {/* Status badge */}
          <div style={{ marginTop: 8 }}>
            <span style={{
              display: "inline-block",
              backgroundColor: statusObj.bg,
              color: statusObj.textColor,
              fontWeight: 700, fontSize: compact ? 11 : 14, letterSpacing: 0.5,
              padding: statusObj.bg !== "transparent" ? "4px 8px" : "2px 0", 
              borderRadius: 2
            }}>
              {statusObj.label() || flight.status}
            </span>
            {/* Gate info */}
            {flight.arrival?.gate && (
              <div style={{ fontSize: 13, color: "#4a7fd4", marginTop: 4 }}>
                Gate {flight.arrival.gate}
              </div>
            )}
            {/* Codeshare / Operating as */}
            {flight.codeshare && (
              <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
                Operating as <a href="#" style={{ color: "#4a7fd4", fontWeight: 600 }}>{flight.codeshare}</a>
              </div>
            )}
          </div>
        </div>

        {/* Auto-refresh badge — top right */}
        {flight.status === "IN_AIR" && (
          <div style={{ fontSize: 11, color: "#4a7fd4", flexShrink: 0 }}>
            🔄 Auto-refreshing
          </div>
        )}
      </div>

      {/* ── SECTION B: Route Timeline ── */}
      {!compact && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "start" }}>

          {/* LEFT — Departure */}
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#1a2e5a" }}>
              {flight.departure?.iata}
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#333", textTransform: "uppercase" }}>
              {flight.departure?.city?.toUpperCase()}, {flight.departure?.country?.toUpperCase()}
            </div>
            {flight.departure?.gate && (
              <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
                left GATE {flight.departure.gate}
              </div>
            )}
            <a href="#" style={{ fontSize: 12, color: "#4a7fd4", display: "block", marginTop: 2 }}>
              {flight.departure?.city} - {flight.departure?.iata}
            </a>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#333", letterSpacing: 0.3 }}>
                {formatDateTime(flight.departure?.scheduled, flight.departure?.timezone)?.date}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a2e5a", marginTop: 2 }}>
                {formatDateTime(flight.departure?.actual || flight.departure?.scheduled, flight.departure?.timezone)?.time}{" "}
                {formatDateTime(flight.departure?.actual || flight.departure?.scheduled, flight.departure?.timezone)?.tz}
              </div>
              {flight.departure?.delay_minutes > 0 && (
                <div style={{ fontSize: 13, color: "#e67e22", marginTop: 2 }}>
                  ({formatDelay(flight.departure.delay_minutes)} late)
                </div>
              )}
            </div>
          </div>

          {/* CENTER — Timeline dots + line */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
                        paddingTop: 60, minWidth: 100 }}>
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#e67e22", flexShrink: 0 }} />
              <div style={{ flex: 1, height: 3, backgroundColor: "#27ae60" }} />
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#e67e22", flexShrink: 0 }} />
            </div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 6, textAlign: "center", fontWeight: 600 }}>
              {formatDuration(flight.duration_minutes || 0)} total travel time
            </div>
          </div>

          {/* RIGHT — Arrival (mirrored, right-aligned) */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#1a2e5a" }}>
              {flight.arrival?.iata}
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#333", textTransform: "uppercase" }}>
              {flight.arrival?.city?.toUpperCase()}, {flight.arrival?.country?.toUpperCase()}
            </div>
            {flight.arrival?.gate && (
              <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
                arrived at GATE {flight.arrival.gate}
              </div>
            )}
            <a href="#" style={{ fontSize: 12, color: "#4a7fd4", display: "block", marginTop: 2 }}>
              {flight.arrival?.city} - {flight.arrival?.iata}
            </a>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#333", letterSpacing: 0.3, textAlign: "right" }}>
                {formatDateTime(flight.arrival?.scheduled, flight.arrival?.timezone)?.date}
              </div>
              {flight.arrival?.delay_minutes > 0 && (
                <div style={{ fontSize: 13, color: "#e67e22", marginTop: 2 }}>
                  ({formatDelay(flight.arrival.delay_minutes)} late)
                </div>
              )}
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a2e5a", marginTop: 2 }}>
                {formatDateTime(flight.arrival?.actual || flight.arrival?.scheduled, flight.arrival?.timezone)?.time}{" "}
                {formatDateTime(flight.arrival?.actual || flight.arrival?.scheduled, flight.arrival?.timezone)?.tz}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION C: Aircraft info + warnings ── */}
      <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid #eee",
                    fontSize: 12, color: "#777", display: "flex", justifyContent: "space-between" }}>
        <span>
          {flight.aircraft?.type && `Aircraft: ${flight.aircraft.type}`}
          {flight.aircraft?.registration && flight.aircraft.registration !== "UNKNOWN"
            ? ` · Reg: ${flight.aircraft.registration}` : ""}
        </span>
        {flight.data_source === "mock" && (
          <span style={{ background: "#fff3cd", color: "#856404", padding: "2px 8px", borderRadius: 3, fontSize: 11 }}>
            ⚠ Demo data — configure AVIATIONSTACK_API_KEY for live status
          </span>
        )}
      </div>

    </div>
  );
}
