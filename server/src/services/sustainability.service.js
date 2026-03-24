/**
 * Sustainability analysis service
 */
const calculateSustainability = (crop, location) => {
  // Make sustainability score deterministic based on string length to avoid random fluctuation in demo
  const baseScore = 60;
  const cropModifier = (crop?.length || 5) * 2;
  const locationModifier = (location?.length || 7);
  
  let score = baseScore + cropModifier + locationModifier;
  // Cap between 50 and 95
  return Math.max(50, Math.min(score, 95));
};

module.exports = {
  calculateSustainability
};