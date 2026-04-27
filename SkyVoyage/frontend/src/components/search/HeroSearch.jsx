import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../services/ApiClient";

import AirportSearch from "../AirportSearch";

const TABS = ["Charter Trip", "Empty Legs", "Multi-City"];

export default function HeroSearch({ darkMode }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [tried, setTried] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [errors, setErrors] = useState([]);
  
  // State for all 5 requested fields
  const [origin, setOrigin] = useState(null);
  const [dest, setDest] = useState(null);
  const [originQ, setOriginQ] = useState("");
  const [destQ, setDestQ] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [seatClass, setSeatClass] = useState("ECONOMY");

  // Multi-city state
  const [legs, setLegs] = useState([
    { origin: null, dest: null, date: "", originQ: "", destQ: "" },
    { origin: null, dest: null, date: "", originQ: "", destQ: "" },
  ]);

  const validate = () => {
    const e = [];
    if (tab < 2) {
      if (!origin) e.push("Please select a departure hub.");
      if (!dest) e.push("Please select a destination hub.");
      if (!date) e.push("Please select a departure date.");
      if (!passengers || passengers < 1) e.push("Please select at least 1 passenger.");
      if (!seatClass) e.push("Please select a seat class.");
    } else {
      legs.forEach((l, i) => {
        if (!l.origin || !l.dest) e.push(`Leg ${i + 1}: select both hubs.`);
        if (!l.date) e.push(`Leg ${i + 1}: select departure date.`);
      });
    }
    return e;
  };

  useEffect(() => {
    if (tried && !resolving) setErrors(validate());
  }, [origin, dest, date, passengers, seatClass, legs, tried, resolving]);

  const submit = async () => {
    setTried(true);
    setResolving(true);
    setErrors([]);

    // Logic to auto-resolve typed airports if they weren't explicitly clicked
    let currentOrigin = origin;
    let currentDest = dest;

    if (tab < 2) {
        if (!currentOrigin && originQ.length >= 2) {
            const results = await ApiClient.searchAirports(originQ).catch(() => []);
            if (results.length > 0) {
                currentOrigin = results[0];
                setOrigin(results[0]);
            }
        }
        if (!currentDest && destQ.length >= 2) {
            const results = await ApiClient.searchAirports(destQ).catch(() => []);
            if (results.length > 0) {
                currentDest = results[0];
                setDest(results[0]);
            }
        }
    }

    setResolving(false);

    // Re-check validation with possibly resolved values
    const e = [];
    if (tab < 2) {
      if (!currentOrigin) e.push("Please select a departure hub.");
      if (!currentDest) e.push("Please select a destination hub.");
      if (!date) e.push("Please select a departure date.");
      if (!passengers || passengers < 1) e.push("Please select at least 1 passenger.");
      if (!seatClass) e.push("Please select a seat class.");
    } else {
      legs.forEach((l, i) => {
        if (!l.origin || !l.dest) e.push(`Leg ${i + 1}: select both hubs.`);
        if (!l.date) e.push(`Leg ${i + 1}: select departure date.`);
      });
    }

    setErrors(e);
    if (e.length) return;

    if (tab < 2) {
      navigate(
        `/flights?origin=${currentOrigin.code}&dest=${currentDest.code}&date=${date}&guests=${passengers}&class=${seatClass}`
      );
    } else {
      navigate(
        `/flights?mode=multi&legs=${encodeURIComponent(JSON.stringify(legs.map((l) => ({ o: l.origin?.code, d: l.dest?.code, date: l.date }))))}`
      );
    }
  };

  const updLeg = (i, k, v) =>
    setLegs((p) => p.map((l, j) => (j === i ? { ...l, [k]: v } : l)));

  const cardBg = darkMode ? "rgba(17,24,39,0.92)" : "#fff";
  const cardBdr = darkMode ? "rgba(200,168,75,0.2)" : "#e5e7eb";
  const tabBdr = darkMode ? "rgba(255,255,255,0.06)" : "#f0f0f0";
  const text = darkMode ? "#f0ece4" : "#111827";
  const muted = darkMode ? "rgba(255,255,255,0.35)" : "#9ca3af";
  const inputBg = darkMode ? "#1C2333" : "#fff";
  const inputBdr = darkMode ? "rgba(255,255,255,0.1)" : "#d1d5db";
  const btnBg = darkMode ? "#C8A84B" : "#3B3DBF";
  const btnText = darkMode ? "#0A0F1A" : "#fff";

  return (
    <div
      style={{
        background: cardBg,
        border: `1px solid ${cardBdr}`,
        borderRadius: 16,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        overflow: "hidden",
        width: "100%",
        maxWidth: 520,
      }}
    >
      {/* Tabs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          borderBottom: `1px solid ${tabBdr}`,
        }}
      >
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => {
              setTab(i);
              setTried(false);
              setErrors([]);
            }}
            style={{
              padding: "14px 0",
              fontSize: 10.5,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: tab === i ? "#C8A84B" : muted,
              borderBottom:
                tab === i ? "2px solid #C8A84B" : "2px solid transparent",
              transition: "all 0.15s",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {tab < 2 && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <AirportSearch
                label="Departure Point"
                placeholder="Select origin hub"
                value={origin}
                onChange={setOrigin}
                onQueryChange={setOriginQ}
                darkMode={darkMode}
              />
              <AirportSearch
                label="Destination Hub"
                placeholder="Discovery hub"
                value={dest}
                onChange={setDest}
                onQueryChange={setDestQ}
                darkMode={darkMode}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#C8A84B",
                    marginBottom: 6,
                    opacity: 0.8,
                  }}
                >
                  Date
                </p>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: inputBg,
                    border: `1px solid ${inputBdr}`,
                    borderRadius: 10,
                    padding: "11px 14px",
                    fontSize: 14,
                    color: text,
                    outline: "none",
                    boxSizing: "border-box",
                    colorScheme: darkMode ? "dark" : "light",
                  }}
                />
              </div>

              <div>
                <p
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#C8A84B",
                    marginBottom: 6,
                    opacity: 0.8,
                  }}
                >
                  Guests
                </p>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: inputBg,
                    border: `1px solid ${inputBdr}`,
                    borderRadius: 10,
                    padding: "11px 14px",
                    fontSize: 14,
                    color: text,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <p
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#C8A84B",
                    marginBottom: 6,
                    opacity: 0.8,
                  }}
                >
                  Class
                </p>
                <select
                  value={seatClass}
                  onChange={(e) => setSeatClass(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: inputBg,
                    border: `1px solid ${inputBdr}`,
                    borderRadius: 10,
                    padding: "11px 14px",
                    fontSize: 14,
                    color: text,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="ECONOMY">Economy</option>
                  <option value="BUSINESS">Business</option>
                  <option value="FIRST">First</option>
                </select>
              </div>
            </div>
          </>
        )}
        {tab === 2 &&
          legs.map((leg, i) => (
            <div
              key={i}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <p
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(200,168,75,0.6)",
                }}
              >
                Leg {i + 1}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <AirportSearch
                  label="Departure"
                  placeholder="Select hub"
                  value={leg.origin}
                  onChange={(v) => updLeg(i, "origin", v)}
                  onQueryChange={(v) => updLeg(i, "originQ", v)}
                  darkMode={darkMode}
                />
                <AirportSearch
                  label="Arrival"
                  placeholder="Select hub"
                  value={leg.dest}
                  onChange={(v) => updLeg(i, "dest", v)}
                  onQueryChange={(v) => updLeg(i, "destQ", v)}
                  darkMode={darkMode}
                />
              </div>
              <div>
                <input
                  type="date"
                  value={leg.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => updLeg(i, "date", e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: inputBg,
                    border: `1px solid ${inputBdr}`,
                    borderRadius: 10,
                    padding: "11px 14px",
                    fontSize: 14,
                    color: text,
                    outline: "none",
                    boxSizing: "border-box",
                    colorScheme: darkMode ? "dark" : "light",
                  }}
                />
              </div>
            </div>
          ))}
        {(tried || resolving) &&
          errors.map((err, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 10,
                background: "#ef4444",
                color: "#fff",
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              ⚠ {err}
            </div>
          ))}
        <button
          onClick={submit}
          disabled={resolving}
          style={{
            width: "100%",
            padding: "16px 0",
            background: resolving ? "#9ca3af" : btnBg,
            color: resolving ? "#fff" : btnText,
            borderRadius: 10,
            border: "none",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: resolving ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = resolving ? "1" : "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {resolving ? "Resolving Mission..." : "Search Celestial Routes"}
          {!resolving && (
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
            >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
