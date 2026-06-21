const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  getAllUsers
} = require('../controllers/authController');

const { 
  protect, 
  policeOnly 
} = require('../middleware/protect');

// Public routes
router.post('/register', register);
router.post('/login',    login);

// Protected routes
router.get('/profile',   protect, getProfile);

// Police/Admin routes
router.get('/users',     protect, policeOnly, getAllUsers);

module.exports = router;