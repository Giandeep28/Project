import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar        from './components/layout/Navbar';
import Footer        from './components/layout/Footer';
import { AppProvider } from './context/AppContext';
import Home          from './pages/Home';
import Login         from './pages/Login';
import SearchResults from './pages/SearchResults';
import Booking       from './pages/Booking';
import Confirmation  from './pages/Confirmation';
import Loyalty       from './pages/Loyalty';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/shared/ProtectedRoute';

function Layout() {
  const [dark, setDark] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sv_dark') ?? 'true'); } catch { return true; }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('sv_dark', JSON.stringify(dark));
  }, [dark]);

  // Derive a synthetic user object from localStorage token
  const token = localStorage.getItem('sv_admin_token');
  const user = token ? { role: 'admin', name: localStorage.getItem('sv_admin_user') || 'Admin' } : null;

  return (
    <div className={dark ? 'dark' : ''}>
      <div style={{ minHeight:'100vh', background: dark ? '#0A0F1A' : '#ffffff', color: dark ? '#f0ece4' : '#111827', transition:'background 0.3s, color 0.3s' }}>
        <Navbar darkMode={dark} toggleDark={() => setDark(d => !d)} user={user}/>
        <Routes>
          <Route path="/"          element={<Home darkMode={dark}/>}/>
          <Route path="/login"     element={<Login darkMode={dark}/>}/>
          <Route path="/flights"   element={<SearchResults darkMode={dark}/>}/>
          <Route path="/loyalty"   element={<Loyalty darkMode={dark}/>}/>
          <Route path="/results"   element={<SearchResults darkMode={dark}/>}/>
          <Route path="/booking"   element={<ProtectedRoute><Booking darkMode={dark}/></ProtectedRoute>}/>
          <Route path="/booking/*" element={<ProtectedRoute><Booking darkMode={dark}/></ProtectedRoute>}/>
          <Route path="/confirmation" element={<ProtectedRoute><Confirmation darkMode={dark}/></ProtectedRoute>}/>
          <Route path="/admin"     element={<ProtectedRoute><AdminDashboard darkMode={dark}/></ProtectedRoute>}/>
        </Routes>
        <Footer/>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout/>
      </AppProvider>
    </BrowserRouter>
  );
}
