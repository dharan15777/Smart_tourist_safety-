const mongoose = require('mongoose');

const LocationHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name:  String,
  phone: String,

  locations: [{
    lat:       Number,
    lng:       Number,
    address:   String,
    accuracy:  Number,
    timestamp: { type: Date, default: Date.now },
  }],

  lastUpdated: { type: Date, default: Date.now },

}, { timestamps: true });

module.exports = mongoose.model('LocationHistory', LocationHistorySchema);