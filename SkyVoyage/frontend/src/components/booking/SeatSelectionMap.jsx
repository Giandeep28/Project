import React, { useState, useEffect } from 'react';
import PriceDisplay from '../shared/PriceDisplay';
import useCurrency from '../../context/useCurrency';


// Generates the initial layout of seats based on aircraft type.
const generateMockGrid = () => {
  const layout = [];
  // First Class (Rows 1-2) - 2x2. Colors: Gold (#cfb056)
  for (let r = 1; r <= 2; r++) {
    layout.push(
      ['A', 'K'].map(s => ({ id: `${r}${s}`, label: `${r}${s}`, type: 'First Class', color: '#cfb056', price: 5500, row: r, occupied: Math.random() > 0.8, premium: true }))
    );
  }
  // Business (Rows 4-7) - 2-2-2. Colors: Blue (#19347d)
  for (let r = 4; r <= 7; r++) {
    layout.push(
      ['A', 'C', 'D', 'F', 'H', 'K'].map(s => ({ id: `${r}${s}`, label: `${r}${s}`, type: 'Business Class', color: '#19347d', price: 2100, row: r, occupied: Math.random() > 0.6, premium: false }))
    );
  }
  // Premium Economy (Rows 10-12) - 2-3-2. Colors: Purple (#6B21A8)
  for (let r = 10; r <= 12; r++) {
    layout.push(
      ['A', 'C', 'D', 'E', 'F', 'H', 'K'].map(s => ({ id: `${r}${s}`, label: `${r}${s}`, type: 'Premium Economy', color: '#6B21A8', price: 1200, row: r, occupied: Math.random() > 0.7, premium: false }))
    );
  }
  // Economy (Rows 15-20) - 3-3-3. Colors: Teal/Green (#0f766e)
  for (let r = 15; r <= 20; r++) {
    layout.push(
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K'].map(s => ({ id: `${r}${s}`, label: `${r}${s}`, type: 'Economy', color: '#0f766e', price: 450, row: r, occupied: Math.random() > 0.7, premium: false }))
    );
  }
  // Standard Economy (Rows 21-25) - 3-3-3. Colors: Pale Green (#5b7b6c)
  for (let r = 21; r <= 25; r++) {
    layout.push(
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K'].map(s => ({ id: `${r}${s}`, label: `${r}${s}`, type: 'Free/Standard', color: '#5b7b6c', price: 0, row: r, occupied: Math.random() > 0.5, premium: false }))
    );
  }
  return layout;
};

