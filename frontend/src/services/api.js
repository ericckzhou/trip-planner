// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH SERVICES
// ============================================

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
};

// ============================================
// TRIP SERVICES
// ============================================

export const tripService = {
  createTrip: (data) => api.post('/trips', data),
  getTrips: (status) => api.get('/trips', { params: { status } }),
  getTrip: (id) => api.get(`/trips/${id}`),
  updateTrip: (id, data) => api.put(`/trips/${id}`, data),
  deleteTrip: (id) => api.delete(`/trips/${id}`),
  addItineraryItem: (tripId, data) => api.post(`/trips/${tripId}/itinerary`, data),
  updateItineraryItem: (tripId, itemId, data) =>
    api.put(`/trips/${tripId}/itinerary/${itemId}`, data),
  deleteItineraryItem: (tripId, itemId) =>
    api.delete(`/trips/${tripId}/itinerary/${itemId}`),
  saveTrip: (tripId) => api.post(`/trips/${tripId}/save`),
  unsaveTrip: (tripId) => api.post(`/trips/${tripId}/unsave`),
};

// ============================================
// DESTINATION SERVICES
// ============================================

export const destinationService = {
  searchDestination: (city) =>
    api.get('/destinations/search', { params: { city } }),
  getTrendingDestinations: (limit = 10) =>
    api.get('/destinations/trending', { params: { limit } }),
  getDestinationDetails: (id) => api.get(`/destinations/${id}`),
};

export default api;
