// Auto FIR Generation Service

const generateFIRNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.random()
    .toString(36)
    .substr(2, 8)
    .toUpperCase();
  return `FIR-NER-${year}-${random}`;
};

const generateFIRDocument = (alert) => {
  const firNumber = generateFIRNumber();

  const firDocument = {
    firNumber,
    type:        'TOURIST EMERGENCY',
    dateTime:    new Date().toISOString(),
    tourist: {
      name:      alert.tourist?.name,
      phone:     alert.tourist?.phone,
      digitalId: alert.tourist?.digitalId,
      userId:    alert.tourist?.userId,
    },
    incident: {
      alertType:   alert.alertType,
      severity:    alert.severity,
      description: alert.description,
      reportedAt:  alert.createdAt,
    },
    location: {
      lat:     alert.location?.lat,
      lng:     alert.location?.lng,
      address: alert.location?.address,
    },
    status:      'REGISTERED',
    generatedBy: 'Smart Tourist Safety System - Auto FIR',
    generatedAt: new Date().toISOString(),
    instructions: [
      'Dispatch nearest police unit immediately',
      'Contact tourist emergency contacts',
      'Update FIR status after resolution',
    ]
  };

  return { firNumber, firDocument };
};

module.exports = {
  generateFIRNumber,
  generateFIRDocument
};