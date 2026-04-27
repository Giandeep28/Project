import React, { useState, useEffect } from 'react';
import PriceDisplay from '../shared/PriceDisplay';

function StopoverFood({ stopover, bookingId, passengerName, darkMode }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({});
  const [selectedSlot, setSelectedSlot] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);

  const bg = darkMode ? '#1C2333' : '#fff';
  const bdr = darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const text = darkMode ? '#f0ece4' : '#111827';
  const accent = '#C8A84B';

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/meals/stopover?airline=${stopover.nextAirline}&stopover_airport=${stopover.airport}&arrival_time=${encodeURIComponent(stopover.arrival)}&departure_time=${encodeURIComponent(stopover.departure)}`);
        if (!res.ok) throw new Error('Failed to fetch stopover meals');
        const json = await res.json();
        setData(json);
        if (json.delivery_slots && json.delivery_slots.length > 0) {
          setSelectedSlot(json.delivery_slots[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [stopover]);

  const updateQuantity = (mealId, delta) => {
    setCart(prev => {
      const current = prev[mealId] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev, [mealId]: next };
      if (next === 0) delete updated[mealId];
      return updated;
    });
  };

  const calculateTotal = () => {
    if (!data) return 0;
    let total = 0;
    data.meals.forEach(m => {
      if (cart[m.id]) total += m.price_usd * cart[m.id];
    });
    return total;
  };

  const submitOrder = async () => {
    if (Object.keys(cart).length === 0) return;
    
    const items = Object.entries(cart).map(([mealId, quantity]) => ({
      mealId, quantity, specialInstructions: ''
    }));

    const payload = {
      bookingId,
      passengerName,
      stopoverAirport: stopover.airport,
      airline: stopover.nextAirline,
      deliveryTime: selectedSlot,
      items,
      totalUSD: calculateTotal()
    };

    try {
      const res = await fetch('http://localhost:8080/api/food/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to place order');
      const result = await res.json();
      setOrderStatus(result);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading stopover meals...</div>;
  if (error || !data || data.meals.length === 0) return null;

  if (orderStatus) {
    return (
      <div style={{ background: '#bbf7d0', padding: 20, borderRadius: 12, marginTop: 20, color: '#166534' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Order Confirmed!</h4>
        <p style={{ margin: 0 }}>
          Your meal will be ready at {stopover.airport} by {new Date(selectedSlot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — Order #{orderStatus.orderId}
        </p>
      </div>
    );
  }

  const durationHrs = Math.floor(data.stopover_duration_minutes / 60);
  const durationMins = data.stopover_duration_minutes % 60;

  return (
    <div style={{ background: bg, border: `1px solid ${bdr}`, borderRadius: 16, overflow: 'hidden', marginTop: 20 }}>
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${bdr}`, background: darkMode ? 'rgba(200,168,75,0.05)' : '#f8fafc' }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>Stopover at {stopover.airport} — {durationHrs}h {durationMins}m layover</h3>
        <p style={{ margin: '4px 0 0', fontSize: 13, opacity: 0.7 }}>Pre-order your meal to be delivered at your gate or lounge during the layover.</p>
      </div>

      <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {data.meals.map(meal => (
          <div key={meal.id} style={{ border: `1px solid ${bdr}`, borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 120, background: darkMode ? '#2A3347' : '#e2e8f0', borderRadius: 8, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: darkMode ? '#94a3b8' : '#64748b' }}>
              [Image: {meal.image_placeholder}]
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 10, background: accent, color: '#000', padding: '2px 8px', borderRadius: 10, textTransform: 'uppercase', fontWeight: 700 }}>{meal.category}</span>
              <h4 style={{ margin: '8px 0 4px', fontSize: 16 }}>{meal.name}</h4>
              <p style={{ margin: '0 0 8px', fontSize: 12, opacity: 0.7, lineHeight: 1.4 }}>{meal.description}</p>
              {meal.allergens?.length > 0 && (
                <p style={{ margin: '0 0 12px', fontSize: 11, color: '#ef4444' }}>Allergens: {meal.allergens.join(', ')}</p>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: accent }}>
                <PriceDisplay amountUSD={meal.price_usd} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => updateQuantity(meal.id, -1)} disabled={!cart[meal.id]} style={{ width: 28, height: 28, borderRadius: '50%', background: bdr, border: 'none', color: text, cursor: 'pointer' }}>-</button>
                <span style={{ fontSize: 14, fontWeight: 600, width: 16, textAlign: 'center' }}>{cart[meal.id] || 0}</span>
                <button onClick={() => updateQuantity(meal.id, 1)} style={{ width: 28, height: 28, borderRadius: '50%', background: accent, border: 'none', color: '#000', cursor: 'pointer' }}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {Object.keys(cart).length > 0 && (
        <div style={{ padding: '20px 24px', borderTop: `1px solid ${bdr}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7 }}>Delivery Time</p>
              <select value={selectedSlot} onChange={e => setSelectedSlot(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, background: darkMode ? '#2A3347' : '#fff', color: text, border: `1px solid ${bdr}`, outline: 'none' }}>
                {data.delivery_slots.map(slot => (
                  <option key={slot} value={slot}>
                    {new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7 }}>Total Amount</p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: accent }}>
                <PriceDisplay amountUSD={calculateTotal()} />
              </p>
            </div>
          </div>
          <button onClick={submitOrder} style={{ padding: '12px 24px', background: accent, color: '#000', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer' }}>
            Confirm Order
          </button>
        </div>
      )}
      
      <div style={{ padding: '12px 24px', background: darkMode ? 'rgba(255,255,255,0.02)' : '#f9fafb', borderTop: `1px solid ${bdr}`, fontSize: 11, opacity: 0.7 }}>
        Note: Food will be prepared by the airline/airport partner and delivered to your gate/lounge. Please show your boarding pass when collecting.
      </div>
    </div>
  );
}

export default function FoodPreBooking({ booking, darkMode }) {
  const legs = booking?.legs || [];
  if (legs.length < 2) return null;

  const stopovers = [];
  for (let i = 0; i < legs.length - 1; i++) {
    stopovers.push({
      airport: legs[i].to,
      arrival: legs[i].arrival,
      departure: legs[i+1].departure,
      nextAirline: legs[i+1].airline
    });
  }

  if (stopovers.length === 0) return null;

  return (
    <div style={{ marginTop: 40, color: darkMode ? '#f0ece4' : '#111827' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: '"Playfair Display",serif', textTransform: 'uppercase', marginBottom: 16 }}>Pre-Book Stopover Meals</h2>
      {stopovers.map((stopover, idx) => (
        <StopoverFood 
          key={idx} 
          stopover={stopover} 
          bookingId={booking.bookingId} 
          passengerName={booking.passengerName || booking.contactEmail || 'Passenger'} 
          darkMode={darkMode} 
        />
      ))}
    </div>
  );
}
