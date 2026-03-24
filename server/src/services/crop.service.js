/**
 * Crop health calculation service
 */
const calculateCropHealth = (crop, location) => {
  // For now, random value between 60-90 logic from original analysisService
  const health = Math.floor(Math.random() * (90 - 60 + 1)) + 60;
  return health;
};

module.exports = {
  calculateCropHealth
};