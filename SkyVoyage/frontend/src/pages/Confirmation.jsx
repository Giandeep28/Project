import React from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import PriceDisplay from '../components/shared/PriceDisplay';
import FoodPreBooking from '../components/booking/FoodPreBooking';

export default function Confirmation({ darkMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  // Fix 7 requirement: redirect to home if accessed directly without booking
  if (!booking) return <Navigate to="/" replace />;

  const bg = darkMode ? '#0A0F1A' : '#f1f3f5';
  const cardBg = darkMode ? '#1C2333' : '#fff';
  const bdr = darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const text = darkMode ? '#f0ece4' : '#111827';
  const muted = darkMode ? '#9ca3af' : '#6b7280';
  const accent = '#C8A84B';

  const downloadPass = () => {
    const textBlob = `
SKYVOYAGE BOARDING PASS
=======================
PNR: ${booking.pnr || 'N/A'}
Booking ID: ${booking.bookingId}
Flight ID: ${booking.flightId}
Status: ${booking.status}

Fare: INR ${booking.totalPrice?.toLocaleString('en-IN')}
Booked At: ${booking.bookedAt}
Email: ${booking.contactEmail}

Thank you for flying SkyVoyage.
    `.trim();
    const element = document.createElement("a");
    const file = new Blob([textBlob], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `BoardingPass-${booking.pnr || booking.bookingId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{ background: bg, minHeight: '100vh', paddingTop: 120, paddingBottom: 60, color: text }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#10b981', color: '#fff', fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>✓</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, fontFamily: '"Playfair Display",serif', textTransform: 'uppercase', marginBottom: 8 }}>Booking Confirmed</h1>
          <p style={{ color: muted, fontSize: 16 }}>Your reservation is complete. A copy has been emailed to {booking.contactEmail}.</p>
        </div>

        <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 16, overflow: 'hidden', boxShadow: darkMode ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.05)' }}>
          <div style={{ background: accent, padding: '24px 32px', color: '#000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8, marginBottom: 4 }}>Booking Reference (PNR)</p>
              <p style={{ fontSize: 28, fontWeight: 900, fontFamily: 'monospace' }}>{booking.pnr || 'SV-WAIT'}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8, marginBottom: 4 }}>Status</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#166534', background: '#bbf7d0', padding: '4px 12px', borderRadius: 20 }}>{booking.status}</p>
            </div>
          </div>

          <div style={{ padding: 32 }}>
            <div style={{ display: 'flex', gap: 32, borderBottom: `1px solid ${bdr}`, paddingBottom: 24, marginBottom: 24 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Flight ID</p>
                <p style={{ fontSize: 18, fontWeight: 600 }}>{booking.flightId}</p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Seat Class</p>
                <p style={{ fontSize: 18, fontWeight: 600 }}>{booking.seatClass || 'N/A'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Total Amount Paid</p>
                <p style={{ fontSize: 24, fontWeight: 800, color: accent }}>
                  <PriceDisplay amount={booking.totalPrice || 0} />
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Transaction ID</p>
                <p style={{ fontSize: 14, fontWeight: 500, fontFamily: 'monospace' }}>{booking.bookingId}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <button onClick={downloadPass} style={{ flex: 1, padding: '16px 0', background: 'transparent', border: `2px solid ${accent}`, color: accent, borderRadius: 10, fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', transition: '0.2s' }}>
                Download Boarding Pass
              </button>
              <button onClick={() => navigate('/')} style={{ flex: 1, padding: '16px 0', background: accent, color: '#000', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', transition: '0.2s' }}>
                Return to Hub
              </button>
            </div>
          </div>
        </div>

        <FoodPreBooking booking={booking} darkMode={darkMode} />
      </div>
    </div>
  );
}
