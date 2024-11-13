import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://fasting-zeta.vercel.app/api';

// Custom error class for API errors with additional context
class APIError extends Error {
  constructor(message, status, code, details = {}) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

// Error codes mapping for consistent error handling
const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true,
});

// Development environment logger
const devLogger = {
  log: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  error: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(...args);
    }
  }
};

// Request interceptor with enhanced logging and error handling
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    devLogger.log('🚀 Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
    });
    
    return config;
  },
  (error) => {
    devLogger.error('📡 Request configuration error:', {
      message: error.message,
      stack: error.stack,
    });
    return Promise.reject(
      new APIError(
        'Failed to setup request',
        0,
        ERROR_CODES.UNKNOWN_ERROR,
        { originalError: error }
      )
    );
  }
);

// Response interceptor with comprehensive error handling
api.interceptors.response.use(
  (response) => {
    devLogger.log('✅ Response:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors and CORS issues
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      devLogger.error('🔴 Network/CORS Error:', {
        message: error.message,
        code: error.code,
        config: {
          url: originalRequest.url,
          method: originalRequest.method,
        },
      });
      
      throw new APIError(
        'Unable to connect to the server. Please check your internet connection.',
        0,
        ERROR_CODES.NETWORK_ERROR,
        { originalError: error }
      );
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      devLogger.error('⏰ Request timeout:', {
        url: originalRequest.url,
        timeout: originalRequest.timeout,
      });
      
      throw new APIError(
        'Request timed out. Please try again.',
        0,
        ERROR_CODES.TIMEOUT_ERROR,
        { originalError: error }
      );
    }

    // Handle authentication errors with automatic redirect
    if (error.response?.status === 401 && !originalRequest._retry) {
      devLogger.warn('🔑 Authentication failed, redirecting to login');
      localStorage.removeItem('token');
      
      // Allow for custom redirect handling
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:expired'));
        window.location = '/login';
      }
      
      throw new APIError(
        'Session expired. Please log in again.',
        401,
        ERROR_CODES.AUTH_ERROR
      );
    }

    // Handle validation errors
    if (error.response?.status === 422) {
      throw new APIError(
        'Validation failed. Please check your input.',
        422,
        ERROR_CODES.VALIDATION_ERROR,
        { validationErrors: error.response.data.errors }
      );
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      throw new APIError(
        'Server error. Please try again later.',
        error.response.status,
        ERROR_CODES.SERVER_ERROR,
        { serverError: error.response.data }
      );
    }

    devLogger.error('❌ API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: originalRequest.url,
      method: originalRequest.method,
      timestamp: new Date().toISOString(),
    });

    return Promise.reject(error);
  }
);

// Enhanced error handler with retry capability and backoff
const handleApiError = async (error, customMessage, options = {}) => {
  const {
    retryCount = 1,
    retryDelay = 1000,
    shouldRetry = (error) => error.response?.status >= 500
  } = options;

  const retry = async (attempt = 0) => {
    try {
      if (attempt >= retryCount) throw error;
      
      const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
      devLogger.log(`🔄 Retrying request (${attempt + 1}/${retryCount}) after ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      const response = await axios(error.config);
      return response;
    } catch (retryError) {
      if (attempt + 1 < retryCount) return retry(attempt + 1);
      throw retryError;
    }
  };

  if (shouldRetry(error) && retryCount > 0) {
    return retry();
  }

  const errorMessage = error.response?.data?.message || error.message || customMessage;
  throw new APIError(
    errorMessage,
    error.response?.status,
    error.code || ERROR_CODES.UNKNOWN_ERROR,
    { originalError: error }
  );
};

// API endpoints with consistent error handling
const createEndpoint = (method, path, errorMessage) => async (data, config = {}) => {
  try {
    const response = await api[method](path, data, config);
    return response.data;
  } catch (error) {
    return handleApiError(error, errorMessage, config.retryOptions);
  }
};

// Auth endpoints
export const auth = {
  register: createEndpoint('post', '/auth/register', 'Registration failed'),
  login: createEndpoint('post', '/auth/login', 'Login failed'),
  logout: createEndpoint('post', '/auth/logout', 'Logout failed'),
  getCurrentUser: createEndpoint('get', '/auth/user', 'Failed to fetch user data')
};

// Journey endpoints
export const journeys = {
  getAll: createEndpoint('get', '/journeys', 'Failed to fetch user journeys'),
  create: createEndpoint('post', '/journeys', 'Failed to create journey'),
  update: (id, data) => createEndpoint('put', `/journeys/${id}`, 'Failed to update journey')(data),
  delete: (id) => createEndpoint('delete', `/journeys/${id}`, 'Failed to delete journey')()
};

// Fast tracking endpoints
export const fasts = {
  getAll: createEndpoint('get', '/fasts/user', 'Failed to fetch user fasts'),
  create: createEndpoint('post', '/fasts', 'Failed to create fast'),
  update: (id, data) => createEndpoint('put', `/fasts/${id}`, 'Failed to update fast')(data),
  delete: (id) => createEndpoint('delete', `/fasts/${id}`, 'Failed to delete fast')()
};

// Weight tracking endpoints
export const weights = {
  add: createEndpoint('post', '/weights/add', 'Failed to add weight'),
  getAll: createEndpoint('get', '/weights/user', 'Failed to fetch user weights')
};

// Dashboard endpoints with enhanced retry options
export const dashboard = {
  getStats: createEndpoint('get', '/dashboard/stats', 'Failed to fetch dashboard stats', {
    retryOptions: {
      retryCount: 2,
      retryDelay: 1000,
      shouldRetry: (error) => error.response?.status >= 500
    }
  })
};

export { api as default, APIError, ERROR_CODES };
