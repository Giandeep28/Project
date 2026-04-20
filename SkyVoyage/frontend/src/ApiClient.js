const BASE_URL = 'http://localhost:8080';

class ApiClient {
  static async request(endpoint, options = {}) {
    // 1. Prefix BASE_URL
    const url = `${BASE_URL}${endpoint}`;

    // 2. Setup standard headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // 3. Inject Authorization token if it exists
    const token = localStorage.getItem('token') || localStorage.getItem('sv_admin_token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    // 4. Perform the fetch
    const response = await fetch(url, config);
    let data;

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    try {
      data = await response.json();
    } catch {
      throw new Error(`Invalid JSON response from server (Status: ${response.status})`);
    }

    // 5. Check OK status
    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP Error ${response.status}`);
    }

    return data;
  }

  // ── Flight Searching ──────────────────────────────────────────────────
  static async searchFlights({ origin, dest, date, guests, mode }) {
    if (!origin || !dest) return { flights: [] };
    const p = new URLSearchParams();
    p.append('origin', origin);
    p.append('dest', dest);
    if (date) p.append('date', date);
    if (guests) p.append('guests', guests);
    if (mode) p.append('mode', mode);
    
    return this.request(`/api/flights?${p.toString()}`);
  }

  // ── Bookings ────────────────────────────────────────────────────────
  static async createBooking(payload) {
    return this.request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  static async getBooking(id) {
    return this.request(`/api/bookings/${id}`);
  }

  static async listBookings() {
    return this.request('/api/bookings');
  }

  // ── Auth ────────────────────────────────────────────────────────────
  static async login(email, password) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    // Optional utility: store token on success directly if preferred,
    // though the prompt says to do it in Login.jsx. We'll let Login do it.
    return data;
  }

  static async register(email, password, name, phone) {
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, phone }),
    });
    return data;
  }

  static async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('sv_admin_token');
    }
  }

  static async getMe() {
    return this.request('/api/auth/me');
  }

  // ── Generic ─────────────────────────────────────────────────────────
  static async searchAirports(query) {
    return this.request(`/api/airports?q=${encodeURIComponent(query)}`);
  }
}

export default ApiClient;
