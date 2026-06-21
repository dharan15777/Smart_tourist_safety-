const express = require('express');
const router = express.Router();
const {
  createProfile,
  getProfile,
  getAllActive,
  verifyId,
  updateSafetyScore,
  updateLocation
} = require('../controllers/touristController');

// Create tourist profile + Digital ID
router.post('/create',          createProfile);

// Get all active tourists
router.get('/all',              getAllActive);

// Get single tourist profile
router.get('/:userId',          getProfile);

// Verify Digital ID
router.get('/verify/:uniqueId', verifyId);

// Update safety score
router.put('/safety-score',     updateSafetyScore);

// Update location
router.put('/location',         updateLocation);

module.exports = router;