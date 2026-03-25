/**
 * Risk Calculation Engine
 * Combines confidence, disease severity and weather context.
 */

const { SEVERITY_WEIGHTS } = require('./severityWeights');
const { getWeatherFactor } = require('./weatherFactor');

const getRiskLevel = (riskScore) => {
  if (riskScore > 0.7) return 'High Risk';
  if (riskScore >= 0.4) return 'Medium Risk';
  return 'Low Risk';
};

const normalizeConfidence = (confidence) => {
  const c = Number(confidence);
  if (!Number.isFinite(c)) return 0;
  return Math.min(Math.max(c, 0), 1);
};

const calculateRisk = ({
  confidence,
  severity,
  weather
}) => {
  const normalizedConfidence = normalizeConfidence(confidence);
  const severityWeight = SEVERITY_WEIGHTS[severity] || 0.3;
  const weatherFactor = getWeatherFactor(weather);

  const riskScore = Math.min(normalizedConfidence * severityWeight * weatherFactor, 1.0);

  return {
    riskScore: Number(riskScore.toFixed(3)),
    riskLevel: getRiskLevel(riskScore),
    weatherFactor,
    severityWeight
  };
};

module.exports = {
  calculateRisk,
  getRiskLevel
};
