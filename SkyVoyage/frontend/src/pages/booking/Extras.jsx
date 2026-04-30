import React, { useState } from "react";
import {
  Sparkles,
  Armchair,
  Coffee,
  ShieldCheck,
  Briefcase,
  Plus,
  Check,
  ShoppingBag,
  ArrowRight,
  MapPin,
  Clock,
  Loader2,
} from "lucide-react";
import PriceDisplay from "../../components/shared/PriceDisplay";

export default function Extras({ darkMode }) {
  const [selected, setSelected] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stopoverData, setStopoverData] = useState({
    airport: 'SIN',
    time: '2026-05-15T14:30:00Z',
    cuisine: 'indian',
    dishId: 'ic-01'
  });

  const menu = {
    indian: { name: "Indian Court", dishes: [
      { id: "ic-01", name: "Butter Chicken with Naan", price: 1000 },
      { id: "ic-02", name: "Paneer Tikka Masala", price: 900 },
      { id: "ic-03", name: "Hyderabadi Biryani", price: 950 }
    ]},
    chinese: { name: "Chinese Court", dishes: [
      { id: "cc-01", name: "Hakka Noodles with Manchurian", price: 900 },
      { id: "cc-02", name: "Dim Sum Platter", price: 1100 },
      { id: "cc-03", name: "Szechuan Fried Rice", price: 850 }
    ]},
    continental: { name: "Continental Court", dishes: [
      { id: "ct-01", name: "Grilled Salmon", price: 1500 },
      { id: "ct-02", name: "Alfredo Pasta", price: 1200 },
      { id: "ct-03", name: "Chicken Steak", price: 1300 }
    ]},
    south_indian: { name: "South Indian Court", dishes: [
      { id: "si-01", name: "Masala Dosa", price: 700 },
      { id: "si-02", name: "Idli & Vada Sambar", price: 600 }
    ]}
  };

  const catalog = [
    { id: 'lounge', name: 'Celestial Lounge Access', price: 2500, icon: <Sparkles />, desc: 'Exclusive access to our private hub lounges featuring gourmet dining and spa.' },
    { id: 'legroom', name: 'Extra Legroom Seat', price: 1200, icon: <Armchair />, desc: 'Enhanced comfort with up to 6 inches of additional stretch room.' },
    { id: 'dining', name: 'Stopover Food Court', price: 800, icon: <Coffee />, desc: 'Pre-order from premium Indian, Chinese, or Continental kitchens at your hub.' },
    { id: 'priority', name: 'SkyPriority Baggage', price: 600, icon: <Briefcase />, desc: 'Priority handling ensures your baggage is first on the carousel.' },
    { id: 'insurance', name: 'Elite Voyage Protection', price: 1500, icon: <ShieldCheck />, desc: 'Full coverage for flight disruptions and medical assistance.' },
  ];

  const toggle = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleConfirm = async () => {
    if (selected.includes('dining')) {
      setLoading(true);
      try {
        const selectedCuisine = menu[stopoverData.cuisine];
        const selectedDish = selectedCuisine.dishes.find(d => d.id === stopoverData.dishId);
        
        const orderBody = {
          bookingId: "BK-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
          flightNumber: "SV102",
          stopoverAirport: stopoverData.airport,
          deliveryTime: stopoverData.time,
          items: [{ 
            name: selectedDish.name, 
            quantity: 1, 
            mealId: selectedDish.id,
            cuisine: selectedCuisine.name
          }],
          totalUSD: selectedDish.price / 80 // Mock conversion
        };

        const res = await fetch('http://localhost:8080/api/stopover/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderBody)
        });

        if (res.ok) {
          const data = await res.json();
          setStopoverData(prev => ({ ...prev, orderId: data.orderId, bookingId: orderBody.bookingId, confirmedDish: selectedDish.name }));
          setStep(2);
        }
      } catch (err) {
        console.error("Failed to order stopover meal:", err);
      } finally {
        setLoading(false);
      }
    } else {
      setStep(2);
    }
  };

  const total = selected.reduce((acc, curr) => acc + (catalog.find(x => x.id === curr)?.price || 0), 0);

  return (
    <div className={`min-h-screen pt-24 pb-12 ${darkMode ? 'bg-[var(--app-bg)] text-[var(--app-text)]' : 'bg-white text-slate-900'}`}>
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        {step === 1 ? (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12 border-b border-[var(--border-color)] pb-12">
               <div>
                  <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Enhance Your Voyage</h1>
                  <p className="text-xl text-slate-500 font-medium max-w-2xl">Tailor your journey with our premium selection of amenities and exclusive privileges.</p>
               </div>
               <div className="bg-primary/10 p-6 rounded-3xl border border-primary/20 min-w-[280px]">
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-[3px] mb-2">Total Selection</p>
                  <p className="text-3xl font-black text-primary"><PriceDisplay amount={total} currency="INR" /></p>
                  <button 
                    disabled={selected.length === 0 || loading} 
                    onClick={handleConfirm}
                    className="w-full mt-4 bg-primary text-dark font-black px-6 py-3 rounded-xl uppercase tracking-widest text-[10px] hover:bg-white transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin"/> : <>Confirm Extras <ArrowRight className="w-3 h-3"/></>}
                  </button>
               </div>
            </div>

            {selected.includes('dining') && (
              <div className="mb-12 p-8 bg-primary/5 border border-primary/20 rounded-[2rem] animate-in slide-in-from-top duration-500">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-primary">
                  <Coffee className="w-4 h-4"/> Stopover Meal Customization
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-3">Stopover Hub</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary"/>
                      <select 
                        value={stopoverData.airport}
                        onChange={e => setStopoverData({...stopoverData, airport: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm font-bold appearance-none outline-none focus:border-primary/50"
                      >
                        <option value="DEL">Delhi IGI (DEL)</option>
                        <option value="BOM">Mumbai (BOM)</option>
                        <option value="SIN">Singapore Changi (SIN)</option>
                        <option value="DXB">Dubai International (DXB)</option>
                        <option value="LHR">London Heathrow (LHR)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-3">Cuisine Court</label>
                    <div className="relative">
                      <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary"/>
                      <select 
                        value={stopoverData.cuisine}
                        onChange={e => setStopoverData({...stopoverData, cuisine: e.target.value, dishId: menu[e.target.value].dishes[0].id})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm font-bold appearance-none outline-none focus:border-primary/50"
                      >
                        {Object.entries(menu).map(([id, cat]) => (
                          <option key={id} value={id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-3">Select Your Dish</label>
                    <div className="relative">
                      <Coffee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary"/>
                      <select 
                        value={stopoverData.dishId}
                        onChange={e => setStopoverData({...stopoverData, dishId: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm font-bold appearance-none outline-none focus:border-primary/50"
                      >
                        {menu[stopoverData.cuisine].dishes.map(dish => (
                          <option key={dish.id} value={dish.id}>{dish.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-3">Preferred Delivery Time</label>
                    <div className="relative max-w-sm">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary"/>
                      <input 
                        type="datetime-local"
                        value={stopoverData.time.substring(0, 16)}
                        onChange={e => setStopoverData({...stopoverData, time: e.target.value + ":00Z"})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-primary/50"
                      />
                    </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalog.map((item) => {
                const isActive = selected.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`p-8 border-2 rounded-[2rem] cursor-pointer transition-all relative group ${isActive ? "bg-primary/5 border-primary shadow-[0_20px_40px_rgba(200,168,75,0.1)]" : "bg-white/5 border-[var(--border-color)] hover:border-white/20"}`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all ${isActive ? "bg-primary text-dark" : "bg-black/40 text-primary"}`}
                    >
                      {React.cloneElement(item.icon, { size: 24 })}
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight mb-4">
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8">
                      {item.desc}
                    </p>

                    <div className="flex justify-between items-center pt-6 border-t border-white/5">
                      <span className="text-lg font-black tracking-tight text-white">
                        <PriceDisplay amount={item.price} currency="INR" />
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isActive ? "bg-primary text-dark" : "bg-white/5 border border-white/10 group-hover:bg-white/10"}`}
                      >
                        {isActive ? (
                          <Check size={16} strokeWidth={4} />
                        ) : (
                          <Plus size={16} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="animate-in zoom-in duration-500 flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
              <ShoppingBag className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">
              Selection Secured
            </h2>
            <p className="text-slate-400 font-medium mb-12 max-w-md">
              Your premium amenities have been successfully added to your
              reservation{" "}
              <span className="text-primary font-bold">
                {stopoverData.bookingId || "SV49B2"}
              </span>
              . Get ready for an elevated SkyVoyage experience.
            </p>
            <div className="space-y-3 w-full max-w-sm mb-12">
              {selected.map((id) => (
                <div
                  key={id}
                  className="flex justify-between p-4 bg-white/5 border border-[var(--border-color)] rounded-xl"
                >
                  <span className="text-xs font-black uppercase tracking-widest">
                    {catalog.find((x) => x.id === id)?.name}
                  </span>
                  <span className="text-xs font-bold text-primary">
                    <PriceDisplay
                      amount={catalog.find((x) => x.id === id)?.price || 0}
                      currency="INR"
                    />
                  </span>
                </div>
              ))}
              <div className="flex justify-between p-5 bg-primary/10 border border-primary/20 rounded-2xl">
                <span className="font-black uppercase tracking-widest">
                  Total Paid
                </span>
                <span className="text-xl font-black text-primary">
                  <PriceDisplay amount={total} currency="INR" />
                </span>
              </div>
            </div>
            {selected.includes("dining") && (
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl mb-12 max-w-sm w-full text-left">
                <p className="text-[10px] font-black uppercase text-slate-500 mb-2">
                  Stopover Tracking Code
                </p>
                <p className="text-lg font-black text-white mb-4">
                  {stopoverData.orderId}
                </p>
                <p className="text-xs text-slate-400">
                  Use this code or your Booking ID in the **ORDERS** tab to
                  track your meal after landing.
                </p>
              </div>
            )}
            <button
              onClick={() => setStep(1)}
              className="text-slate-500 font-bold text-xs uppercase tracking-[4px] border-b border-transparent hover:border-slate-500 transition-all pb-1"
            >
              Back to Catalog
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
