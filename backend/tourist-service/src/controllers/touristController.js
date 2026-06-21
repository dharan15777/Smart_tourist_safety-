const TouristProfile = require('../models/TouristProfile');
const { generateDigitalId, isIdValid } = require('../services/digitalIdService');

// Create Tourist Profile + Digital ID
exports.createProfile = async (req, res) => {
  try {
    const {
      userId, name, phone,
      passportNumber, nationality,
      arrivalDate, departureDate,
      entryPoint, itinerary,
      emergencyContacts
    } = req.body;

    // Check if profile exists
    const existing = await TouristProfile.findOne({ userId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Tourist profile already exists'
      });
    }

    // Generate Digital ID
    const digitalId = await generateDigitalId({
      name,
      phone,
      passportNumber,
      arrivalDate,
      departureDate,
    });

    // Create Profile
    const profile = await TouristProfile.create({
      userId,
      name,
      phone,
      digitalId: {
        ...digitalId,
        entryPoint: entryPoint || 'Airport',
      },
      tripDetails: {
        arrivalDate,
        departureDate,
        entryPoint,
        itinerary: itinerary || [],
      },
    });

    res.status(201).json({
      success: true,
      message: 'Tourist profile and Digital ID created!',
      profile: {
        id:        profile._id,
        userId:    profile.userId,
        name:      profile.name,
        digitalId: {
          uniqueId:  profile.digitalId.uniqueId,
          qrCode:    profile.digitalId.qrCode,
          issuedAt:  profile.digitalId.issuedAt,
          expiresAt: profile.digitalId.expiresAt,
          entryPoint:profile.digitalId.entryPoint,
        },
        safetyScore: profile.safetyScore,
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Tourist Profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await TouristProfile
      .findOne({ userId: req.params.userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Tourist profile not found'
      });
    }

    res.json({ success: true, profile });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Active Tourists
exports.getAllActive = async (req, res) => {
  try {
    const tourists = await TouristProfile
      .find({ isActive: true })
      .select('-digitalId.qrCode');

    res.json({
      success: true,
      count:   tourists.length,
      tourists
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Verify Digital ID
exports.verifyId = async (req, res) => {
  try {
    const { uniqueId } = req.params;

    const profile = await TouristProfile
      .findOne({ 'digitalId.uniqueId': uniqueId });

    if (!profile) {
      return res.json({
        success: false,
        valid:   false,
        message: 'Digital ID not found'
      });
    }

    const valid = isIdValid(profile.digitalId);

    res.json({
      success: true,
      valid,
      expired: !valid,
      tourist: {
        name:       profile.name,
        phone:      profile.phone,
        digitalId:  profile.digitalId.uniqueId,
        entryPoint: profile.digitalId.entryPoint,
        issuedAt:   profile.digitalId.issuedAt,
        expiresAt:  profile.digitalId.expiresAt,
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Safety Score
exports.updateSafetyScore = async (req, res) => {
  try {
    const { userId, score, label, color } = req.body;

    const profile = await TouristProfile.findOneAndUpdate(
      { userId },
      { safetyScore: { score, label, color } },
      { new: true }
    );

    res.json({ success: true, profile });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Current Location
exports.updateLocation = async (req, res) => {
  try {
    const { userId, lat, lng, address } = req.body;

    const profile = await TouristProfile.findOneAndUpdate(
      { userId },
      {
        currentLocation: {
          lat, lng, address,
          timestamp: new Date()
        }
      },
      { new: true }
    );

    res.json({ success: true, profile });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};