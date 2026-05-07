import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('weather_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Service
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// City Service
export const cityService = {
  getCities: async () => {
    const response = await api.get('/cities');
    return response.data;
  },
  addCity: async (name) => {
    const response = await api.post('/cities', { name });
    return response.data;
  },
  updateCity: async (id, updates) => {
    const response = await api.patch(`/cities/${id}`, updates);
    return response.data;
  },
  deleteCity: async (id) => {
    const response = await api.delete(`/cities/${id}`);
    return response.data;
  },
};

// Insight Service
export const insightService = {
  getInsights: async () => {
    const response = await api.get('/insights');
    return response.data;
  },
};

export default api;
