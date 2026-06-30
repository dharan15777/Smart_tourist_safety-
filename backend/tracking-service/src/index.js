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
  socket.on('disconnect', () => console.log('❌ Client disconnected'));
});
const addSampleZones = async () => {
  try {
    const RiskZone = require('./models/RiskZone');
    const count = await RiskZone.countDocuments();
    if (count === 0) {
      await RiskZone.insertMany([
        { name: 'Kaziranga Dense Forest', riskLevel: 'high', center: { lat: 26.5775, lng: 93.1711 }, radius: 3, description: 'Wildlife area', state: 'Assam' },
        { name: 'Dzukou Valley Trail', riskLevel: 'moderate', center: { lat: 25.5532, lng: 94.1069 }, radius: 2, description: 'Remote trekking zone', state: 'Nagaland' },
        { name: 'Border Restricted Zone', riskLevel: 'restricted', center: { lat: 27.3516, lng: 91.9874 }, radius: 5, description: 'Border area', state: 'Arunachal Pradesh' },
        { name: 'Shillong Peak Area', riskLevel: 'moderate', center: { lat: 25.5788, lng: 91.8933 }, radius: 1, description: 'High altitude area', state: 'Meghalaya' }
      ]);
      console.log('✅ Sample risk zones added');
    } else {
      console.log('✅ ' + count + ' risk zones already in MongoDB');
    }
  } catch (error) {
    console.log('Zones error:', error.message);
  }
};
const startServer = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/tourist_safety');
    console.log('✅ Tracking Service - MongoDB Connected');
    await addSampleZones();
    app.use('/api/tracking', require('./routes/trackingRoutes'));
    app.get('/health', (req, res) => res.json({ status: 'OK', service: 'Tracking Service', database: 'MongoDB', timestamp: new Date().toISOString() }));
    const PORT = 3005;
    server.listen(PORT, () => console.log('🚀 Tracking Service running on port ' + PORT));
  } catch (error) {
    console.error('❌ Server start error:', error.message);
    process.exit(1);
  }
};
startServer();
module.exports = app;
