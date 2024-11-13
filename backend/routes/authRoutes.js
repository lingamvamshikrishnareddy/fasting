// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { message: 'Too many attempts, please try again later' },
  skipSuccessfulRequests: true
});

// Define routes with proper callback functions
router.post('/register', authController.register);
router.post('/login', authLimiter, authController.login);
router.get('/user', authMiddleware, authController.getUser);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
