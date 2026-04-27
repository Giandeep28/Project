import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ApiClient } from '../services/ApiClient';
import { TrendingUp, Users, Activity, ShieldCheck, ArrowUpRight, ArrowDownRight, Terminal } from 'lucide-react';
import PriceDisplay from '../components/shared/PriceDisplay';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ java: 'DOWN', python: 'DOWN', yield: 0, totalBookings: 0 });
  const [bookings, setBookings] = useState([]);
  const [adminName, setAdminName] = useState('Alexander');

  useEffect(() => {
    setAdminName(localStorage.getItem('sv_admin_user') || 'Alexander');
    
    async function fetchData() {
      try {
        const health = await ApiClient.getHealth();
        const bookingData = await ApiClient.getAdminBookings();
        
        if (bookingData.status === 'success') {
          setBookings(bookingData.bookings || []);
          const total = (bookingData.bookings || []).reduce((acc, b) => acc + (b.amount || 0), 0);
          setStats({ 
            java: health.java.status || 'DOWN', 
            python: health.python.status || 'DOWN',
            yield: total,
            totalBookings: (bookingData.bookings || []).length
          });
        } else {
          setStats(prev => ({ ...prev, java: health.java.status || 'DOWN', python: health.python.status || 'DOWN' }));
        }
      } catch (err) {
        console.error('Core Sync Failure:', err);
      }
    }
    
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-6 lg:px-12 py-32">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-primary font-black uppercase tracking-[4px] text-[10px]">Command Center</span>
            <h2 className="text-5xl font-black uppercase mt-4 italic tracking-tighter">System Overview</h2>
          </div>
          <div className="bg-white/5 p-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Admin Verified: {adminName}
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid lg:grid-cols-4 gap-6 mb-12">
          <div className="glass-panel p-8 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Java Core</span>
              <span className={`px-3 py-1 rounded-full text-[8px] font-black ${stats.java === 'UP' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{stats.java}</span>
            </div>
            <p className="text-3xl font-black mt-2 text-primary italic">Port 8080</p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-green-500"><Terminal size={12} /> Established</div>
          </div>
          <div className="glass-panel p-8 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Python AI</span>
              <span className={`px-3 py-1 rounded-full text-[8px] font-black ${['ok', 'UP', 'celestial'].includes(stats.python) ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{stats.python}</span>
            </div>
            <p className="text-3xl font-black mt-2 italic">Port 8000</p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-500"><Activity size={12} /> Neural Ready</div>
          </div>
          <div className="glass-panel p-8 rounded-3xl">
            <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Fleet Yield</span>
            <p className="text-3xl font-black mt-2 italic"><PriceDisplay amount={stats.yield} /></p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-primary"><ArrowUpRight size={12} /> +{stats.totalBookings > 0 ? 'Live' : '0'} Data Sync</div>
          </div>
          <div className="glass-panel p-8 rounded-3xl">
            <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Active Voyagers</span>
            <p className="text-3xl font-black mt-2 italic">{stats.totalBookings}</p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-500"><ShieldCheck size={12} /> Secure Manifest</div>
          </div>
        </div>

        {/* Mission Table */}
        <div className="glass-panel rounded-[40px] overflow-hidden border-white/5 bg-white/5">
          <div className="p-10 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xl font-black uppercase italic tracking-widest">Celestial Mission Log</h3>
            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Export Trajectories</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[2px] text-slate-500">
                <tr>
                  <th className="p-8">Voyager</th>
                  <th className="p-8">Route</th>
                  <th className="p-8">Fleet ID</th>
                  <th className="p-8">Tier</th>
                  <th className="p-8">Yield</th>
                  <th className="p-8">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs font-bold divide-y divide-white/5 text-[var(--text-primary)]">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500 uppercase tracking-widest font-black py-20">No celestial missions detected in current cycle</td>
                  </tr>
                ) : (
                  bookings.map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="p-8">Voyager #{row.bookingId?.slice(-4)}</td>
                      <td className="p-8">{row.from || '---'} ➔ {row.to || '---'}</td>
                      <td className="p-8 text-primary/60">{row.flightId}</td>
                      <td className="p-8 text-primary uppercase">{row.seatId || 'STANDBY'}</td>
                      <td className="p-8 italic"><PriceDisplay amount={row.amount || 0} /></td>
                      <td className="p-8">
                        <span className={`px-3 py-1 bg-white/5 rounded-full text-[9px] uppercase font-black text-green-500`}>
                          AUTHORIZED
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
