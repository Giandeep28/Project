const BASE_URL = 'http://localhost:8080';
const PYTHON_BASE_URL = 'http://localhost:8000';

export const ApiClient = {
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    const token = localStorage.getItem('token') || localStorage.getItem('sv_admin_token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = { ...options, headers };
    const response = await fetch(url, config);
    if (response.status === 204) return null;
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || `HTTP Error ${response.status}`);
    return data;
  },

  // ── Java Backend Calls ──────────────────────────────────────────────────
  searchFlights: async ({ origin, dest, date, guests }) => {
    const p = new URLSearchParams();
    if (origin) p.append('origin', origin);
    if (dest) p.append('dest', dest);
    if (date) p.append('date', date);
    if (guests) p.append('guests', guests);
    return ApiClient.request(`/api/flights?${p.toString()}`);
  },

  createBooking: async (payload) => {
    return ApiClient.request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getBooking: async (id) => {
    return ApiClient.request(`/api/bookings/${id}`);
  },

  getAdminBookings: async () => {
    return ApiClient.request('/api/bookings');
  },

  searchAirports: async (query) => {
    return ApiClient.request(`/api/airports?q=${encodeURIComponent(query)}`);
  },

  getHealth: async () => {
    const javaHealth = await fetch(`${BASE_URL}/api/health`).then(r => r.json()).catch(() => ({ status: 'DOWN' }));
    const pythonHealth = await fetch(`${PYTHON_BASE_URL}/health`).then(r => r.json()).catch(() => ({ status: 'DOWN' }));
    return { java: javaHealth, python: pythonHealth };
  },

  // ── Auth ────────────────────────────────────────────────────────────
  login: async (email, password) => {
    return ApiClient.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (email, password, name, phone) => {
    return ApiClient.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, phone }),
    });
  },

  getMe: async () => {
    return ApiClient.request('/api/auth/me');
  },

  // ── Python AI Calls ──────────────────────────────────────────────────
  sendChatMessage: async (message) => {
    return ApiClient.request(`${PYTHON_BASE_URL}/api/chatbot/message`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }
};

export default ApiClient;
