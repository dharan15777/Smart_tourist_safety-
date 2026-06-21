const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  alertId: {
    type: String,
    default: () => `ALT-${Date.now()}-${
      Math.random().toString(36).substr(2,5).toUpperCase()
    }`
  },

  alertType: {
    type: String,
    enum: [
      'PANIC',
      'GEO_FENCE',
      'INACTIVITY',
      'ROUTE_DEVIATION',
      'MISSING',
      'CUSTOM'
    ],
    required: true
  },

  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'HIGH'
  },

  tourist: {
    userId:    String,
    name:      String,
    phone:     String,
    digitalId: String,
  },

  location: {
    lat:       Number,
    lng:       Number,
    address:   String,
    timestamp: { type: Date, default: Date.now },
  },

  status: {
    type: String,
    enum: [
      'ACTIVE',
      'ACKNOWLEDGED',
      'RESOLVED',
      'FALSE_ALARM'
    ],
    default: 'ACTIVE'
  },

  firNumber:      String,
  acknowledgedBy: String,
  acknowledgedAt: Date,
  resolvedAt:     Date,
  notes:          String,
  description:    String,

}, { timestamps: true });

module.exports = mongoose.model('Alert', AlertSchema);