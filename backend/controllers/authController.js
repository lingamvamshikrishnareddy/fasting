const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { email, password, username } = req.body;

      // Input validation
      if (!email || !password || !username) {
        return res.status(400).json({
          status: 'error',
          message: 'All fields are required'
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });
      
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'User already exists'
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = await User.create({
        email,
        username,
        password: hashedPassword
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Set HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            email: user.email,
            username: user.username
          }
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Error registering user'
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Input validation
      if (!email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Email and password are required'
        });
      }

      // Find user
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Set HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return res.json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            email: user.email,
            username: user.username
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Error logging in'
      });
    }
  },

  // Get user profile
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      return res.json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      console.error('Get user error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Error fetching user'
      });
    }
  },

  // Logout user
  logout: (req, res) => {
    try {
      // Clear the token cookie
      res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0)
      });

      return res.json({
        status: 'success',
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Error logging out'
      });
    }
  }
};

module.exports = authController;
