const LocationHistory = require('../models/LocationHistory');
const { checkGeoFence, addRiskZone, getAllZones } = require('../services/geoFenceService');
const axios = require('axios');

// Update Tourist Location
exports.updateLocation = async (req, res) => {
  try {
    const {
      userId, name, phone,
      lat, lng, address, accuracy
    } = req.body;

    // Save location history
    await LocationHistory.findOneAndUpdate(
      { userId },
      {
        name,
        phone,
        lastUpdated: new Date(),
        $push: {
          locations: {
            $each: [{ lat, lng, address, accuracy }],
            $slice: -100
          }
        }
      },
      { upsert: true, new: true }
    );

    // Check geo-fences
    const enteredZones = await checkGeoFence(lat, lng);

    // If tourist entered risk zone - create alert
    if (enteredZones.length > 0) {
      for (const zone of enteredZones) {
        try {
          await axios.post(
            'http://localhost:3003/api/alerts/geofence',
            {
              tourist: { userId, name, phone },
              location: { lat, lng, address },
              zoneName:  zone.zoneName,
              riskLevel: zone.riskLevel,
            }
          );
        } catch (err) {
          console.log('Alert service error:', err.message);
        }
      }
    }

    // Emit location update to dashboard
    const io = req.app.get('io');
    if (io) {
      io.emit('location_update', {
        userId, name, lat, lng,
        timestamp:    new Date(),
        inRiskZone:   enteredZones.length > 0,
        enteredZones: enteredZones.map(z => z.zoneName)
      });
    }

    res.json({
      success: true,
      message: 'Location updated',
      enteredZones,
      inRiskZone: enteredZones.length > 0,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Location History
exports.getHistory = async (req, res) => {
  try {
    const history = await LocationHistory
      .findOne({ userId: req.params.userId });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: 'No location history found'
      });
    }

    res.json({
      success: true,
      userId:      history.userId,
      name:        history.name,
      locations:   history.locations,
      lastUpdated: history.lastUpdated,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Tourist Locations
exports.getAllLocations = async (req, res) => {
  try {
    const histories = await LocationHistory.find({});

    const locations = histories.map(h => ({
      userId:      h.userId,
      name:        h.name,
      phone:       h.phone,
      location:    h.locations[h.locations.length - 1] || null,
      lastUpdated: h.lastUpdated,
    })).filter(l => l.location !== null);

    res.json({
      success: true,
      count:   locations.length,
      locations
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add Risk Zone
exports.addZone = async (req, res) => {
  try {
    const zone = await addRiskZone(req.body);
    res.status(201).json({
      success: true,
      message: 'Risk zone added',
      zone
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Risk Zones
exports.getZones = async (req, res) => {
  try {
    const zones = await getAllZones();
    res.json({
      success: true,
      count:   zones.length,
      zones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};