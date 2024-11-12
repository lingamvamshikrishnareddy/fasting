import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Add timeout to prevent hanging requests
  timeout: 10000
});

// Request interceptor with error handling
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          window.location = '/login';
          break;
        case 403:
          console.error('Forbidden access:', error.response.data);
          break;
        case 404:
          console.error('Resource not found:', error.response.data);
          break;
        case 500:
          console.error('Server error:', error.response.data);
          break;
        default:
          console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
const handleApiError = (error, customMessage) => {
  const errorMessage = error.response?.data?.message || error.message || customMessage;
  console.error(customMessage, error);
  throw new Error(errorMessage);
};

// Authentication endpoints
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

// Journey and Fasting synchronized operations
export const startFast = async (data) => {
  try {
    const fastResponse = await api.post('/fasts/start', data);
    
    // Create corresponding journey with retry logic
    let journeyResponse = null;
    try {
      journeyResponse = await createJourney({
        startTime: data.startTime,
        targetHours: data.targetHours,
        fastId: fastResponse.data._id // Link journey to fast
      });
    } catch (journeyError) {
      console.error('Failed to create journey, retrying...', journeyError);
      // Retry journey creation once
      journeyResponse = await createJourney({
        startTime: data.startTime,
        targetHours: data.targetHours,
        fastId: fastResponse.data._id
      });
    }

    return {
      fast: fastResponse.data,
      journey: journeyResponse.data
    };
  } catch (error) {
    handleApiError(error, 'Failed to start fast');
  }
};

export const endFast = async (fastId) => {
  try {
    const fastResponse = await api.put(`/fasts/end/${fastId}`);
    const journeys = await getUserJourneys();
    
    // Find matching journey using fastId or startTime
    const matchingJourney = journeys.data.find(journey => 
      journey.fastId === fastId || 
      new Date(journey.startTime).getTime() === new Date(fastResponse.data.startTime).getTime()
    );

    if (matchingJourney) {
      await updateJourney(matchingJourney._id, {
        endTime: fastResponse.data.endTime,
        completed: true,
        duration: new Date(fastResponse.data.endTime) - new Date(matchingJourney.startTime)
      });
    }

    return fastResponse;
  } catch (error) {
    handleApiError(error, 'Failed to end fast');
  }
};

export const getUserFasts = () => 
  api.get('/fasts/user')
    .catch(error => handleApiError(error, 'Failed to fetch user fasts'));

export const getCurrentFast = () => 
  api.get('/fasts/current')
    .catch(error => handleApiError(error, 'Failed to fetch current fast'));

export const getUserJourneys = () => 
  api.get('/journeys')
    .catch(error => handleApiError(error, 'Failed to fetch user journeys'));

export const createJourney = (journeyData) => 
  api.post('/journeys', journeyData)
    .catch(error => handleApiError(error, 'Failed to create journey'));

export const updateJourney = (id, journeyData) => 
  api.put(`/journeys/${id}`, journeyData)
    .catch(error => handleApiError(error, 'Failed to update journey'));

// Weight tracking
export const addWeight = (data) => 
  api.post('/weights/add', data)
    .catch(error => handleApiError(error, 'Failed to add weight'));

export const getUserWeights = () => 
  api.get('/weights/user')
    .catch(error => handleApiError(error, 'Failed to fetch user weights'));

// Dashboard stats with retry logic
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