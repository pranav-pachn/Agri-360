/**
 * Trust Calculator (0-100)
 *
 * Trust Score =
 * (0.3 × Yield Stability) +
 * (0.25 × Risk Trend) +
 * (0.2 × Sustainability) +
 * (0.25 × Consistency)
 */

const { calculateSustainability } = require('./sustainabilityEngine.js');

const clamp = (val) => {
  if (val == null || Number.isNaN(Number(val))) return 0;
  return Math.max(0, Math.min(100, Number(val)));
};

const getRating = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Moderate';
  return 'High Risk';
};

const calculateTrustScore = ({
  yieldStability,
  riskTrend,
  sustainability,
  consistency
}) => {
  const ys = clamp(yieldStability);
  const rt = clamp(riskTrend);
  const su = clamp(sustainability);
  const co = clamp(consistency);

  const score =
    (0.3 * ys) +
    (0.25 * rt) +
    (0.2 * su) +
    (0.25 * co);

  return {
    trustScore: Math.round(score),
    rating: getRating(score),
    inputs: { ys, rt, su, co },
    weighted: {
      yield_stability: Number((0.3 * ys).toFixed(2)),
      risk_trend: Number((0.25 * rt).toFixed(2)),
      sustainability: Number((0.2 * su).toFixed(2)),
      consistency: Number((0.25 * co).toFixed(2))
    }
  };
};

const scaleTrustScoreToCreditBand = (trustScore0to100) => {
  const safe = clamp(trustScore0to100);
  return Math.round(300 + (safe * 6));
};

module.exports = {
  clamp,
  getRating,
  calculateTrustScore,
  scaleTrustScoreToCreditBand
};
