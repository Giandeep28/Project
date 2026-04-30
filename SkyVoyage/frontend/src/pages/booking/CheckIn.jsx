import React, { useState } from "react";
import {
  UserCheck,
  Search,
  Plane,
  QrCode,
  FileCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import ApiClient from "../../services/ApiClient";

export default function CheckIn({ darkMode }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingId, setBookingId] = useState("");
  const [lastName, setLastName] = useState("");
  const [booking, setBooking] = useState(null);

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await ApiClient.getBooking(bookingId);
      // Simple validation: check if last name is part of the passenger name
      const pName = (data.passengerName || "").toLowerCase();
      if (!pName.includes(lastName.toLowerCase())) {
        throw new Error("Passenger details do not match our records.");
      }
      setBooking(data);
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to retrieve booking.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  return (
    <div
      className={`min-h-screen pt-24 pb-12 ${darkMode ? "bg-[var(--app-bg)] text-[var(--app-text)]" : "bg-white text-slate-900"}`}
    >
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <UserCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">
            Digital Check-In
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
            Experience seamless boarding. Check in online up to 48 hours before
            departure and secure your digital boarding pass.
          </p>
        </div>

        <div className="bg-white/5 border border-[var(--border-color)] rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden backdrop-blur-3xl shadow-2xl">
          {/* Step Indicator */}
          <div className="flex justify-center gap-12 mb-16 border-b border-white/5 pb-8">
            {["RETRIEVE", "CONFIRM", "BOARDING PASS"].map((label, idx) => (
              <div key={label} className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] ${step > idx ? "bg-primary text-dark" : step === idx + 1 ? "border-2 border-primary text-primary shadow-[0_0_15px_rgba(200,168,75,0.4)]" : "border-2 border-[var(--border-color)] text-slate-600"}`}
                >
                  {step > idx ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <span
                  className={`text-[10px] font-black uppercase tracking-[2px] ${step === idx + 1 ? "text-white" : "text-slate-600"}`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="animate-in fade-in duration-500 flex flex-col items-center">
              <form
                onSubmit={handleLookup}
                className="w-full max-w-md space-y-6"
              >
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center mb-6">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">
                    Booking Reference
                  </label>
                  <input
                    required
                    type="text"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    placeholder="e.g. BK-XYZ123"
                    className="w-full bg-black/40 border-2 border-[var(--border-color)] focus:border-primary rounded-2xl px-6 py-5 font-black text-lg outline-none transition-all uppercase text-center tracking-[4px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Passenger Last Name
                  </label>
                  <input
                    required
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="w-full bg-black/40 border-2 border-[var(--border-color)] focus:border-primary rounded-2xl px-6 py-5 font-bold outline-none transition-all text-center"
                  />
                </div>
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-primary text-dark font-black px-8 py-5 rounded-2xl uppercase tracking-widest text-xs hover:bg-white transition-all shadow-[0_15px_35px_rgba(200,168,75,0.25)] flex items-center justify-center gap-2"
                >
                  {loading ? "Verifying Voyage..." : "Proceed to Check-In"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex flex-col lg:flex-row gap-12 items-center">
                <div className="bg-black/30 p-8 rounded-3xl border border-white/5 w-full lg:w-1/2">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-4">
                    Voyage Summary
                  </span>
                  <div className="flex items-center justify-between gap-6 mb-8 border-b border-white/5 pb-6">
                    <div className="text-center">
                      <h4 className="text-4xl font-black">{booking.from}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">
                        Departure
                      </p>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1 opacity-40">
                      <Plane className="w-6 h-6 transform rotate-45" />
                      <div className="h-0.5 w-full bg-slate-700"></div>
                    </div>
                    <div className="text-center">
                      <h4 className="text-4xl font-black">{booking.to}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">
                        Destination
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Flight No.</span>{" "}
                      <span className="font-bold">{booking.flightId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Seat Class</span>{" "}
                      <span className="font-bold text-primary">
                        {booking.seatClass || "CONFIRMED"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Passenger</span>{" "}
                      <span className="font-bold">{booking.passengerName}</span>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-6">
                  <h3 className="text-2xl font-black uppercase">
                    Safety Declaration
                  </h3>
                  <div className="space-y-4">
                    {[
                      "I am not carrying any prohibited items listed in the safety policy.",
                      "All information provided matches my travel documents exactly.",
                    ].map((item, idx) => (
                      <label
                        key={idx}
                        className="flex gap-4 p-5 bg-white/5 border border-[var(--border-color)] rounded-2xl cursor-pointer hover:bg-white/10 transition-all"
                      >
                        <input
                          required
                          type="checkbox"
                          className="w-5 h-5 rounded accent-primary mt-1"
                        />
                        <span className="text-sm font-medium text-slate-300 leading-relaxed">
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={handleFinish}
                    disabled={loading}
                    className="w-full bg-primary text-dark font-black px-8 py-5 rounded-2xl uppercase tracking-widest text-xs hover:bg-white transition-all shadow-[0_15px_35px_rgba(200,168,75,0.25)] mt-4"
                  >
                    {loading
                      ? "Generating Boarding Pass..."
                      : "Finalize Check-In"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in zoom-in duration-500 text-center py-6">
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <FileCheck className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">
                You're All Set
              </h2>
              <p className="text-slate-400 font-medium mb-12 max-w-md mx-auto">
                Your check-in was successful. Please present this digital
                boarding pass at the gate.
              </p>

              <div className="max-w-sm mx-auto bg-white p-8 rounded-3xl flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-6 px-2">
                  <span className="text-[9px] font-black text-black tracking-[4px] uppercase border-b-2 border-black">
                    SKYVOYAGE
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    BOARDING PASS
                  </span>
                </div>
                <QrCode className="w-48 h-48 text-black mb-6" />
                <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-left w-full border-t border-slate-100 pt-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Gate
                    </p>
                    <p className="text-black font-black">T3-A12</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Boarding
                    </p>
                    <p className="text-black font-black">07:45 AM</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Seat
                    </p>
                    <p className="text-primary font-black">1A (First)</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Flight
                    </p>
                    <p className="text-black font-black">SV 104</p>
                  </div>
                </div>
              </div>

              <button className="mt-12 text-primary font-black text-[10px] uppercase tracking-[4px] border-b-2 border-primary/20 pb-1 hover:border-primary transition-all">
                Download PDF Version
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
