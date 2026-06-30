const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));
const notificationLog = [];
const sendSMS = async (phone, message) => { const n = { id: Date.now(), type: 'SMS', to: phone, message, status: 'sent', timestamp: new Date().toISOString() }; notificationLog.push(n); console.log('📱 SMS to ' + phone); return n; };
const sendEmail = async (email, subject, message) => { const n = { id: Date.now(), type: 'EMAIL', to: email, subject, message, status: 'sent', timestamp: new Date().toISOString() }; notificationLog.push(n); console.log('📧 Email to ' + email); return n; };
const sendPush = async (userId, title, body) => { const n = { id: Date.now(), type: 'PUSH', to: userId, title, body, status: 'sent', timestamp: new Date().toISOString() }; notificationLog.push(n); console.log('🔔 Push to ' + userId); return n; };
app.post('/api/notifications/emergency', async (req, res) => {
  try {
    const { touristId, touristName, phone, email, location, emergencyContact } = req.body;
    const results = [];
    if (phone) results.push(await sendSMS(phone, '🚨 EMERGENCY: Panic activated. ID: ' + touristId));
    if (emergencyContact && emergencyContact.phone) results.push(await sendSMS(emergencyContact.phone, '🚨 ' + touristName + ' triggered panic. Call 112'));
    if (email) results.push(await sendEmail(email, '🚨 Emergency Alert', 'Panic button activated. Help coming.'));
    results.push(await sendPush(touristId, '🚨 Emergency Active', 'Police notified.'));
    res.json({ success: true, notificationsSent: results.length, results });
  } catch (error) { res.status(500).json({ error: error.message }); }
});
app.post('/api/notifications/send', async (req, res) => {
  try {
    const { type, to, message, subject, title } = req.body;
    let result;
    if (type === 'SMS') result = await sendSMS(to, message);
    else if (type === 'EMAIL') result = await sendEmail(to, subject || 'Alert', message);
    else if (type === 'PUSH') result = await sendPush(to, title || 'Alert', message);
    else return res.status(400).json({ error: 'Invalid type' });
    res.json({ success: true, result });
  } catch (error) { res.status(500).json({ error: error.message }); }
});
app.get('/api/notifications/history', (req, res) => {
  res.json({ total: notificationLog.length, notifications: notificationLog.slice().reverse().slice(0, 50) });
});
app.get('/health', (req, res) => res.json({ status: 'OK', service: 'Notification Service', totalSent: notificationLog.length, timestamp: new Date().toISOString() }));
const PORT = 3007;
app.listen(PORT, () => console.log('📬 Notification Service running on port ' + PORT));
module.exports = app;
