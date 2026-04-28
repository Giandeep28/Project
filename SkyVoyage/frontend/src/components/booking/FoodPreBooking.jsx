import React, { useState, useEffect } from 'react';
import PriceDisplay from '../shared/PriceDisplay';

const MEAL_IMAGES = {
  'indian-thali': '/meals/indian-thali.png',
  'chicken-tikka': '/meals/chicken-tikka.png',
  'kids-pasta': '/meals/kids-pasta.png',
  'arabic-mezze': '/meals/arabic-mezze.png',
  'default': 'https://images.unsplash.com/photo-1540333563391-645bbd697811?auto=format&fit=crop&q=80&w=400'
};

const QRCodeUI = ({ text }) => (
  <div style={{ background: 'white', padding: 12, borderRadius: 8, display: 'inline-block', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
    <svg width="120" height="120" viewBox="0 0 100 100" style={{ shapeRendering: 'crispEdges' }}>
      <rect width="100" height="100" fill="white" />
      <path d="M10 10h30v30h-30zM20 20h10v10h-10z M60 10h30v30h-30zM70 20h10v10h-10z M10 60h30v30h-30zM20 70h10v10h-10z" fill="black" />
      <path d="M45 10h10v10h-10z M45 25h10v10h-10z M45 45h10v10h-10z M10 45h10v10h-10z M25 45h10v10h-10z M60 45h10v10h-10z M75 45h10v10h-10z M45 60h10v10h-10z M45 75h10v10h-10z M60 60h10v10h-10z M75 75h10v10h-10z M90 60h10v10h-10z M90 90h10v10h-10z M60 90h10v10h-10z M75 60h10v10h-10z" fill="black" />
    </svg>
    <div style={{ fontSize: 10, color: '#333', textAlign: 'center', marginTop: 4, fontWeight: 700 }}>{text}</div>
  </div>
);

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
        const res = await fetch(`http://localhost:8080/api/food/meals/stopover?airline=${stopover.nextAirline}&stopover_airport=${stopover.airport}&arrival_time=${encodeURIComponent(stopover.arrival)}&departure_time=${encodeURIComponent(stopover.departure)}`);
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

  if (loading) return <div style={{ padding: 20 }}>Checking stopover culinary options...</div>;
  if (error || !data || data.meals.length === 0 || data.stopover_duration_minutes <= 45) return null;

  if (orderStatus) {
    return (
      <div style={{ background: darkMode ? 'rgba(16,185,129,0.1)' : '#ecfdf5', border: '1px solid #10b981', padding: 32, borderRadius: 16, marginTop: 24, display: 'flex', gap: 32, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: 20, color: '#10b981' }}>Order Confirmed!</h4>
          <p style={{ margin: '0 0 16px 0', fontSize: 14 }}>
            Your gourmet meal will be ready at <strong>{stopover.airport}</strong> at <strong>{new Date(selectedSlot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>.
          </p>
          <div style={{ fontSize: 13, background: 'rgba(0,0,0,0.05)', padding: '12px 16px', borderRadius: 8 }}>
            <div style={{ marginBottom: 4 }}><strong>Order ID:</strong> #{orderStatus.orderId}</div>
            <div><strong>Location:</strong> {stopover.airport} Gate/Lounge Delivery</div>
          </div>
        </div>
        <QRCodeUI text={`SV-MEAL-${orderStatus.orderId}`} />
      </div>
    );
  }

  const durationHrs = Math.floor(data.stopover_duration_minutes / 60);
  const durationMins = data.stopover_duration_minutes % 60;

  return (
    <div style={{ background: bg, border: `1px solid ${bdr}`, borderRadius: 16, overflow: 'hidden', marginTop: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      {/* Timeline Header */}
      <div style={{ padding: '24px 32px', borderBottom: `1px solid ${bdr}`, background: darkMode ? 'rgba(200,168,75,0.03)' : '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Layover at {stopover.airport}</h3>
            <p style={{ margin: '4px 0 0', fontSize: 14, opacity: 0.7 }}>Duration: {durationHrs}h {durationMins}m</p>
          </div>
          <div style={{ background: accent, color: '#000', padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>PRE-ORDER AVAILABLE</div>
        </div>
        
        {/* Visual Timeline */}
        <div style={{ position: 'relative', height: 40, marginTop: 30, padding: '0 10px' }}>
          <div style={{ position: 'absolute', top: 20, left: 10, right: 10, height: 2, background: bdr }} />
          <div style={{ position: 'absolute', top: 12, left: 0, textAlign: 'center', width: 60 }}>
            <div style={{ width: 12, height: 12, background: accent, borderRadius: '50%', margin: '0 auto' }} />
            <div style={{ fontSize: 10, marginTop: 4, fontWeight: 700 }}>{new Date(stopover.arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div style={{ fontSize: 9, opacity: 0.6 }}>ARRIVAL</div>
          </div>
          <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', width: 100 }}>
            <div style={{ width: 16, height: 16, background: '#10b981', borderRadius: '50%', margin: '0 auto', border: '3px solid white' }} />
            <div style={{ fontSize: 10, marginTop: 4, fontWeight: 700 }}>MEAL READY</div>
            <div style={{ fontSize: 9, opacity: 0.6 }}>OPTIMAL TIME</div>
          </div>
          <div style={{ position: 'absolute', top: 12, right: 0, textAlign: 'center', width: 60 }}>
            <div style={{ width: 12, height: 12, background: '#ef4444', borderRadius: '50%', margin: '0 auto' }} />
            <div style={{ fontSize: 10, marginTop: 4, fontWeight: 700 }}>{new Date(stopover.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div style={{ fontSize: 9, opacity: 0.6 }}>DEPARTURE</div>
          </div>
        </div>
      </div>

      <div style={{ padding: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
        {data.meals.map(meal => (
          <div key={meal.id} style={{ border: `1px solid ${bdr}`, borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: darkMode ? 'rgba(255,255,255,0.02)' : 'white', transition: '0.2s' }}>
            <div style={{ height: 140, position: 'relative' }}>
              <img src={MEAL_IMAGES[meal.image_placeholder] || MEAL_IMAGES.default} alt={meal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>{meal.category}</div>
            </div>
            <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700 }}>{meal.name}</h4>
              <p style={{ margin: '0 0 16px', fontSize: 12, opacity: 0.7, lineHeight: 1.5 }}>{meal.description}</p>
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: 20, color: accent }}>
                  <PriceDisplay amount={meal.price_usd} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button onClick={() => updateQuantity(meal.id, -1)} disabled={!cart[meal.id]} style={{ width: 32, height: 32, borderRadius: 8, background: bdr, border: 'none', color: text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>-</button>
                  <span style={{ fontSize: 15, fontWeight: 800, width: 20, textAlign: 'center' }}>{cart[meal.id] || 0}</span>
                  <button onClick={() => updateQuantity(meal.id, 1)} style={{ width: 32, height: 32, borderRadius: 8, background: accent, border: 'none', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>+</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {Object.keys(cart).length > 0 && (
        <div style={{ padding: '24px 32px', borderTop: `1px solid ${bdr}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24, background: darkMode ? 'rgba(200,168,75,0.05)' : '#fffaf0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div>
              <p style={{ margin: '0 0 6px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, opacity: 0.6 }}>Delivery Slot</p>
              <select value={selectedSlot} onChange={e => setSelectedSlot(e.target.value)} style={{ padding: '10px 16px', borderRadius: 8, background: darkMode ? '#2A3347' : '#fff', color: text, border: `1px solid ${accent}`, outline: 'none', fontWeight: 600 }}>
                {data.delivery_slots.map(slot => (
                  <option key={slot} value={slot}>
                    {new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Delivery)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p style={{ margin: '0 0 6px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, opacity: 0.6 }}>Cart Total</p>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 900, color: accent }}>
                <PriceDisplay amount={calculateTotal()} />
              </p>
            </div>
          </div>
          <button onClick={submitOrder} style={{ padding: '16px 40px', background: accent, color: '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 15px rgba(200,168,75,0.3)' }}>
            Place Pre-Order
          </button>
        </div>
      )}
      
      <div style={{ padding: '16px 32px', background: darkMode ? 'rgba(255,255,255,0.02)' : '#f9fafb', borderTop: `1px solid ${bdr}`, fontSize: 11, opacity: 0.6, fontStyle: 'italic' }}>
        * Pre-orders are locked 45 minutes before departure. Food will be delivered to your arrival gate at {stopover.airport}.
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
    <div style={{ marginTop: 60, color: darkMode ? '#f0ece4' : '#111827', borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`, paddingTop: 40 }}>
      <h2 style={{ fontSize: 24, fontWeight: 900, fontFamily: '"Playfair Display",serif', textTransform: 'uppercase', marginBottom: 8 }}>SkyVoyage Stopover Concierge</h2>
      <p style={{ color: darkMode ? '#9ca3af' : '#6b7280', marginBottom: 24 }}>Enhance your journey with gourmet meals delivered during your layover.</p>
      {stopovers.map((stopover, idx) => (
        <StopoverFood 
          key={idx} 
          stopover={stopover} 
          bookingId={booking.bookingId} 
          passengerName={booking.passengers?.[0]?.name || booking.contactEmail || 'Passenger'} 
          darkMode={darkMode} 
        />
      ))}
    </div>
  );
}
