// Geo-Fence Detection Service

const RiskZone = require('../models/RiskZone');

// Calculate distance between two points (Haversine formula)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Check if tourist is inside any risk zone
const checkGeoFence = async (lat, lng) => {
  try {
    const zones = await RiskZone.find({ isActive: true });
    const alerts = [];

    for (const zone of zones) {
      const distance = calculateDistance(
        lat, lng,
        zone.center.lat, zone.center.lng
      );

      if (distance <= zone.radius) {
        alerts.push({
          zoneName:    zone.name,
          riskLevel:   zone.riskLevel,
          distance:    distance.toFixed(2),
          lat:         zone.center.lat,
          lng:         zone.center.lng,
          radius:      zone.radius,
          message:     `Tourist is ${distance.toFixed(2)}km from ${zone.name} center`,
        });
      }
    }

    return alerts;

  } catch (error) {
    throw new Error('Geo-fence check failed: ' + error.message);
  }
};

// Add Risk Zone
const addRiskZone = async (zoneData) => {
  try {
    const zone = await RiskZone.create(zoneData);
    return zone;
  } catch (error) {
    throw new Error('Failed to add risk zone: ' + error.message);
  }
};

// Get All Risk Zones
const getAllZones = async () => {
  try {
    const zones = await RiskZone.find({ isActive: true });
    return zones;
  } catch (error) {
    throw new Error('Failed to get zones: ' + error.message);
  }
};

module.exports = {
  calculateDistance,
  checkGeoFence,
  addRiskZone,
  getAllZones
};