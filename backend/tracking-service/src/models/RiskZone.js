const mongoose = require('mongoose');

const RiskZoneSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  riskLevel: {
    type: String,
    enum: ['moderate', 'high', 'restricted'],
    required: true
  },
  center: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  radius:      { type: Number, required: true },
  description: String,
  state:       String,
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('RiskZone', RiskZoneSchema);