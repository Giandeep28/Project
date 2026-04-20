import React, { useState } from 'react';
import { Search, FileText, User, Plane, Calendar, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function ManageBooking({ darkMode }) {
  const [step, setStep] = useState(1);
  const [pnr, setPnr] = useState('');
  const [lastName, setLastName] = useState('');

  const handleRetrieve = (e) => {
    e.preventDefault();
    if (pnr.length === 6 && lastName) {
      setStep(2);
    }
  };

  return (
    <div className={`min-h-screen pt-24 pb-12 ${darkMode ? 'bg-[var(--app-bg)] text-[var(--app-text)]' : 'bg-white text-slate-900'}`}>
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        <div className="mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-6">
            <Search className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-4">Manage My Booking</h1>
          <p className="text-lg text-slate-500 font-medium">Retrieve your flight details, request special services, or update your passenger profiles in one place.</p>
        </div>

        {step === 1 ? (
          <div className="max-w-xl">
            <form onSubmit={handleRetrieve} className="bg-white/5 border border-[var(--border-color)] p-8 lg:p-10 rounded-3xl backdrop-blur-xl">
              <h2 className="text-xl font-black uppercase tracking-widest mb-8 text-primary">Security Retrieval</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Booking Reference (PNR)</label>
                  <input 
                    type="text" 
                    required 
                    value={pnr} 
                    onChange={e => setPnr(e.target.value.toUpperCase())}
                    placeholder="e.g. SV49B2" 
                    className="w-full bg-black/40 border border-[var(--border-color)] rounded-xl px-5 py-4 font-bold text-sm outline-none focus:border-primary transition-all uppercase"
                    maxLength={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Passenger Last Name</label>
                  <input 
                    type="text" 
                    required 
                    value={lastName} 
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Enter last name as on ticket" 
                    className="w-full bg-black/40 border border-[var(--border-color)] rounded-xl px-5 py-4 font-bold text-sm outline-none focus:border-primary transition-all"
                  />
                </div>

                <button type="submit" className="w-full bg-primary text-dark font-black px-8 py-4 rounded-xl uppercase tracking-widest text-xs hover:bg-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(200,168,75,0.2)]">
                  Locate Reservation
                </button>
              </div>

              <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                   Your booking reference is a 6-character alphanumeric code located on your e-ticket or confirmation email.
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Stack: Voyage Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-primary/10 border border-primary/20 p-8 rounded-3xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                     <Plane className="w-32 h-32 transform rotate-45" />
                   </div>
                   <div className="relative z-10">
                     <span className="inline-block px-3 py-1 bg-primary text-dark text-[9px] font-black uppercase tracking-widest rounded-full mb-6">Confirmed</span>
                     <div className="flex items-center gap-8 mb-8">
                       <div className="text-center">
                         <span className="block text-4xl font-black">DEL</span>
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Delhi</span>
                       </div>
                       <div className="flex-1 flex flex-col items-center gap-2">
                         <div className="w-full h-[1px] bg-primary/30 relative">
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--app-bg)] border border-primary/30 flex items-center justify-center">
                             <Plane className="w-4 h-4 text-primary" />
                           </div>
                         </div>
                         <span className="text-[10px] font-bold text-primary tracking-widest uppercase">SKY-104</span>
                       </div>
                       <div className="text-center">
                         <span className="block text-4xl font-black">BOM</span>
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mumbai</span>
                       </div>
                     </div>
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-primary/10">
                       <div>
                         <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Date</span>
                         <span className="text-sm font-bold">24 Oct, 2026</span>
                       </div>
                       <div>
                         <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Departure</span>
                         <span className="text-sm font-bold">08:30 AM</span>
                       </div>
                       <div>
                         <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Class</span>
                         <span className="text-sm font-bold text-primary">Celestial First</span>
                       </div>
                       <div>
                         <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Seat</span>
                         <span className="text-sm font-bold">1A (Window)</span>
                       </div>
                     </div>
                   </div>
                </div>

                <div className="bg-white/5 border border-[var(--border-color)] p-8 rounded-3xl">
                   <h3 className="text-lg font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                     <User className="w-5 h-5 text-primary" /> Passenger Information
                   </h3>
                   <div className="p-6 border border-[var(--border-color)] bg-black/20 rounded-2xl flex items-center justify-between">
                     <div>
                       <span className="block text-xl font-bold">{lastName.toUpperCase()}, PASSENGER MR.</span>
                       <span className="text-xs text-slate-500 font-medium mt-1">SkyPriority Platinum | Dietary: Celestial Vegetarian</span>
                     </div>
                     <button className="text-primary text-[10px] font-black uppercase tracking-widest border border-primary/30 px-6 py-2 rounded-lg hover:bg-primary hover:text-dark transition-all">Edit Info</button>
                   </div>
                </div>
              </div>

              {/* Right Stack: Actions */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[3px] text-slate-500 mb-4 px-2">Voyage Management</h3>
                {[
                  { label: 'Check In Online', icon: <CheckCircle2 className="w-5 h-5" />, active: true },
                  { label: 'Reschedule Flight', icon: <Calendar className="w-5 h-5" /> },
                  { label: 'Purchase Extras', icon: <CreditCard className="w-5 h-5" /> },
                  { label: 'Voyage Details PDF', icon: <FileText className="w-5 h-5" /> }
                ].map((action, idx) => (
                  <button key={idx} className="w-full flex items-center justify-between p-5 border border-[var(--border-color)] bg-white/5 rounded-2xl hover:bg-white/10 hover:border-primary/30 transition-all group">
                    <div className="flex items-center gap-4">
                      <span className="text-primary group-hover:scale-110 transition-transform">{action.icon}</span>
                      <span className="text-sm font-black uppercase tracking-widest">{action.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
