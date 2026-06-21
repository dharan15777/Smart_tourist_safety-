const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

// Generate Digital ID
const generateDigitalId = async (touristData) => {
  try {
    // 1. Create Unique ID
    const year = new Date().getFullYear();
    const random = uuidv4().split('-')[0].toUpperCase();
    const uniqueId = `NER-${year}-${random}`;

    // 2. Create Data Hash
    const dataHash = crypto
      .createHash('sha256')
      .update(JSON.stringify({
        name:      touristData.name,
        phone:     touristData.phone,
        passport:  touristData.passportNumber || '',
        arrival:   touristData.arrivalDate,
        departure: touristData.departureDate,
      }))
      .digest('hex');

    // 3. Create QR Code Data
    const qrData = JSON.stringify({
      id:        uniqueId,
      name:      touristData.name,
      hash:      dataHash,
      expiresAt: touristData.departureDate,
      verify:    `http://localhost:3000/verify/${uniqueId}`,
    });

    // 4. Generate QR Code Image
    const qrCode = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark:  '#1E293B',
        light: '#FFFFFF'
      }
    });

    return {
      uniqueId,
      qrCode,
      dataHash,
      issuedAt:  new Date(),
      expiresAt: new Date(touristData.departureDate),
    };

  } catch (error) {
    throw new Error('Failed to generate Digital ID: ' + error.message);
  }
};

// Verify Digital ID
const verifyDigitalId = (digitalId, touristData) => {
  const expectedHash = crypto
    .createHash('sha256')
    .update(JSON.stringify({
      name:      touristData.name,
      phone:     touristData.phone,
      passport:  touristData.passportNumber || '',
      arrival:   touristData.arrivalDate,
      departure: touristData.departureDate,
    }))
    .digest('hex');

  return expectedHash === digitalId.dataHash;
};

// Check ID Validity
const isIdValid = (digitalId) => {
  const now = new Date();
  const expiresAt = new Date(digitalId.expiresAt);
  return now < expiresAt;
};

module.exports = {
  generateDigitalId,
  verifyDigitalId,
  isIdValid
};