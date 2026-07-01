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
      console.log('✅ Risk zones added to Cloud MongoDB');
    } else {
      console.log('✅ ' + count + ' risk zones already in Cloud MongoDB');
    }
  } catch (error) {
    console.log('Zones error:', error.message);
  }
};
const startServer = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tourist_safety';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Tracking Service - Cloud MongoDB Connected');
    await addSampleZones();
    app.use('/api/tracking', require('./routes/trackingRoutes'));
    app.get('/health', (req, res) => res.json({ status: 'OK', service: 'Tracking Service', database: 'Cloud MongoDB', timestamp: new Date().toISOString() }));
    const PORT = process.env.PORT || 3005;
    server.listen(PORT, () => console.log('🚀 Tracking Service running on port ' + PORT));
  } catch (error) {
    console.error('❌ Server start error:', error.message);
    process.exit(1);
  }
};
startServer();
module.exports = app;
