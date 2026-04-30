import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PriceDisplay from '../../components/shared/PriceDisplay';

export default function FoodOrder({ darkMode }) {
  const location = useLocation();
  const [bookingId, setBookingId] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const bg = darkMode ? '#0A0F1A' : '#f1f3f5';
  const cardBg = darkMode ? '#1C2333' : '#fff';
  const bdr = darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const text = darkMode ? '#f0ece4' : '#111827';
  const muted = darkMode ? '#9ca3af' : '#6b7280';
  const accent = '#C8A84B';

  useEffect(() => {
    // Try to auto-populate from location state or local storage
    const stateBookingId = location.state?.booking?.bookingId;
    if (stateBookingId) {
      setBookingId(stateBookingId);
      fetchOrders(stateBookingId);
    }
  }, [location.state]);

  const fetchOrders = async (idToFetch) => {
    const id = idToFetch || bookingId;
    if (!id) return;
    
    setLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      const res = await fetch(`http://localhost:8080/api/stopover/orders/${id}`);
      if (!res.ok) throw new Error('Failed to fetch orders or no orders found');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const statusList = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED'];

  return (
    <div style={{ background: bg, minHeight: '100vh', paddingTop: 120, paddingBottom: 60, color: text }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, fontFamily: '"Playfair Display",serif', textTransform: 'uppercase', marginBottom: 8 }}>Food Orders</h1>
        <p style={{ color: muted, fontSize: 16, marginBottom: 40 }}>Track your stopover meal deliveries</p>

        <div style={{ background: cardBg, padding: 24, borderRadius: 16, border: `1px solid ${bdr}`, marginBottom: 40, display: 'flex', gap: 16, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: muted }}>Booking ID</label>
            <input 
              type="text" 
              value={bookingId} 
              onChange={e => setBookingId(e.target.value)} 
              placeholder="e.g. BK-XYZ123" 
              style={{ width: '100%', padding: '14px 16px', borderRadius: 8, border: `1px solid ${bdr}`, background: darkMode ? '#2A3347' : '#f9fafb', color: text, fontSize: 16, outline: 'none' }}
            />
          </div>
          <button 
            onClick={() => fetchOrders()} 
            disabled={!bookingId || loading}
            style={{ padding: '14px 32px', background: accent, color: '#000', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 800, textTransform: 'uppercase', cursor: (!bookingId || loading) ? 'not-allowed' : 'pointer', opacity: (!bookingId || loading) ? 0.5 : 1 }}
          >
            {loading ? 'Searching...' : 'Find Orders'}
          </button>
        </div>

        {error && <div style={{ padding: 20, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 8, marginBottom: 24 }}>{error}</div>}

        {searched && !loading && orders.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: 40, background: cardBg, borderRadius: 16, border: `1px solid ${bdr}`, color: muted }}>
            No food orders found for this booking.
          </div>
        )}

        {orders.map(order => (
          <div key={order.orderId} style={{ background: cardBg, borderRadius: 16, border: `1px solid ${bdr}`, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${bdr}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18 }}>Order #{order.orderId.split('-')[0]}...</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: muted }}>Stopover: {order.stopoverAirport} | Airline: {order.airline}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: 12, textTransform: 'uppercase', color: muted, marginBottom: 4 }}>Delivery Time</p>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{new Date(order.deliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>

            {/* Status Tracker */}
            <div style={{ padding: '32px 24px 24px', borderBottom: `1px solid ${bdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 12, left: 20, right: 20, height: 2, background: bdr, zIndex: 0 }}></div>
                {statusList.map((st, i) => {
                  const isActive = statusList.indexOf(order.status) >= i;
                  return (
                    <div key={st} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: 8 }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: isActive ? accent : (darkMode ? '#2A3347' : '#e2e8f0'), display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? '#000' : muted, fontSize: 12, fontWeight: 800 }}>
                        {isActive ? '✓' : i + 1}
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', color: isActive ? text : muted }}>{st}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <h4 style={{ margin: '0 0 16px', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Items</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {order.items.map((item, i) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottom: i < order.items.length - 1 ? `1px dashed ${bdr}` : 'none' }}>
                    <div>
                      <span style={{ fontWeight: 700, marginRight: 8 }}>{item.quantity}x</span>
                      <span style={{ color: accent, fontWeight: 700, marginRight: 8 }}>[{item.cuisine || 'Gourmet'}]</span>
                      <span>{item.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: `1px solid ${bdr}` }}>
                <span style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase' }}>Total Paid</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: accent }}>
                  <PriceDisplay amount={order.totalUSD} currency="USD" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
