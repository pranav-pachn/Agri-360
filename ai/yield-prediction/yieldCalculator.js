/**
 * Yield Calculator Engine
 * Projected Yield = Base × (1 - Risk × 0.5)
 */

const calculateProjectedYield = ({ baseYield, riskScore, crop }) => {
  const safeBaseYield = Number(baseYield) || 0;

  // Edge handling to prevent broken math
  if (!riskScore || riskScore < 0) riskScore = 0;
  if (riskScore > 1) riskScore = 1;

  const safeRisk = Math.min(Math.max(Number(riskScore) || 0, 0), 1);
  const cropKey = String(crop || '').toLowerCase();

  // Optional realism upgrade: crop-specific impact factor
  const impactFactor = cropKey === 'rice' ? 0.6 : 0.5;

  const projectedYield = safeBaseYield * (1 - safeRisk * impactFactor);

  return {
    baseYield: safeBaseYield,
    projectedYield: Number(projectedYield.toFixed(2)),
    yieldLossPercent: Number((safeRisk * impactFactor * 100).toFixed(1)),
    impactFactor
  };
};

module.exports = {
  calculateProjectedYield
};
