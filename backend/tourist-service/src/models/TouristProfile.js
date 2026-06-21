const mongoose = require('mongoose');

const TouristProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name:  { type: String, required: true },
  phone: { type: String, required: true },

  digitalId: {
    uniqueId:  String,
    qrCode:    String,
    dataHash:  String,
    issuedAt:  Date,
    expiresAt: Date,
    entryPoint:String,
  },

  tripDetails: {
    arrivalDate:   Date,
    departureDate: Date,
    entryPoint:    String,
    itinerary: [{
      date:     Date,
      location: String,
      lat:      Number,
      lng:      Number,
    }],
  },

  safetyScore: {
    score: { type: Number, default: 100 },
    label: { type: String, default: 'SAFE' },
    color: { type: String, default: '#22C55E' },
  },

  currentLocation: {
    lat:       Number,
    lng:       Number,
    address:   String,
    timestamp: Date,
  },

  isActive: { type: Boolean, default: true },

}, { timestamps: true });

module.exports = mongoose.model('TouristProfile', TouristProfileSchema);