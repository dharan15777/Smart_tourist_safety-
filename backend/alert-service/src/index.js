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

// Make io accessible in controllers
app.set('io', io);

// ─── Socket Events ────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('join_dashboard', () => {
    socket.join('police_dashboard');
    console.log('Police dashboard joined');
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// ─── Start Server ─────────────────────────────────────────
const startServer = async () => {
  try {
    // Create in-memory MongoDB
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    // Connect mongoose
    await mongoose.connect(uri);
    console.log('✅ Alert Service - MongoDB Memory Server Connected');

    // Routes
    app.use('/api/alerts', require('./routes/alertRoutes'));

    // Health Check
    app.get('/health', (req, res) => {
      res.json({
        status:    'OK',
        service:   'Alert Service',
        timestamp: new Date().toISOString()
      });
    });

    // Start Server
    const PORT = process.env.PORT || 3003;
    server.listen(PORT, () => {
      console.log(`🚀 Alert Service running on port ${PORT}`);
      console.log(`🔌 Socket.io ready on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Server start error:', error);
  }
};

startServer();

module.exports = app;