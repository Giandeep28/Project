import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ApiClient from '../ApiClient';

export default function Login({ darkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all required email and password fields.');
      return;
    }
    
    if (isRegistering) {
      if (!name || !phone) {
        setError('Please fill in Name and Phone for registration.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      if (isRegistering) {
        await ApiClient.register(email, password, name, phone);
        // On success, reset to login view
        setIsRegistering(false);
        setPassword('');
        setConfirmPassword('');
        setName('');
        setPhone('');
        setError('Registration successful. Please sign in.');
      } else {
        const result = await ApiClient.login(email, password);
        // Valid login returns { id, email, role, token }
        if (result.token) {
          localStorage.setItem('sv_admin_token', result.token);
          localStorage.setItem('sv_admin_user', result.email);
          
          // Return to previous page if existed, else go home
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
        } else {
          throw new Error('Authentication failed (no token provided)');
        }
      }
    } catch (err) {
      setError(err.message || (isRegistering ? 'Registration failed' : 'Invalid credentials'));
    } finally {
      setLoading(false);
    }
  };

  const bg = darkMode ? '#0A0F1A' : '#f1f3f5';
  const cardBg = darkMode ? '#1C2333' : '#fff';
  const cardBdr = darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const text = darkMode ? '#f0ece4' : '#111827';
  const muted = darkMode ? '#9ca3af' : '#6b7280';
  const accent = '#C8A84B';
  const inputBg = darkMode ? '#111827' : '#f9fafb';
  const inputBdr = darkMode ? 'rgba(255,255,255,0.15)' : '#d1d5db';

  return (
    <div style={{ background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
      <div style={{ background: cardBg, border: `1px solid ${cardBdr}`, borderRadius: 20, padding: 40, width: '100%', maxWidth: 440, boxShadow: darkMode ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, background: accent, borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, fontFamily: '"Playfair Display",serif', textTransform: 'uppercase', color: text }}>
            {isRegistering ? 'Create Account' : 'Celestial Access'}
          </h1>
          <p style={{ fontSize: 13, color: muted, marginTop: 8 }}>
            {isRegistering ? 'Join the exclusive SkyVoyage network.' : 'Authorized personnel only.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {error && (
            <div style={{ background: '#ef4444', color: '#fff', padding: '12px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
              {error}
            </div>
          )}

          {isRegistering && (
            <>
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: accent, marginBottom: 8 }}>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  style={{ width: '100%', background: inputBg, border: `1px solid ${inputBdr}`, color: text, padding: '14px 16px', borderRadius: 10, outline: 'none', fontSize: 15 }}
                />
              </div>
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: accent, marginBottom: 8 }}>Phone Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  style={{ width: '100%', background: inputBg, border: `1px solid ${inputBdr}`, color: text, padding: '14px 16px', borderRadius: 10, outline: 'none', fontSize: 15 }}
                />
              </div>
            </>
          )}
          
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: accent, marginBottom: 8 }}>Agent Email</label>
            <input 
              type="text" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{ width: '100%', background: inputBg, border: `1px solid ${inputBdr}`, color: text, padding: '14px 16px', borderRadius: 10, outline: 'none', fontSize: 15 }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: accent, marginBottom: 8 }}>Security Key</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{ width: '100%', background: inputBg, border: `1px solid ${inputBdr}`, color: text, padding: '14px 16px', borderRadius: 10, outline: 'none', fontSize: 15 }}
            />
          </div>
          
          {isRegistering && (
            <div style={{ animation: 'fadeIn 0.2s ease' }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: accent, marginBottom: 8 }}>Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                style={{ width: '100%', background: inputBg, border: `1px solid ${inputBdr}`, color: text, padding: '14px 16px', borderRadius: 10, outline: 'none', fontSize: 15 }}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '16px 0', background: loading ? '#9ca3af' : accent, color: loading ? '#fff' : '#000', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: loading ? 'not-allowed' : 'pointer', transition: '0.2s', marginTop: 8 }}
          >
            {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Sign In')}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: 12 }}>
             <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(null); }} style={{ background: 'transparent', border: 'none', color: muted, fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
                {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Register"}
             </button>
          </div>
        </form>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
