const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authMiddleware = require('./middleware/authMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const fastRoutes = require('./routes/fastRoutes');
const weightRoutes = require('./routes/weightRoutes');
const journeyRoutes = require('./routes/journeyRoutes');
const goalRoutes = require('./routes/goalRoutes');
const progressRoutes = require('./routes/progressRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// CORS Configuration
const corsOptions = {
  origin: [
    'https://fastnjoy.vercel.app',
    'https://fastnjoy-8nnuhzv4u-lingamvamshikrishnareddys-projects.vercel.app',
    'https://fastnjoy-1og5ot44t-lingamvamshikrishnareddys-projects.vercel.app',
    'https://fasting-zeta.vercel.app',
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Additional CORS headers middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (corsOptions.origin.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Add this to your server.js for better error tracking
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    body: req.body
  });
  
  res.status(500).json({
    message: 'Server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Protected API routes
app.use('/api/auth', authRoutes);
app.use('/api/fasts', authMiddleware, fastRoutes);
app.use('/api/weights', authMiddleware, weightRoutes);
app.use('/api/goals', authMiddleware, goalRoutes);
app.use('/api/progress', authMiddleware, progressRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/journeys', journeyRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}




// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
