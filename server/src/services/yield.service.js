/**
 * Yield prediction service
 */
const predictYield = (crop, health, risk) => {
  // Simple rule-based formula
  const baseYield = 10; // example base yield
  let predictedYield = baseYield * (health / 100) * (1 - risk);
  return parseFloat(predictedYield.toFixed(2));
};

/**
 * Calculates a normalized yield score (0-100) for trust score calculation
 */
const normalizeYieldScore = (predictedYield, baseYield = 10) => {
  // Assuming base yield is standard maximum, score is percentage of base yield
  let score = (predictedYield / baseYield) * 100;
  // Cap at 100
  return Math.min(Math.round(score), 100);
}

module.exports = {
  predictYield,
  normalizeYieldScore
};