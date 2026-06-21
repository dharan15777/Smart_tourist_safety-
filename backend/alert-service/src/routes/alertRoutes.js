const express = require('express');
const router = express.Router();
const {
  createPanic,
  createGeoFence,
  getAlerts,
  getAlert,
  acknowledgeAlert,
  resolveAlert,
  generateFIR,
  getStats
} = require('../controllers/alertController');

// Create alerts
router.post('/panic',            createPanic);
router.post('/geofence',         createGeoFence);

// Get alerts
router.get('/',                  getAlerts);
router.get('/stats',             getStats);
router.get('/:alertId',          getAlert);

// Update alerts
router.put('/:alertId/acknowledge', acknowledgeAlert);
router.put('/:alertId/resolve',     resolveAlert);

// Generate FIR
router.post('/:alertId/fir',     generateFIR);

module.exports = router;