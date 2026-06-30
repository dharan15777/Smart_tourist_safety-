const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors({ origin: '*' }));
const startServer = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/tourist_safety');
    console.log('✅ Tourist Service - MongoDB Connected');
    app.use('/api/tourists', require('./routes/touristRoutes'));
    app.get('/health', (req, res) => res.json({ status: 'OK', service: 'Tourist Service', database: 'MongoDB', timestamp: new Date().toISOString() }));
    const PORT = 3002;
    app.listen(PORT, () => console.log('🚀 Tourist Service running on port ' + PORT));
  } catch (error) {
    console.error('❌ Server start error:', error.message);
    process.exit(1);
  }
};
startServer();
module.exports = app;
