const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authMiddleware = require('./middleware/authMiddleware');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');

const goalRoutes = require('./routes/goalRoutes');
const progressRoutes = require('./routes/progressRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const fastRoutes = require('./routes/fastRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  ...process.env.ADDITIONAL_ORIGINS ? process.env.ADDITIONAL_ORIGINS.split(',') : []
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || 
        origin.includes('vercel.app') || 
        origin.includes('onrender.com') || 
        origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'X-Request-ID'
  ],
  exposedHeaders: ['Set-Cookie', 'Authorization'],
  optionsSuccessStatus: 204
};

// Apply middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to the database
connectDB();

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/fasts', authMiddleware, fastRoutes);

app.use('/api/goals', authMiddleware, goalRoutes);
app.use('/api/progress', authMiddleware, progressRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Backend server is live',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Root route handler
app.get('/', (req, res) => {
  res.json({
    message: 'Backend server is live',
    version: '1.0.0',
    endpoints: '/api'
  });
});

// Global error handler for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ 
      status: 'error',
      message: 'Invalid JSON payload',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  next(err);
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    body: process.env.NODE_ENV === 'development' ? req.body : undefined,
    timestamp: new Date().toISOString()
  });

  // Handle CORS errors
  if (err.message && err.message.includes('not allowed by CORS')) {
    return res.status(403).json({
      status: 'error',
      message: 'CORS origin not allowed',
      allowedOrigins: process.env.NODE_ENV === 'development' ? allowedOrigins : undefined
    });
  }

  // Handle other errors
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;
