const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(cors({ origin: '*' }));

// ─── Start Server ─────────────────────────────────────────
const startServer = async () => {
  try {
    // Create in-memory MongoDB
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    // Connect mongoose
    await mongoose.connect(uri);
    console.log('✅ Tourist Service - MongoDB Memory Server Connected');

    // Routes
    app.use('/api/tourists', require('./routes/touristRoutes'));

    // Health Check
    app.get('/health', (req, res) => {
      res.json({
        status:    'OK',
        service:   'Tourist Service',
        timestamp: new Date().toISOString()
      });
    });

    // Start Express
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
      console.log(`🚀 Tourist Service running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Server start error:', error);
  }
};

startServer();

module.exports = app;