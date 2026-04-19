import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SeatSelection from '../components/booking/SeatSelection';
import PaymentPrototype from '../components/booking/PaymentPrototype';
import BoardingPass from '../components/booking/BoardingPass';
import { ApiClient } from '../services/ApiClient';
import { CheckCircle2, ChevronRight, Plane, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Booking() {
  const { state, dispatch } = useApp();
  // Professional logic: If seats are already selected in SearchResults, jump to Authorization
  const hasSeats = Object.keys(state.selectedSeats).length > 0;
  const [step, setStep] = useState(hasSeats ? 2 : 1); 
  const [bookingResult, setBookingResult] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const flightId = searchParams.get('flightId') || 'SV102';
  const priceParam = searchParams.get('price');
  const price = priceParam ? parseFloat(priceParam) : 5519;

  // Selected seat for display (first from map)
  const selectedSeatId = state.selectedSeats[0] || '1A';

  const handlePay = async (cardData) => {
    try {
      setBookingResult({ status: 'success', bookingId: `SV-${Math.floor(Math.random() * 90000 + 10000)}` });
      setStep(3);
    } catch (err) {
      dispatch({ type: 'ADD_NOTIFICATION', payload: { message: 'Celestial Network Hub failure.', type: 'error' }});
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] flex items-center py-20 animate-in fade-in duration-1000">
        <SeatSelection 
          onSeatSelect={(seat) => {
            if (seat) {
              setTimeout(() => setStep(2), 800);
            }
          }}
        />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <Navbar />
      
      <main className="container mx-auto px-6 lg:px-12 py-32">
        {/* Progress Tracker (Simplified for Payment/Success) */}
        <div className="flex justify-center items-center gap-12 mb-20 animate-in fade-in duration-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-xs bg-white/5 text-slate-500 border border-[var(--border-color)] italic">1</div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Seat Allocation</span>
          </div>
          <ChevronRight size={16} className="text-slate-700" />
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${step >= 2 ? 'bg-primary text-dark shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'bg-white/5 text-slate-500'}`}>2</div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${step >= 2 ? 'text-primary' : 'text-slate-500'}`}>Authorization</span>
          </div>
          <ChevronRight size={16} className="text-slate-700" />
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${step === 3 ? 'bg-primary text-dark shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'bg-white/5 text-slate-500'}`}>3</div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${step === 3 ? 'text-primary' : 'text-slate-500'}`}>Manifest</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {step === 2 && (
            <div className="grid lg:grid-cols-12 gap-16 items-start">
               <div className="lg:col-span-7 animate-in slide-in-from-left duration-700">
                  <PaymentPrototype amount={price} onPay={handlePay} />
                  <button 
                    onClick={() => setStep(1)}
                    className="mt-8 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[var(--app-text)] transition-all flex items-center gap-2 group"
                  >
                    <ChevronRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Re-allocate Suite
                  </button>
               </div>
               <div className="lg:col-span-5 space-y-8 animate-in slide-in-from-right duration-700">
                  <div className="p-10 glass-panel rounded-[40px] border-[#d4af37]/20 bg-[var(--app-bg)]">
                    <h4 className="text-[11px] font-black uppercase tracking-[3px] text-primary mb-8 italic">Voyage Summary</h4>
                    <div className="space-y-8">
                       <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-primary border border-[var(--border-color)]"><Plane size={28} /></div>
                         <div>
                           <p className="text-xl font-black italic tracking-tighter uppercase text-[var(--app-text)]">{flightId}</p>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">LHR ➔ JFK Hub</p>
                         </div>
                       </div>
                       <div className="space-y-4 pt-8 border-t border-[var(--border-color)]">
                          <div className="flex justify-between text-xs font-bold uppercase tracking-widest"><span className="text-slate-500">Suite</span><span className="text-primary">{selectedSeatId}</span></div>
                          <div className="flex justify-between text-xs font-bold uppercase tracking-widest"><span className="text-slate-500">Class Type</span><span className="text-[var(--app-text)]">Elite First</span></div>
                          <div className="flex justify-between items-end pt-4 border-t border-[var(--border-color)]">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Yield</span>
                            <span className="text-4xl font-black text-[var(--app-text)] italic tracking-tighter">₹{price?.toLocaleString()}</span>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in zoom-in duration-1000">
              <div className="text-center mb-16 space-y-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary border border-primary/20 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                  <CheckCircle2 size={56} />
                </div>
                <div>
                  <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-4 text-[var(--app-text)]">Voyage Authorized</h2>
                  <p className="text-[11px] text-slate-500 font-black uppercase tracking-[6px] opacity-60">Manifest UID: {bookingResult?.bookingId || 'SV-MANIFEST-4921'}</p>
                </div>
              </div>
              
              <div className="max-w-md mx-auto">
                <BoardingPass 
                  bookingId={bookingResult?.bookingId} 
                  flightId={flightId} 
                  seat={selectedSeatId} 
                />
              </div>

              <div className="mt-20 flex justify-center">
                 <button 
                  onClick={() => navigate('/')}
                  className="bg-white/5 border border-white/10 px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[4px] hover:bg-primary hover:text-dark transition-all duration-500"
                 >
                   Return to Fleet Hub
                 </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {step !== 1 && <Footer />}
    </div>
  );
}
