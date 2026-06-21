const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  phone:    { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['tourist', 'police', 'admin'],
    default: 'tourist'
  },
  kyc: {
    passportNumber: String,
    aadhaarNumber:  String,
    nationality:    String,
  },
  emergencyContacts: [{
    name:  String,
    phone: String,
    email: String,
  }],
  settings: {
    locationSharing: { type: Boolean, default: false },
  },
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.matchPassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);