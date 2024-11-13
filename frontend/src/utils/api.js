import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://fasting-zeta.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000,
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response) {
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        localStorage.removeItem('token');
        window.location = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// Error handler
const handleApiError = (error, customMessage) => {
  const errorMessage = error.response?.data?.message || error.message || customMessage;
  console.error(customMessage, error);
  throw new Error(errorMessage);
};

// Auth endpoints
export const register = (userData) => 
  api.post('/auth/register', userData)
    .catch(error => handleApiError(error, 'Registration failed'));

export const login = (credentials) => 
  api.post('/auth/login', credentials)
    .catch(error => handleApiError(error, 'Login failed'));

export const logout = () => 
  api.post('/auth/logout')
    .catch(error => handleApiError(error, 'Logout failed'));

export const getCurrentUser = () => 
  api.get('/auth/user')
    .catch(error => handleApiError(error, 'Failed to fetch user data'));

// Journey endpoints
export const getUserJourneys = () => 
  api.get('/journeys')
    .catch(error => handleApiError(error, 'Failed to fetch user journeys'));

export const createJourney = (journeyData) => 
  api.post('/journeys', journeyData)
    .catch(error => handleApiError(error, 'Failed to create journey'));

export const updateJourney = (id, journeyData) => 
  api.put(`/journeys/${id}`, journeyData)
    .catch(error => handleApiError(error, 'Failed to update journey'));

// Fast tracking endpoints
export const getUserFasts = () => 
  api.get('/fasts/user')
    .catch(error => handleApiError(error, 'Failed to fetch user fasts'));

export const createFast = (fastData) => 
  api.post('/fasts', fastData)
    .catch(error => handleApiError(error, 'Failed to create fast'));

export const updateFast = (id, fastData) => 
  api.put(`/fasts/${id}`, fastData)
    .catch(error => handleApiError(error, 'Failed to update fast'));

export const deleteFast = (id) => 
  api.delete(`/fasts/${id}`)
    .catch(error => handleApiError(error, 'Failed to delete fast'));

// Weight tracking endpoints
export const addWeight = (data) => 
  api.post('/weights/add', data)
    .catch(error => handleApiError(error, 'Failed to add weight'));

export const getUserWeights = () => 
  api.get('/weights/user')
    .catch(error => handleApiError(error, 'Failed to fetch user weights'));

// Dashboard endpoints
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('First attempt to fetch dashboard stats failed, retrying...', error);
    try {
      // Retry once
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (retryError) {
      handleApiError(retryError, 'Failed to fetch dashboard stats');
    }
  }
};

export default api;
