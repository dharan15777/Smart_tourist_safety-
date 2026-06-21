const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────────────────────────
app.use(express.json());
app.use(cors({ origin: '*' }));

// ─── Start Memory MongoDB ─────────────────────────────────
const startServer = async () => {
  try {
    // Create in-memory MongoDB
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    // Connect mongoose
    await mongoose.connect(uri);
    console.log('✅ Auth Service - MongoDB Memory Server Connected');

    // Routes
    app.use('/api/auth', require('./routes/authRoutes'));

    // Health Check
    app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        service: 'Auth Service',
        database: 'MongoDB Memory Server',
        timestamp: new Date().toISOString()
      });
    });

    // Start Express
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Auth Service running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Server start error:', error);
  }
};

startServer();

module.exports = app;