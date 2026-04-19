import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Professional Mock Bypass for MNC Testing
    if (credentials.username === 'ADMIN' && credentials.password === 'SKYVOYAGE') {
      setTimeout(() => {
        localStorage.setItem('sv_admin_token', 'MOCK_ELITE_TOKEN_V2');
        localStorage.setItem('sv_admin_user', 'Voyager Elite');
        navigate('/admin');
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('sv_admin_token', data.token);
        localStorage.setItem('sv_admin_user', data.user);
        navigate('/admin');
      } else {
        setError(data.message || 'Invalid mission credentials');
      }
    } catch (err) {
      setError('Communication with Core Java failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="text-primary" size={32} />
          </div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-[var(--app-text)] mb-2">Command Center</h1>
          <p className="text-[10px] font-black uppercase tracking-[4px] text-slate-500">Authorization Required</p>
        </div>

        <form onSubmit={handleLogin} className="glass-panel p-10 rounded-[40px] space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="MISSION ID"
                required
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] p-5 pl-14 rounded-2xl font-bold outline-none focus:border-primary transition-all text-[var(--app-text)] placeholder:text-[var(--app-text)] placeholder:opacity-50 text-xs uppercase tracking-widest"
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="ACCESS KEY"
                required
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] p-5 pl-14 rounded-2xl font-bold outline-none focus:border-primary transition-all text-[var(--app-text)] placeholder:text-[var(--app-text)] placeholder:opacity-50 text-xs tracking-widest"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-500 uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-dark py-6 rounded-2xl font-black text-xs uppercase tracking-[3px] shadow-2xl hover:bg-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <>Initialize Authorization <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="mt-8 text-center text-[9px] font-bold text-slate-700 uppercase tracking-[3px]">
          Classified Information • Strictly Personnel Only
        </p>
      </div>
    </div>
  );
}
