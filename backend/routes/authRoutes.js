// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getUser, logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { message: 'Too many attempts, please try again later' },
  skipSuccessfulRequests: true
});

// Define routes with properly destructured controller functions
router.post('/register', register);
router.post('/login', authLimiter, login);
router.get('/user', authMiddleware, getUser);
router.post('/logout', authMiddleware, logout);

module.exports = router;
