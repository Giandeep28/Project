const JAVA_API_BASE = 'http://localhost:8080/api';
const PYTHON_API_BASE = 'http://localhost:8000/api';

export const ApiClient = {
  // Java Backend Calls
  getFlights: async (from = 'DEL', to = 'BOM', date = '') => {
    const url = new URL(`${JAVA_API_BASE}/flights`);
    if (from) url.searchParams.append('from', from);
    if (to) url.searchParams.append('to', to);
    if (date) url.searchParams.append('date', date);
    
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Celestial Engine Stall');
    return response.json();
  },


  bookFlight: async (bookingData) => {
    const response = await fetch(`${JAVA_API_BASE}/bookFlight`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    return response.json();
  },

  getHealth: async () => {
    const javaHealth = await fetch(`${JAVA_API_BASE}/health`).then(r => r.json()).catch(() => ({ status: 'DOWN' }));
    const pythonHealth = await fetch(`${PYTHON_API_BASE.replace('/api', '')}/health`).then(r => r.json()).catch(() => ({ status: 'DOWN' }));
    return { java: javaHealth, python: pythonHealth };
  },

  getAdminBookings: async () => {
    const token = localStorage.getItem('sv_admin_token');
    const response = await fetch(`${JAVA_API_BASE}/bookFlight`, { // Aligned GET with BookingController
      headers: { 
        'Authorization': token || 'V_LOG_ADMIN_SECURE', // Simulated for prototype
        'Content-Type': 'application/json' 
      }
    });
    return response.json();
  },

  // Python AI Calls
  sendChatMessage: async (message) => {
    const response = await fetch(`${PYTHON_API_BASE}/chatbot/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    return response.json();
  }
};
