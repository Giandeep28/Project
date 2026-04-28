import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import ApiClient from '../services/ApiClient';
import SeatSelectionMap from '../components/booking/SeatSelectionMap';
import MealSelection from '../components/booking/MealSelection';
import PriceDisplay from '../components/shared/PriceDisplay';

export default function Booking({ darkMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state?.flight;

  if (!flight) return <Navigate to="/flights" replace />;

  const [step, setStep] = useState('PASSENGERS'); // 'PASSENGERS', 'SEATS', 'MEALS', 'PAYMENT'
  
  const [passengers, setPassengers] = useState([{ name: '', age: '', gender: '' }]);
  const [contactEmail, setContactEmail] = useState('');
  const [selectedClass, setSelectedClass] = useState(flight.seatClass || 'ECONOMY');

  const [seatAssignments, setSeatAssignments] = useState({});
  const [seatAddedPrice, setSeatAddedPrice] = useState(0);

  const [selectedMeals, setSelectedMeals] = useState({}); // { pIdx: mealId }
  const [mealAddedPrice, setMealAddedPrice] = useState(0);

  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState(null);

  const basePrice = flight.price * passengers.length;
  const totalPrice = basePrice + seatAddedPrice + mealAddedPrice;

  const handleProceedToSeats = () => {
    if (!contactEmail) {
      setPayError('Contact email is required.'); return;
    }
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name || !passengers[i].age || !passengers[i].gender) {
        setPayError(`Please complete all fields for Passenger ${i+1}.`); return;
      }
    }
    setPayError(null);
    setStep('SEATS');
  };

  const handlePay = async () => {
    setPayLoading(true);
    setPayError(null);
    try {
      const augmentedPassengers = passengers.map((p, i) => ({
        ...p,
        seatAssigned: seatAssignments[i]?.label || 'Unassigned',
        mealId: selectedMeals[i] || 'SKIP'
      }));

      const result = await ApiClient.createBooking({
        flightId: flight.id,
        from: flight.origin,
        to: flight.destination,
        passengers: augmentedPassengers,
        seatClass: selectedClass,
        contactEmail: contactEmail,
        totalPrice: totalPrice,
        mealAddedPrice: mealAddedPrice,
        seatAddedPrice: seatAddedPrice
      });

      // Enrich result with local state data for display on Confirmation page
      const enrichedBooking = {
        ...result,
        passengers: augmentedPassengers,
        legs: flight.legs || [{ 
          from: flight.origin, 
          to: flight.destination, 
          arrival: flight.arrivalTime, 
          departure: flight.departureTime, 
          airline: flight.airline 
        }]
      };

      navigate('/confirmation', { state: { booking: enrichedBooking } });
    } catch (err) {
      setPayError(err.message || 'Payment failed. Please try again.');
    } finally {
      setPayLoading(false);
    }
  };

  if (step === 'SEATS') {
    return (
      <SeatSelectionMap 
        flight={flight} 
        passengers={passengers} 
        onBack={() => setStep('PASSENGERS')} 
        onConfirm={(seats, extraCost) => {
          setSeatAssignments(seats);
          setSeatAddedPrice(extraCost);
          setStep('MEALS');
        }} 
      />
    );
  }

  if (step === 'MEALS') {
    return (
      <MealSelection
        flight={flight}
        passengers={passengers}
        darkMode={darkMode}
        onBack={() => setStep('SEATS')}
        onConfirm={(meals, cost) => {
          setSelectedMeals(meals);
          setMealAddedPrice(cost);
          setStep('PAYMENT');
        }}
      />
    );
  }

  const bg = darkMode ? '#0A0F1A' : '#f1f3f5';
  const cardBg = darkMode ? '#1C2333' : '#fff';
  const bdr = darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const text = darkMode ? '#f0ece4' : '#111827';
  const muted = darkMode ? '#9ca3af' : '#6b7280';
  const inputBg = darkMode ? '#111827' : '#f9fafb';
  const inputBdr = darkMode ? 'rgba(255,255,255,0.15)' : '#d1d5db';
  const gold = '#C8A84B';

  return (
    <div style={{ background: bg, minHeight: '100vh', paddingTop: 100, paddingBottom: 60, color: text }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        
        {/* Wizard Header Progress */}
        <div style={{ display: 'flex', gap: 24, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 32, justifyContent: 'center' }}>
          <span style={{ color: step === 'PASSENGERS' ? gold : muted }}>1. Passengers</span>
          <span style={{ color: muted }}>{'>'}</span>
          <span style={{ color: step === 'SEATS' ? gold : muted }}>2. Seats</span>
          <span style={{ color: muted }}>{'>'}</span>
          <span style={{ color: step === 'MEALS' ? gold : muted }}>3. Meals</span>
          <span style={{ color: muted }}>{'>'}</span>
          <span style={{ color: step === 'PAYMENT' ? gold : muted }}>4. Final Review & Payment</span>
        </div>
        
        <h1 style={{ fontSize: 28, fontWeight: 900, fontFamily: '"Playfair Display",serif', textTransform: 'uppercase', marginBottom: 24 }}>
          {step === 'PASSENGERS' ? 'Passenger Details' : 'Finalize Payment'}
        </h1>

        {/* Flight Summary */}
        <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: '#C8A84B', marginBottom: 16 }}>Flight Details</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
             <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                  <div style={{ width: 48, height: 48, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
                    <img src={flight.airlineLogo} alt={flight.airline} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <p style={{ fontSize: 24, fontWeight: 700 }}>{flight.airline}</p>
                </div>
                <p style={{ color: muted, fontSize: 14 }}>{flight.flightNumber} • {flight.origin} to {flight.destination}</p>
             </div>
             <div style={{ textAlign: 'right' }}>
                <p style={{ color: muted, fontSize: 12, textTransform: 'uppercase' }}>Departing</p>
                <p style={{ fontSize: 18, fontWeight: 600 }}>
                   {new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(flight.departureTime))}
                </p>
             </div>
          </div>
        </div>

        {payError && (
          <div style={{ background: '#ef4444', color: '#fff', padding: '12px 16px', borderRadius: 8, marginBottom: 24, fontSize: 14, fontWeight: 600 }}>
            {payError}
          </div>
        )}

        {step === 'PASSENGERS' && (
          <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 16, padding: 24, marginBottom: 24, animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: '#C8A84B' }}>Passengers</h2>
              <button onClick={() => setPassengers([...passengers, { name: '', age: '', gender: '' }])} style={{ background: 'transparent', border: `1px solid ${bdr}`, color: text, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>+ Add Guest</button>
            </div>
            
            {passengers.map((p, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                <input type="text" placeholder={`Passenger ${i+1} Full Name`} value={p.name} onChange={(e) => { const neo = [...passengers]; neo[i].name = e.target.value; setPassengers(neo); }} style={{ background: inputBg, border: `1px solid ${inputBdr}`, color: text, padding: '12px 16px', borderRadius: 8, outline: 'none' }} />
                <input type="number" placeholder="Age" min="1" max="120" value={p.age} onChange={(e) => { const neo = [...passengers]; neo[i].age = e.target.value; setPassengers(neo); }} style={{ background: inputBg, border: `1px solid ${inputBdr}`, color: text, padding: '12px 16px', borderRadius: 8, outline: 'none' }} />
                <select value={p.gender} onChange={(e) => { const neo = [...passengers]; neo[i].gender = e.target.value; setPassengers(neo); }} style={{ background: inputBg, border: `1px solid ${inputBdr}`, color: text, padding: '12px 16px', borderRadius: 8, outline: 'none' }}>
                  <option value="">Gender</option><option value="M">Male</option><option value="F">Female</option>
                </select>
              </div>
            ))}

            <div style={{ marginTop: 24, borderTop: `1px solid ${bdr}`, paddingTop: 24 }}>
               <h2 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: '#C8A84B', marginBottom: 12 }}>Contact Info</h2>
               <input type="email" placeholder="Email Address for Tickets" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} style={{ width: '100%', background: inputBg, border: `1px solid ${inputBdr}`, color: text, padding: '12px 16px', borderRadius: 8, outline: 'none' }} />
            </div>

            <button onClick={handleProceedToSeats} style={{ width: '100%', marginTop: 32, padding: '18px 0', background: gold, color: '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', transition: '0.2s' }}>
              Proceed to Seat Selection →
            </button>
          </div>
        )}

        {step === 'PAYMENT' && (
          <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 16, padding: 24, animation: 'fadeIn 0.3s ease' }}>
             <h2 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: '#C8A84B', marginBottom: 20 }}>Final Payment Overview</h2>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24, fontSize: 15, color: text }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Base Flight Fare ({passengers.length} Passenger{passengers.length > 1 && 's'})</span>
                  <span><PriceDisplay amount={basePrice} /></span>
                </div>
                {seatAddedPrice > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Premium Seat Upgrades</span>
                    <span><PriceDisplay amount={seatAddedPrice} /></span>
                  </div>
                )}
                {mealAddedPrice > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Gourmet Meal Selections</span>
                    <span><PriceDisplay amount={mealAddedPrice} /></span>
                  </div>
                )}
             </div>

             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingTop: 20, borderTop: `1px solid ${bdr}` }}>
                <p style={{ fontSize: 18, fontWeight: 600 }}>Total Amount</p>
                <p style={{ fontSize: 28, fontWeight: 800 }}><PriceDisplay amount={totalPrice} /></p>
             </div>

             <div style={{ display: 'flex', gap: 16 }}>
               <button 
                  onClick={() => setStep('MEALS')} 
                  disabled={payLoading}
                  style={{ flex: 1, padding: '18px 0', background: 'transparent', border: `1px solid ${gold}`, color: gold, borderRadius: 10, fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: payLoading ? 'not-allowed' : 'pointer' }}
               >
                  Back to Meals
               </button>
               <button 
                  onClick={handlePay} 
                  disabled={payLoading}
                  style={{ flex: 2, padding: '18px 0', background: payLoading ? '#9ca3af' : gold, color: payLoading ? '#fff' : '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: payLoading ? 'not-allowed' : 'pointer', transition: '0.2s' }}
               >
                  {payLoading ? 'Processing Secure Payment...' : 'Pay & Confirm'}
               </button>
             </div>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
