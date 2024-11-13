import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://fasting-zeta.vercel.app/api';

// Custom error class for API errors
class APIError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
  }
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true,
});

// Request interceptor with enhanced error logging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Log outgoing requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Request:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
      });
    }
    return config;
  },
  (error) => {
    console.error('📡 Request configuration error:', {
      message: error.message,
      stack: error.stack,
    });
    return Promise.reject(error);
  }
);

// Response interceptor with comprehensive error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Response:', {
        status: response.status,
        url: response.config.url,
        method: response.config.method,
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors and CORS issues
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      console.error('🔴 Network/CORS Error:', {
        message: error.message,
        code: error.code,
        config: {
          url: originalRequest.url,
          method: originalRequest.method,
          headers: originalRequest.headers,
        },
      });
      throw new APIError(
        'Unable to connect to the server. Please check your internet connection and try again.',
        0,
        'NETWORK_ERROR'
      );
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout:', {
        url: originalRequest.url,
        timeout: originalRequest.timeout,
      });
      throw new APIError(
        'Request timed out. Please try again.',
        0,
        'TIMEOUT_ERROR'
      );
    }

    // Handle authentication errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn('🔑 Authentication failed, redirecting to login');
      originalRequest._retry = true;
      localStorage.removeItem('token');
      window.location = '/login';
      throw new APIError('Session expired. Please log in again.', 401, 'AUTH_ERROR');
    }

    // Log other errors with detailed information
    console.error('❌ API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: originalRequest.url,
      method: originalRequest.method,
      timestamp: new Date().toISOString(),
    });

    return Promise.reject(error);
  }
);

// Enhanced error handler with retry capability
const handleApiError = async (error, customMessage, retryCount = 1) => {
  const retry = async (attempt = 0) => {
    try {
      if (attempt >= retryCount) throw error;
      console.log(`🔄 Retrying request (${attempt + 1}/${retryCount})`);
      const response = await error.config;
      return response;
    } catch (retryError) {
      if (attempt + 1 < retryCount) return retry(attempt + 1);
      throw retryError;
    }
  };

  if (error.response?.status >= 500 && retryCount > 0) {
    return retry();
  }

  const errorMessage = error.response?.data?.message || error.message || customMessage;
  throw new APIError(errorMessage, error.response?.status, error.code);
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

// Dashboard endpoints with retry logic
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch dashboard stats', 2); // Retry twice
  }
};

export default api;
