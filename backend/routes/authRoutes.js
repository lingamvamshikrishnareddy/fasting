const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  logout,
  getUser 
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window per IP
  message: { 
    message: 'Too many attempts, please try again later' 
  }
});

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/user', authMiddleware, getUser);



module.exports = router;