const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// ─── Socket.io Setup ──────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// ─── Middleware ───────────────────────────────────────────
app.use(express.json());
app.use(cors({ origin: '*' }));
app.set('io', io);

// ─── Socket Events ────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// ─── Start Server ─────────────────────────────────────────
const startServer = async () => {
  try {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    await mongoose.connect(uri);
    console.log('✅ Tracking Service - MongoDB Memory Server Connected');

    // Add sample risk zones
    await addSampleZones();

    // Routes
    app.use('/api/tracking', require('./routes/trackingRoutes'));

    // Health Check
    app.get('/health', (req, res) => {
      res.json({
        status:    'OK',
        service:   'Tracking Service',
        timestamp: new Date().toISOString()
      });
    });

    const PORT = process.env.PORT || 3004;
    server.listen(PORT, () => {
      console.log(`🚀 Tracking Service running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Server start error:', error);
  }
};

// ─── Add Sample Risk Zones ────────────────────────────────
const addSampleZones = async () => {
  try {
    const RiskZone = require('./models/RiskZone');
    const count = await RiskZone.countDocuments();

    if (count === 0) {
      await RiskZone.insertMany([
        {
          name:        'Kaziranga Dense Forest',
          riskLevel:   'high',
          center:      { lat: 26.5775, lng: 93.1711 },
          radius:      3,
          description: 'Wildlife area with wild elephants',
          state:       'Assam',
        },
        {
          name:        'Dzukou Valley Trail',
          riskLevel:   'moderate',
          center:      { lat: 25.5532, lng: 94.1069 },
          radius:      2,
          description: 'Remote trekking zone',
          state:       'Nagaland',
        },
        {
          name:        'Border Restricted Zone',
          riskLevel:   'restricted',
          center:      { lat: 27.3516, lng: 91.9874 },
          radius:      5,
          description: 'Border area - permit required',
          state:       'Arunachal Pradesh',
        },
        {
          name:        'Shillong Peak Area',
          riskLevel:   'moderate',
          center:      { lat: 25.5788, lng: 91.8933 },
          radius:      1,
          description: 'High altitude area',
          state:       'Meghalaya',
        },
      ]);
      console.log('✅ Sample risk zones added');
    }
  } catch (error) {
    console.log('Sample zones error:', error.message);
  }
};

startServer();

module.exports = app;