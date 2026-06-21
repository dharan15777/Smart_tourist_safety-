const express = require('express');
const router = express.Router();
const {
  updateLocation,
  getHistory,
  getAllLocations,
  addZone,
  getZones
} = require('../controllers/trackingController');

// Location routes
router.post('/update',        updateLocation);
router.get('/all',            getAllLocations);
router.get('/:userId',        getHistory);

// Risk zone routes
router.post('/zones/add',     addZone);
router.get('/zones/all',      getZones);

module.exports = router;