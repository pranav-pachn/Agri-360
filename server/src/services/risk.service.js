/**
 * Risk Score Engine - explainable output
 */

const DEFAULT_FACTORS = [
  { factor: 'Crop Health', impact: 18 },
  { factor: 'Yield Stability', impact: 12 },
  { factor: 'Weather Volatility', impact: -10 },
  { factor: 'Market Fluctuation', impact: -8 },
  { factor: 'Past Performance', impact: 20 }
];

const normalizeScore = (raw) => {
  // Basic normalization into 0-100 range
  const min = -100;
  const max = 200;
  const scaled = Math.round(((raw - min) / (max - min)) * 100);
  return Math.max(0, Math.min(100, scaled));
};

const categorize = (score) => {
  if (score > 70) return 'High';
  if (score > 40) return 'Medium';
  return 'Low';
};

const calculateRisk = (overrides = {}) => {
  // allow overriding factors for testing or future inputs
  const factors = Array.isArray(overrides.factors) ? overrides.factors : DEFAULT_FACTORS;

  const rawScore = factors.reduce((acc, f) => acc + (Number(f.impact) || 0), 0);
  const riskScore = normalizeScore(rawScore);
  const riskCategory = categorize(riskScore);

  // Confidence heuristic: more positive breakdown magnitude -> slightly higher confidence
  const magnitude = factors.reduce((a, f) => a + Math.abs(Number(f.impact) || 0), 0);
  const confidence = Number(Math.max(0.5, Math.min(0.98, 0.75 + (magnitude / 200))).toFixed(2));

  const explanation = (() => {
    if (riskCategory === 'High') return 'High risk mainly driven by adverse factors such as weather and market volatility.';
    if (riskCategory === 'Medium') return 'Moderate risk due to mixed signals across crop health, yield and external factors.';
    return 'Low risk: overall indicators are favorable.';
  })();

  return {
    riskScore,
    riskCategory,
    confidence,
    breakdown: factors.map((f) => ({ factor: f.factor, impact: Number(f.impact) })),
    explanation
  };
};

module.exports = {
  calculateRisk
};
