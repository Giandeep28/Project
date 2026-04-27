import React from 'react';

export default function FlightHistoryTable({ history }) {
  if (!history || history.length === 0) return null;

  const thStyle = { 
    padding: "10px 16px", textAlign: "left", fontSize: 13, color: "#4a7fd4",
    fontWeight: 600, borderBottom: "1px solid #ddd", backgroundColor: "white" 
  };
  
  const tdStyle = { 
    padding: "10px 16px", fontSize: 13, color: "#333", borderBottom: "1px solid #eee",
    verticalAlign: "top" 
  };

  const getHistoryRowData = (row) => {
    // Map the AviationStack object format to the requested table format
    const dDate = new Date(row.departure?.scheduled || row.date);
    const dTimeStr = dDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(' ', '');
    const aDate = new Date(row.arrival?.scheduled || row.date);
    const aTimeStr = aDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(' ', '');
    
    // Check if it's today
    const todayStr = new Date().toISOString().split('T')[0];
    const is_today = dDate.toISOString().split('T')[0] === todayStr;

    return {
      date: dDate,
      is_today,
      departure_time: dTimeStr,
      from_city: row.departure?.city || 'Unknown',
      from_iata: row.departure?.iata || '???',
      arrival_time: aTimeStr,
      to_city: row.arrival?.city || 'Unknown',
      to_iata: row.arrival?.iata || '???',
      aircraft: row.aircraft?.type || 'Unknown',
      duration_minutes: row.duration_minutes || 0
    };
  };

  return (
    <div style={{ marginTop: 24 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "white",
                      border: "1px solid #ddd", borderRadius: 4, overflow: "hidden" }}>
        <thead>
          <tr style={{ background: "white" }}>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Departure</th>
            <th style={thStyle}>Arrival</th>
            <th style={thStyle}>Aircraft</th>
            <th style={thStyle}>Duration</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, i) => {
            const row = getHistoryRowData(h);
            return (
              <tr key={i} style={{ backgroundColor: row.is_today ? "#fef9c3" : i % 2 === 0 ? "white" : "#f9f9f9" }}>
                <td style={tdStyle}>
                  <div style={{ fontWeight: row.is_today ? 700 : 400, color: "#333" }}>
                    {row.date.toLocaleDateString("en-US", { weekday: "long" })}
                  </div>
                  <div style={{ color: "#555", fontSize: 13 }}>
                    {row.date.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }).replace(/ /g,"-")}
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 600 }}>{row.departure_time}</div>
                  <div>{row.from_city} - <a href="#" style={{ color: "#4a7fd4", textDecoration: "none" }}>{row.from_iata}</a></div>
                </td>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 600 }}>{row.arrival_time}</div>
                  <div>{row.to_city} - <a href="#" style={{ color: "#4a7fd4", textDecoration: "none" }}>{row.to_iata}</a></div>
                </td>
                <td style={tdStyle}>{row.aircraft}</td>
                <td style={tdStyle}>{Math.floor(row.duration_minutes/60)}h {row.duration_minutes%60}m</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
