const Alert = require('../models/Alert');
const { generateFIRDocument } = require('../services/firService');

// Create Panic Alert
exports.createPanic = async (req, res) => {
  try {
    const {
      userId, name, phone,
      digitalId, location, description
    } = req.body;

    const alert = await Alert.create({
      alertType: 'PANIC',
      severity:  'CRITICAL',
      tourist: { userId, name, phone, digitalId },
      location,
      description: description || 'Tourist pressed PANIC button',
    });

    // Emit to dashboard via socket
    const io = req.app.get('io');
    if (io) {
      io.emit('new_alert', {
        alertId:     alert.alertId,
        alertType:   'PANIC',
        severity:    'CRITICAL',
        tourist:     { name, phone, digitalId },
        location,
        timestamp:   new Date(),
        message:     `🚨 PANIC ALERT: ${name} needs help!`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Panic alert sent! Help is coming!',
      alertId: alert.alertId,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create Geo Fence Alert
exports.createGeoFence = async (req, res) => {
  try {
    const {
      tourist, location,
      zoneName, riskLevel
    } = req.body;

    const alert = await Alert.create({
      alertType:   'GEO_FENCE',
      severity:    riskLevel === 'restricted' ? 'HIGH' : 'MEDIUM',
      tourist,
      location,
      description: `Tourist entered ${riskLevel} zone: ${zoneName}`,
    });

    // Emit to dashboard
    const io = req.app.get('io');
    if (io) {
      io.emit('new_alert', {
        alertId:   alert.alertId,
        alertType: 'GEO_FENCE',
        severity:  alert.severity,
        tourist,
        location,
        timestamp: new Date(),
        message:   `⚠️ ${tourist.name} entered ${riskLevel} zone: ${zoneName}`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Geo fence alert created',
      alertId: alert.alertId,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Alerts
exports.getAlerts = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const filter = status ? { status } : {};

    const alerts = await Alert
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      count:   alerts.length,
      alerts
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Single Alert
exports.getAlert = async (req, res) => {
  try {
    const alert = await Alert
      .findOne({ alertId: req.params.alertId });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.json({ success: true, alert });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Acknowledge Alert
exports.acknowledgeAlert = async (req, res) => {
  try {
    const { officerName } = req.body;

    const alert = await Alert.findOneAndUpdate(
      { alertId: req.params.alertId },
      {
        status:          'ACKNOWLEDGED',
        acknowledgedBy:  officerName || 'Officer',
        acknowledgedAt:  new Date(),
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    // Emit update to dashboard
    const io = req.app.get('io');
    if (io) {
      io.emit('alert_updated', {
        alertId: alert.alertId,
        status:  'ACKNOWLEDGED',
        acknowledgedBy: officerName,
      });
    }

    res.json({
      success: true,
      message: 'Alert acknowledged',
      alert
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Resolve Alert
exports.resolveAlert = async (req, res) => {
  try {
    const { notes } = req.body;

    const alert = await Alert.findOneAndUpdate(
      { alertId: req.params.alertId },
      {
        status:     'RESOLVED',
        resolvedAt: new Date(),
        notes:      notes || '',
      },
      { new: true }
    );

    const io = req.app.get('io');
    if (io) {
      io.emit('alert_updated', {
        alertId: alert.alertId,
        status:  'RESOLVED',
      });
    }

    res.json({
      success: true,
      message: 'Alert resolved',
      alert
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Generate FIR
exports.generateFIR = async (req, res) => {
  try {
    const alert = await Alert
      .findOne({ alertId: req.params.alertId });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    // Generate FIR
    const { firNumber, firDocument } = generateFIRDocument(alert);

    // Save FIR number to alert
    alert.firNumber = firNumber;
    alert.status    = 'ACKNOWLEDGED';
    await alert.save();

    // Emit to dashboard
    const io = req.app.get('io');
    if (io) {
      io.emit('fir_generated', {
        alertId:  alert.alertId,
        firNumber,
        tourist:  alert.tourist,
        location: alert.location,
      });
    }

    res.json({
      success: true,
      message: 'FIR Generated Successfully',
      firNumber,
      firDocument,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Stats
exports.getStats = async (req, res) => {
  try {
    const total      = await Alert.countDocuments();
    const active     = await Alert.countDocuments({ status: 'ACTIVE' });
    const resolved   = await Alert.countDocuments({ status: 'RESOLVED' });
    const panic      = await Alert.countDocuments({ alertType: 'PANIC' });
    const geoFence   = await Alert.countDocuments({ alertType: 'GEO_FENCE' });

    res.json({
      success: true,
      stats: {
        total,
        active,
        resolved,
        panic,
        geoFence,
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};