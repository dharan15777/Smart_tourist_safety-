const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
app.use(express.json());
app.use(cors({ origin: '*' }));
app.set('io', io);
io.on('connection', (socket) => {
  socket.on('join_dashboard', () => socket.join('police_dashboard'));
  socket.on('disconnect', () => console.log('❌ Client disconnected'));
});
const startServer = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tourist_safety';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Alert Service - Cloud MongoDB Connected');
    app.use('/api/alerts', require('./routes/alertRoutes'));
    app.get('/health', (req, res) => res.json({ status: 'OK', service: 'Alert Service', database: 'Cloud MongoDB', timestamp: new Date().toISOString() }));
    const PORT = process.env.PORT || 3003;
    server.listen(PORT, () => console.log('🚀 Alert Service running on port ' + PORT));
  } catch (error) {
    console.error('❌ Server start error:', error.message);
    process.exit(1);
  }
};
startServer();
module.exports = app;
