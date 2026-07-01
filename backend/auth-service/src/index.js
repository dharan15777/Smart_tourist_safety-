const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));
const startServer = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tourist_safety';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Auth Service - Cloud MongoDB Connected');
    app.use('/api/auth', require('./routes/authRoutes'));
    app.get('/health', (req, res) => res.json({ status: 'OK', service: 'Auth Service', database: 'Cloud MongoDB', timestamp: new Date().toISOString() }));
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log('🚀 Auth Service running on port ' + PORT));
  } catch (error) {
    console.error('❌ Server start error:', error.message);
    process.exit(1);
  }
};
startServer();
module.exports = app;
