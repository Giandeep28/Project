import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ApiClient from '../services/ApiClient';
import FilterSidebar from '../components/flights/FilterSidebar';
import FlightCard from '../components/flights/FlightCard';

const SORT_OPTIONS = [
  { key: 'cheapest', label: 'Cheapest',   desc: 'Lowest price first',   fn: (a, b) => a.price - b.price },
  { key: 'fastest',  label: 'Fastest',    desc: 'Shortest travel time', fn: (a, b) => a.duration - b.duration },
  { key: 'bestScore',label: 'Best Score', desc: 'Price & time balanced',fn: (a, b) => b.score - a.score },
];

function Skeleton({ darkMode }) {
  const bg = darkMode ? '#1C2333' : '#fff';
  const sh = darkMode ? 'rgba(255,255,255,0.06)' : '#f3f4f6';
  return (
    <div style={{ background: bg, border: `1px solid ${sh}`, borderRadius: 14, padding: 20 }}>
      {[100, 60, 80].map((w, i) => (
        <div key={i} style={{ height: i === 0 ? 24 : 14, width: `${w}%`, background: sh, borderRadius: 6, marginBottom: 12, animation: 'pulse 1.5s ease-in-out infinite', opacity: 0.6 }} />
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:0.6}50%{opacity:0.3}}`}</style>
    </div>
  );
}

export default function SearchResults({ darkMode }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const origin = params.get('origin') || '';
  const dest = params.get('dest') || '';
  const date = params.get('date') || '';
  const guests = params.get('guests') || '1';
  const mode = params.get('mode') || 'charter';

  // ── FIX 4: State Architecture ─────────────────────────────────────────────
  const [allFlights, setAllFlights] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('cheapest');
  const [filters, setFilters] = useState({
    stops: [],
    maxPrice: 50000,
    airlines: []
  });

  const [selectedId, setSelectedId] = useState(null);

  // Derived
  const allAirlines = useMemo(() => [...new Set(allFlights.map(f => f.airline))].sort(), [allFlights]);

  // ── Fetch Data ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!origin || !dest) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    ApiClient.searchFlights({ origin, dest, date, guests, mode })
      .then(d => {
        const data = (d && Array.isArray(d.flights)) ? d.flights : [];
        setAllFlights(data);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load flights.');
        setAllFlights([]);
      })
      .finally(() => setLoading(false));
  }, [origin, dest, date, guests, mode]);

  // ── Pure Filtering Logic ──────────────────────────────────────────────────
  const applyFiltersAndSort = useCallback(() => {
    if (!allFlights.length) {
      setFlights([]);
      return;
    }

    let filtered = allFlights.filter(f => {
      // 1. Stops
      if (filters.stops.length > 0) {
        let ok = false;
        if (filters.stops.includes('0') && f.stops === 0) ok = true;
        if (filters.stops.includes('1') && f.stops === 1) ok = true;
        if (filters.stops.includes('2+') && f.stops >= 2) ok = true;
        if (!ok) return false;
      }
      // 2. Price
      if (f.price > filters.maxPrice) return false;
      // 3. Airlines
      if (filters.airlines.length > 0 && !filters.airlines.includes(f.airline)) return false;
      
      return true;
    });

    // Sort
    const sortDef = SORT_OPTIONS.find(s => s.key === activeTab) || SORT_OPTIONS[0];
    filtered.sort(sortDef.fn);

    setFlights(filtered);
  }, [allFlights, filters, activeTab]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  // ── Theme ─────────────────────────────────────────────────────────────────
  const pageBg = darkMode ? '#0A0F1A' : '#f1f3f5';
  const text = darkMode ? '#f0ece4' : '#111827';
  const muted = darkMode ? 'rgba(255,255,255,0.4)' : '#6b7280';
  const tabBg = darkMode ? '#1C2333' : '#fff';
  const tabBdr = darkMode ? 'rgba(255,255,255,0.06)' : '#e5e7eb';
  const accent = '#C8A84B';

  return (
    <div style={{ background: pageBg, minHeight: '100vh', paddingTop: 80 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 32, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: text, marginBottom: 6 }}>
            {origin && dest ? `${origin} → ${dest}` : 'Select Departure Flight'}
          </h1>
          <p style={{ fontSize: 14, color: muted }}>
            {loading ? 'Searching live routes…' : error ? 'Error loading flights' : `Showing ${flights.length} of ${allFlights.length} flights`}
          </p>
        </div>

        {error && (
          <div style={{ background: '#ef4444', color: '#fff', padding: 16, borderRadius: 12, marginBottom: 20 }}>
            ⚠ {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {/* We replace the old FilterSidebar calls with a simpler inline/prop one that actually works with our state */}
          <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: tabBg, border: `1px solid ${tabBdr}`, borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: text, marginBottom: 16 }}>Stops</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['0', '1', '2+'].map(lbl => (
                  <label key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: text, fontSize: 14 }}>
                    <input type="checkbox" checked={filters.stops.includes(lbl)} 
                      onChange={(e) => {
                        setFilters(curr => ({
                          ...curr,
                          stops: e.target.checked ? [...curr.stops, lbl] : curr.stops.filter(s => s !== lbl)
                        }));
                      }} 
                    />
                    {lbl === '0' ? 'Non-stop' : `${lbl} Stop(s)`}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ background: tabBg, border: `1px solid ${tabBdr}`, borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: text, marginBottom: 16 }}>
                Max Price: ₹{filters.maxPrice.toLocaleString('en-IN')}
              </h3>
              <input type="range" min="3000" max="50000" step="500" value={filters.maxPrice}
                onChange={(e) => setFilters(curr => ({ ...curr, maxPrice: parseInt(e.target.value) }))}
                style={{ width: '100%', accentColor: accent }}
              />
            </div>

            <div style={{ background: tabBg, border: `1px solid ${tabBdr}`, borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: text, marginBottom: 16 }}>Airlines</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {allAirlines.map(aln => (
                  <label key={aln} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: text, fontSize: 14 }}>
                    <input type="checkbox" checked={filters.airlines.includes(aln)} 
                      onChange={(e) => {
                        setFilters(curr => ({
                          ...curr,
                          airlines: e.target.checked ? [...curr.airlines, aln] : curr.airlines.filter(a => a !== aln)
                        }));
                      }} 
                    />
                    {aln}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Sort tabs */}
            <div style={{ background: tabBg, border: `1px solid ${tabBdr}`, borderRadius: 12, overflow: 'hidden', marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
              {SORT_OPTIONS.map(({ key, label, desc }) => {
                const active = activeTab === key;
                return (
                  <button key={key} onClick={() => setActiveTab(key)} 
                    style={{ padding: '16px 20px', border: 'none', cursor: 'pointer', background: 'transparent',
                             borderBottom: `3px solid ${active ? accent : 'transparent'}`,
                             borderRight: `1px solid ${tabBdr}`, transition: 'all 0.15s' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: active ? accent : muted, marginBottom: 4 }}>
                      {label}
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 500, color: muted }}>{desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {loading ? Array.from({ length: 4 }, (_, i) => <Skeleton key={i} darkMode={darkMode} />)
                : flights.length === 0
                  ? <div style={{ textAlign: 'center', padding: '60px 20px', background: tabBg, borderRadius: 14, border: `1px solid ${tabBdr}` }}>
                    <p style={{ fontSize: 32 }}>✈️</p>
                    <p style={{ fontSize: 16, fontWeight: 600, color: text, marginTop: 12 }}>No flights found</p>
                    <p style={{ fontSize: 13, color: muted, marginTop: 6 }}>Try adjusting your filters.</p>
                  </div>
                  : flights.map(f => (
                    <div key={f.id} onClick={() => setSelectedId(f.id)}>
                      {/* For simplicity we inline the requested card info explicitly matching the JSON map */}
                      <div style={{ background: tabBg, border: `1px solid ${selectedId === f.id ? accent : tabBdr}`, borderRadius: 12, padding: 20, cursor: 'pointer', transition: '0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 48, height: 48, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
                              <img src={f.airlineLogo} alt={f.airline} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            </div>
                            <div>
                              <p style={{ fontSize: 18, fontWeight: 700, color: text }}>{f.airline}</p>
                              <p style={{ fontSize: 12, color: muted }}>{f.flightNumber} • {f.seatClass}</p>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: 24, fontWeight: 800, color: text }}>₹{f.price.toLocaleString('en-IN')}</p>
                            <p style={{ fontSize: 12, color: '#10b981' }}>{f.seatsAvailable} seats left</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ textAlign: 'left' }}>
                            <p style={{ fontSize: 20, fontWeight: 700, color: text }}>
                               {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date(f.departureTime))}
                            </p>
                            <p style={{ fontSize: 12, color: muted, fontWeight: 600 }}>{f.origin}</p>
                          </div>
                          <div style={{ flex: 1, margin: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p style={{ fontSize: 11, color: muted }}>
                              {Math.floor(f.duration / 60)}h {f.duration % 60}m • {f.stops === 0 ? 'Non-stop' : `${f.stops} stop(s)`}
                            </p>
                            <div style={{ width: '100%', height: 1, background: tabBdr, marginTop: 6, position: 'relative' }}>
                                <div style={{ position: 'absolute', top: -3, right: -4, fontSize: 10, color: accent }}>✈</div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: 20, fontWeight: 700, color: text }}>
                               {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date(f.arrivalTime))}
                            </p>
                            <p style={{ fontSize: 12, color: muted, fontWeight: 600 }}>{f.destination}</p>
                          </div>
                        </div>
                        
                        {selectedId === f.id && (
                          <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${tabBdr}`, textAlign: 'right', animation: 'fadeIn 0.2s ease' }}>
                             <button onClick={(e) => { e.stopPropagation(); navigate('/booking', { state: { flight: f } }); }}
                                style={{ padding: '12px 24px', background: accent, color: '#000', border: 'none', borderRadius: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', transition: '0.2s' }}
                             >
                                Proceed to Booking →
                             </button>
                          </div>
                        )}
                        
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