export default function SeatSelectionMap({ flight, passengers, onConfirm, onBack }) {
  const { rates, convert } = useCurrency();
  const [grid] = useState(generateMockGrid());
  // Object mapping passengerIndex -> seatData
  const [selectedSeats, setSelectedSeats] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);

  // Derive initial mapping if empty
  useEffect(() => {
    setActiveIndex(passengers.findIndex((_, i) => !selectedSeats[i]) === -1 ? 0 : passengers.findIndex((_, i) => !selectedSeats[i]));
  }, [passengers, selectedSeats]);

  const handleSeatClick = (seat) => {
    if (seat.occupied) return; // Blocked

    // If seat is already picked by someone else, ignore or swap (ignore for simplicity)
    const alreadyPickedBy = Object.keys(selectedSeats).find(k => selectedSeats[k].id === seat.id);
    if (alreadyPickedBy && parseInt(alreadyPickedBy) !== activeIndex) return;

    setSelectedSeats(prev => {
      const next = { ...prev };
      // If clicking same seat for current active user, deselect it
      if (next[activeIndex]?.id === seat.id) {
        delete next[activeIndex];
      } else {
        next[activeIndex] = seat;
      }
      return next;
    });

    // Auto advance if clicking a new seat
    if (selectedSeats[activeIndex]?.id !== seat.id) {
       const nextNeeded = passengers.findIndex((_, i) => i !== activeIndex && !selectedSeats[i]);
       if (nextNeeded !== -1) setActiveIndex(nextNeeded);
    }
  };

  const currentSeat = selectedSeats[activeIndex] || null;

  const totalAddedCosts = Object.values(selectedSeats).reduce((acc, curr) => acc + curr.price, 0);

  const bgGradient = 'radial-gradient(ellipse at top, #0c1424, #000000)';
  const gold = '#C8A84B';

  return (
    <div style={{ background: bgGradient, minHeight: '100vh', width: '100%', color: '#fff', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(200,168,75,0.2)' }}>
        <button onClick={onBack} style={{ position: 'absolute', left: 24, background: 'transparent', border: 'none', color: gold, fontSize: 24, cursor: 'pointer' }}>←</button>
        <div style={{ display: 'flex', gap: 24, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Flight <span style={{color: gold}}>{'>'}</span></span>
          <span style={{ color: '#000', background: gold, padding: '4px 20px', borderRadius: 20 }}>Seats</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}><span style={{color: gold}}>{'>'}</span> Add-ons</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}><span style={{color: gold}}>{'>'}</span> Payment</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '300px 1fr 340px' }}>
        
        {/* Left Column ========================== */}
        <div style={{ background: 'rgba(0,0,0,0.6)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: 32 }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', color: gold, fontSize: 32, marginBottom: 24 }}>SkyVoyage</h1>
          
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Flight {flight.flightNumber}</p>
            <p style={{ fontSize: 13, marginBottom: 8, opacity: 0.8 }}>{flight.origin} to {flight.destination}</p>
            <p style={{ fontSize: 13, marginBottom: 8, opacity: 0.8 }}>Departing: {new Date(flight.departureTime).toLocaleString('en-US', {month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</p>
            <p style={{ fontSize: 13, marginBottom: 8, opacity: 0.8 }}>Aircraft: Boeing 787 Dreamliner</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {passengers.map((p, i) => {
               const isActive = activeIndex === i;
               const hasSeat = selectedSeats[i];
               return (
                 <div key={i} onClick={() => setActiveIndex(i)} style={{ border: `1px solid ${isActive ? gold : 'rgba(255,255,255,0.2)'}`, background: isActive ? 'rgba(200,168,75,0.1)' : 'transparent', padding: '16px 20px', borderRadius: 12, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.2s' }}>
                    <span style={{ fontSize: 14 }}>Passenger {i + 1}: {p.name || 'Anonymous'}</span>
                    {hasSeat ? (
                      <span style={{ color: gold, fontWeight: 700 }}>{hasSeat.label}</span>
                    ) : (
                      <span style={{ fontSize: 12, opacity: 0.5 }}>Select Seat</span>
                    )}
                 </div>
               )
            })}
          </div>
        </div>

        {/* Center Grid (Plane Map) ============== */}
        <div style={{ position: 'relative', overflow: 'auto', background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAuSURBVChTY3gro/qPgQyg5FIfg/7///8zIBNgglhwShKjEKaJUYRhGgMwaPj/HwBvA5aIf9/hHgAAAABJRU5ErkJggg==) repeat' }}>
           
           <div style={{ width: '100%', maxWidth: 460, margin: '60px auto 100px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              
              {/* Nose Graphics */}
              <svg viewBox="0 0 400 300" style={{ width: '100%', pointerEvents: 'none' }}>
                <path d="M 200,20 C 100,50 60,150 40,300 L 360,300 C 340,150 300,50 200,20 Z" fill="#1c2128" stroke={gold} strokeWidth="2" opacity="0.9"/>
                {/* Cockpit */}
                <path d="M 180,60 Q 200,30 220,60 Q 240,100 200,100 Q 160,100 180,60 Z" fill="#000" opacity="0.6"/>
              </svg>

              {/* Cabin Floor */}
              <div style={{ background: '#1c2128', width: '80%', borderLeft: `2px solid ${gold}`, borderRight: `2px solid ${gold}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingBottom: 60, marginTop: -2 }}>
                 
                 {grid.map((rowArr, rowIndex) => (
                    <div key={rowIndex} style={{ display: 'flex', justifyContent: 'center', gap: rowArr.length > 4 ? 4 : 20, width: '100%' }}>
                       {rowArr.map(seat => {
                          const isSelectedByCurrent = currentSeat?.id === seat.id;
                          const isSelectedByOther = Object.values(selectedSeats).find(s => s.id === seat.id) && !isSelectedByCurrent;
                          const isBlocked = seat.occupied || isSelectedByOther;

                          let seatBg = seat.color;
                          if (isBlocked) seatBg = '#333';
                          
                          return (
                            <div 
                              key={seat.id} 
                              onClick={() => handleSeatClick(seat)}
                              style={{ 
                                width: rowArr.length > 4 ? 30 : 42, 
                                height: rowArr.length > 4 ? 40 : 54, 
                                background: isBlocked ? 'repeating-linear-gradient(45deg, #222, #222 5px, #333 5px, #333 10px)' : `linear-gradient(to bottom, ${seatBg}, #000)`,
                                borderRadius: '8px 8px 4px 4px',
                                border: isSelectedByCurrent ? `2px solid ${gold}` : '1px solid rgba(255,255,255,0.2)',
                                boxShadow: isSelectedByCurrent ? `0 0 12px ${gold}` : 'inset 0 2px 4px rgba(255,255,255,0.3)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: isBlocked ? 'not-allowed' : 'pointer',
                                transition: '0.2s',
                                position: 'relative'
                              }}
                            >
                               {seat.premium && !isBlocked && <span style={{ position: 'absolute', top: -8, color: gold, fontSize: 10 }}>★</span>}
                               {isSelectedByCurrent && <span style={{ position: 'absolute', color: gold, fontSize: 18, zIndex: 10 }}>✓</span>}
                               {!isBlocked && <span style={{ fontSize: rowArr.length > 4 ? 9 : 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{seat.label}</span>}
                            </div>
                          )
                       })}
                    </div>
                 ))}
              </div>
           </div>

           {/* Zoom Controls Overlay */}
           <div style={{ position: 'absolute', top: 32, right: 32, background: 'rgba(0,0,0,0.6)', border: `1px solid ${gold}`, borderRadius: 8, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <button style={{ background: 'transparent', border: 'none', borderBottom: `1px solid ${gold}`, color: '#fff', fontSize: 20, padding: '12px 16px', cursor: 'pointer' }}>+</button>
              <button style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 20, padding: '12px 16px', cursor: 'pointer' }}>-</button>
           </div>
        </div>

        {/* Right Column ========================= */}
        <div style={{ padding: '60px 32px', display: 'flex', flexDirection: 'column' }}>
           <div style={{ border: `1px solid ${gold}`, borderRadius: 16, background: 'linear-gradient(135deg, rgba(200,168,75,0.1), transparent)', padding: 24, boxShadow: `0 0 20px rgba(200,168,75,0.1)` }}>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 16, marginBottom: 20 }}>Selected Seat Details</h2>
              
              {currentSeat ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ opacity: 0.7 }}>Seat:</span> <span style={{ fontWeight: 600 }}>{currentSeat.label} ({currentSeat.type})</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ opacity: 0.7 }}>Type:</span> <span style={{ fontWeight: 600, textAlign: 'right' }}>{currentSeat.premium ? 'Full Flat Bed, Window View' : 'Standard Recline'}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ opacity: 0.7 }}>Seat Price:</span> <span style={{ fontWeight: 600 }}><PriceDisplay amount={currentSeat.price} currency="INR" /></span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ opacity: 0.7 }}>Add-ons:</span> <span style={{ fontWeight: 600 }}>None</span></div>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: gold, fontSize: 16 }}><span style={{ fontWeight: 700 }}>Total Price:</span> <span style={{ fontWeight: 800 }}><PriceDisplay amount={currentSeat.price} currency="INR" /></span></div>
                </div>
              ) : (
                <div style={{ padding: '40px 0', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
                  Please select a seat from the map.
                </div>
              )}

              <button 
                onClick={() => {
                  const totalUsd = convert(totalAddedCosts, 'INR', 'USD');
                  onConfirm(selectedSeats, totalUsd);
                }} 
                disabled={passengers.length !== Object.keys(selectedSeats).length}
                style={{ width: '100%', marginTop: 32, background: `linear-gradient(to right, #cfb056, #8e7428)`, color: '#000', border: 'none', borderRadius: 8, padding: '16px 0', fontSize: 14, fontWeight: 800, cursor: passengers.length !== Object.keys(selectedSeats).length ? 'not-allowed' : 'pointer', opacity: passengers.length !== Object.keys(selectedSeats).length ? 0.5 : 1, transition: '0.2s' }}
              >
                Confirm & Continue
              </button>
           </div>
        </div>
      </div>

      {/* Legend Footer */}
      <div style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '16px 24px', display: 'flex', gap: 24, fontSize: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
        {[
          { c: '#cfb056', l: 'First Class' },
          { c: '#19347d', l: 'Business Class' },
          { c: '#6B21A8', l: 'Premium Economy' },
          { c: '#0f766e', l: 'Economy' },
          { c: '#5b7b6c', l: 'Free/Standard' }
        ].map(lg => (
          <div key={lg.l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
             <div style={{ width: 14, height: 14, background: lg.c, borderRadius: 2 }} /> {lg.l}
          </div>
        ))}
         <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 14, height: 14, background: '#333', borderRadius: 2, display: 'flex', alignItems:'center', justifyContent:'center', fontSize: 10, color: gold }}>★</div> Premium</div>
         <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 14, height: 14, background: 'repeating-linear-gradient(45deg, #222, #222 3px, #444 3px, #444 6px)', borderRadius: 2 }} /> Blocked</div>
      </div>
    </div>
  )
}
