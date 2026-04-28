import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, Star, Crown, Info, Flame, AlertCircle } from 'lucide-react';
import PriceDisplay from '../shared/PriceDisplay';
import MealImage from './MealImage';

const FSSAISymbol = ({ isVeg }) => {
  const color = isVeg ? '#16a34a' : '#991b1b';
  return (
    <div className="flex-shrink-0" style={{
      width: 14, height: 14, border: `1.5px solid ${color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 1, padding: 1
    }}>
      <div style={{
        width: 6, height: 6, background: color, borderRadius: '50%'
      }} />
    </div>
  );
};

const FilterPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
      active 
        ? 'bg-primary text-white shadow-lg shadow-primary/30' 
        : 'bg-white/10 text-slate-400 border border-white/10 hover:bg-white/20'
    }`}
  >
    {label}
  </button>
);

const SectionHeader = ({ isVeg, label }) => {
  const colorClass = isVeg ? 'bg-emerald-600' : 'bg-rose-700';
  return (
    <div className={`w-full ${colorClass} px-6 py-3 flex items-center gap-3 rounded-xl mb-8 shadow-lg`}>
      <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
        <FSSAISymbol isVeg={isVeg} />
      </div>
      <span className="text-white font-black uppercase tracking-widest text-sm">{label}</span>
    </div>
  );
};

export default function MealSelection({ flight, passengers, onBack, onConfirm, darkMode }) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedMeals, setSelectedMeals] = useState({}); // { [pIdx]: { [mealId]: qty } }
  
  // Track if "No Meal" is selected per passenger
  const [noMealSelection, setNoMealSelection] = useState({}); // { [pIdx]: boolean }

  const filters = ['All', 'Veg', 'Non-Veg', 'Jain', 'Vegan', 'Low Calorie', 'Kids'];

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const airlineCode = flight.airlineCode || flight.airline.substring(0, 2).toUpperCase();
        const res = await fetch(`http://localhost:8080/api/food/meals/${airlineCode}`);
        const data = await res.json();
        setMeals(data.meals || []);
      } catch (err) {
        console.error("Failed to fetch meals", err);
        setError("Could not load meal options.");
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [flight]);

  const updateQuantity = (pIdx, mealId, delta) => {
    // If No Meal is selected, deselect it
    if (noMealSelection[pIdx]) {
      setNoMealSelection(prev => ({ ...prev, [pIdx]: false }));
    }

    setSelectedMeals(prev => {
      const passengerMeals = prev[pIdx] || {};
      const currentQty = passengerMeals[mealId] || 0;
      const nextQty = Math.max(0, currentQty + delta);
      
      const newPassengerMeals = { ...passengerMeals };
      if (nextQty === 0) {
        delete newPassengerMeals[mealId];
      } else {
        newPassengerMeals[mealId] = nextQty;
      }

      return { ...prev, [pIdx]: newPassengerMeals };
    });
  };

  const handleNoMeal = (pIdx) => {
    setNoMealSelection(prev => ({ ...prev, [pIdx]: true }));
    setSelectedMeals(prev => {
      const newSelected = { ...prev };
      delete newSelected[pIdx];
      return newSelected;
    });
  };

  const calculateTotal = useMemo(() => {
    let total = 0;
    Object.values(selectedMeals).forEach(passengerMeals => {
      Object.entries(passengerMeals).forEach(([mealId, qty]) => {
        const meal = meals.find(m => m.id === mealId);
        if (meal) {
          total += (meal.price_inr || (meal.price_usd * 80)) * qty;
        }
      });
    });
    return total;
  }, [selectedMeals, meals]);

  const filteredMeals = useMemo(() => {
    if (activeFilter === 'All') return meals;
    return meals.filter(m => {
      const cat = m.category.toLowerCase();
      const sub = m.subCategory?.toLowerCase() || '';
      const tags = m.tags?.map(t => t.toLowerCase()) || [];

      if (activeFilter === 'Veg') return cat === 'vegetarian';
      if (activeFilter === 'Non-Veg') return cat === 'non_vegetarian';
      if (activeFilter === 'Jain') return sub === 'jain' || tags.includes('jain');
      if (activeFilter === 'Vegan') return sub === 'vegan' || tags.includes('vegan');
      if (activeFilter === 'Low Calorie') return sub === 'low_calorie' || tags.includes('low_calorie');
      if (activeFilter === 'Kids') return sub === 'kids' || tags.includes('kids');
      return true;
    });
  }, [meals, activeFilter]);

  const vegMeals = filteredMeals.filter(m => m.category.toLowerCase() === 'vegetarian');
  const nonVegMeals = filteredMeals.filter(m => m.category.toLowerCase() === 'non_vegetarian');

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--app-bg)]">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-black uppercase tracking-widest text-slate-500">Preparing Culinary Options...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-60 bg-[var(--app-bg)] text-[var(--app-text)]">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 italic">
            Gourmet <span className="text-primary">Dining</span> Selection
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto font-bold">
            Curated in-flight menus tailored to your preferences. Experience premium culinary excellence at 35,000 feet.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {filters.map(f => (
            <FilterPill 
              key={f} 
              label={f} 
              active={activeFilter === f} 
              onClick={() => setActiveFilter(f)} 
            />
          ))}
        </div>

        {passengers.map((p, pIdx) => (
          <div key={pIdx} className="mb-24 last:mb-0">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">
                {pIdx + 1}
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">{p.name || `Passenger ${pIdx + 1}`}</h2>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Select Meals for this passenger</span>
              </div>
            </div>

            {/* No Meal Option */}
            <div 
              onClick={() => handleNoMeal(pIdx)}
              className={`mb-8 p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                noMealSelection[pIdx] 
                  ? 'border-primary bg-primary/5' 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  noMealSelection[pIdx] ? 'border-primary bg-primary' : 'border-slate-500'
                }`}>
                  {noMealSelection[pIdx] && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="font-bold text-sm uppercase tracking-wide">✕ No Meal — Free</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Standard snacks only</span>
            </div>

            <AnimatePresence mode="popLayout">
              {/* Vegetarian Section */}
              {(activeFilter === 'All' || activeFilter === 'Veg' || (activeFilter !== 'Non-Veg' && vegMeals.length > 0)) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="mb-16"
                >
                  <SectionHeader isVeg={true} label="Vegetarian" />
                  <div className="grid md:grid-cols-2 gap-8">
                    {vegMeals.map(meal => (
                      <MealCard 
                        key={meal.id} 
                        meal={meal} 
                        qty={selectedMeals[pIdx]?.[meal.id] || 0}
                        onUpdate={(delta) => updateQuantity(pIdx, meal.id, delta)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Non-Vegetarian Section */}
              {(activeFilter === 'All' || activeFilter === 'Non-Veg' || (activeFilter !== 'Veg' && nonVegMeals.length > 0)) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <SectionHeader isVeg={false} label="Non-Vegetarian" />
                  <div className="grid md:grid-cols-2 gap-8">
                    {nonVegMeals.map(meal => (
                      <MealCard 
                        key={meal.id} 
                        meal={meal} 
                        qty={selectedMeals[pIdx]?.[meal.id] || 0}
                        onUpdate={(delta) => updateQuantity(pIdx, meal.id, delta)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-8 bg-[var(--app-bg)]/80 backdrop-blur-2xl border-t border-white/10 z-50">
          <div className="container mx-auto max-w-6xl flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Culinary Cost</span>
              <span className="text-3xl font-black text-primary italic">
                ₹{calculateTotal.toLocaleString()}
              </span>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={onBack}
                className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs border border-white/10 hover:bg-white/5 transition-all"
              >
                Go Back
              </button>
              <button 
                onClick={() => {
                  const summaryMap = {};
                  passengers.forEach((_, i) => {
                    if (noMealSelection[i]) {
                      summaryMap[i] = 'SKIP';
                    } else {
                      const pMeals = selectedMeals[i] || {};
                      const summary = Object.entries(pMeals)
                        .map(([mId, qty]) => {
                          const meal = meals.find(m => m.id === mId);
                          return `${meal ? meal.name : mId} x${qty}`;
                        })
                        .join(', ');
                      summaryMap[i] = summary || 'SKIP';
                    }
                  });
                  onConfirm(summaryMap, calculateTotal);
                }}
                className="px-12 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
              >
                Confirm Meals & Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MealCard({ meal, qty, onUpdate }) {
  const isVeg = meal.category.toLowerCase() === 'vegetarian';
  const highlightColor = isVeg ? 'border-emerald-500/50' : 'border-rose-500/50';

  return (
    <div className={`group bg-white/5 rounded-[2rem] border-2 transition-all duration-500 overflow-hidden ${
      qty > 0 ? highlightColor : 'border-white/5 hover:border-white/10'
    }`}>
      {/* Image Area */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <MealImage 
          keyword={meal.imageKeyword} 
          category={meal.category} 
          alt={meal.name}
          className="w-full h-full"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {meal.tags?.includes('bestseller') && (
            <div className="bg-emerald-500 text-white px-3 py-1 rounded-lg flex items-center gap-2 shadow-lg">
              <Star size={10} fill="currentColor" />
              <span className="text-[9px] font-black uppercase tracking-wider">Bestseller</span>
            </div>
          )}
          {meal.tags?.includes('premium') && (
            <div className="bg-amber-400 text-black px-3 py-1 rounded-lg flex items-center gap-2 shadow-lg">
              <Crown size={10} fill="currentColor" />
              <span className="text-[9px] font-black uppercase tracking-wider text-black">Premium</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <FSSAISymbol isVeg={isVeg} />
          <h3 className="text-lg font-black uppercase tracking-tight">{meal.name}</h3>
        </div>
        
        <p className="text-xs text-slate-500 font-bold mb-6 line-clamp-2 leading-relaxed">
          {meal.description}
        </p>

        {/* Nutritional & Allergen Info */}
        <div className="py-4 border-y border-white/5 flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-400">
            <Flame size={14} className="text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">{meal.calories} kcal</span>
          </div>
          {meal.allergens && meal.allergens.length > 0 && (
            <div className="flex items-center gap-2 text-slate-400">
              <AlertCircle size={14} className="text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Contains {meal.allergens[0]}{meal.allergens.length > 1 ? '...' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Price</span>
            <span className="text-xl font-black text-white italic">
              ₹{(meal.price_inr || (meal.price_usd * 80)).toLocaleString()}
            </span>
          </div>

          {qty === 0 ? (
            <button 
              onClick={() => onUpdate(1)}
              className="px-6 py-3 bg-white/10 hover:bg-primary hover:text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all"
            >
              + Add Meal
            </button>
          ) : (
            <div className="flex items-center gap-4 bg-primary rounded-xl px-4 py-2 text-white shadow-lg shadow-primary/30 animate-in fade-in zoom-in duration-300">
              <button onClick={() => onUpdate(-1)} className="hover:scale-125 transition-transform">
                <Minus size={14} strokeWidth={4} />
              </button>
              <span className="text-sm font-black w-4 text-center">{qty}</span>
              <button onClick={() => onUpdate(1)} className="hover:scale-125 transition-transform">
                <Plus size={14} strokeWidth={4} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
