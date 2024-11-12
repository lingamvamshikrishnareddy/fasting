const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const fastRoutes = require('./routes/fastRoutes');
const weightRoutes = require('./routes/weightRoutes');
const journeyRoutes = require('./routes/journeyRoutes');
const goalRoutes = require('./routes/goalRoutes');
const progressRoutes = require('./routes/progressRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/fasts', authMiddleware, fastRoutes);
app.use('/api/weights', authMiddleware, weightRoutes);
app.use('/api/goals', authMiddleware, goalRoutes);
app.use('/api/progress', authMiddleware, progressRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/journeys', journeyRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
