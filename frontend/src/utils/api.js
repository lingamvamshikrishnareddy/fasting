import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

// User authentication and management
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const logout = () => api.post('/auth/logout');
export const getCurrentUser = () => api.get('/auth/user');
export const updateProfile = (userData) => api.put('/auth/profile', userData);
export const changePassword = (passwordData) => api.put('/auth/change-password', passwordData);

// Fasting related API calls
export const startFast = (data) => api.post('/fasts/start', data);
export const endFast = (fastId) => api.put(`/fasts/end/${fastId}`);
export const updateFast = (fastId, data) => api.put(`/fasts/update/${fastId}`, data);
export const getUserFasts = () => api.get('/fasts/user');
export const getCurrentFast = () => api.get('/fasts/current');
export const getFastingStats = () => api.get('/fasts/stats'); // Added this line

// Weight related API calls
export const addWeight = (data) => api.post('/weights/add', data);
export const getUserWeights = () => api.get('/weights/user');

// Goals and progress tracking
export const setGoal = (goalData) => api.post('/goals', goalData);
export const updateGoal = (goalId, goalData) => api.put(`/goals/${goalId}`, goalData);
export const getGoals = () => api.get('/goals');
export const trackProgress = (progressData) => api.post('/progress', progressData);
export const getProgress = () => api.get('/progress');

// Dashboard stats
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const getUserJourneys = () => axios.get('/api/journeys');
export const createJourney = (journeyData) => axios.post('/api/journeys', journeyData);
export const updateJourney = (id, journeyData) => axios.put(`/api/journeys/${id}`, journeyData);
export const deleteJourney = (id) => axios.delete(`/api/journeys/${id}`);

export default api;