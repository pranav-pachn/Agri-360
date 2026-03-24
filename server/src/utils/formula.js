/**
 * Calculates the Trust Score based on crop health, risk, and yield
 * trustScore = (health * 0.4) + ((1 - risk) * 30) + (yield * 10)
 */
const calculateTrustScore = (health, risk, cropYield) => {
  const score = (health * 0.4) + ((1 - risk) * 30) + (cropYield * 10);
  return Math.round(score);
};

module.exports = {
  calculateTrustScore
};
