/**
 * Corrected Yield Engine Implementation
 * Implements the specified formula: Projected Yield = Base Yield × (1 - Risk Score × 0.5)
 */

const calculateProjectedYield = (baseYield, riskScore) => {
  // Input validation and sanitization
  const cleanBaseYield = Math.max(Number(baseYield) || 0, 0);
  const cleanRisk = Math.min(Math.max(Number(riskScore) || 0, 0), 1);
  
  // Apply the specified formula
  const projectedYield = cleanBaseYield * (1 - cleanRisk * 0.5);
  
  // Calculate yield loss percentage
  const yieldLossPercent = cleanRisk * 0.5 * 100;
  
  return {
    baseYield: cleanBaseYield,
    projectedYield: parseFloat(projectedYield.toFixed(2)),
    yieldLossPercent: parseFloat(yieldLossPercent.toFixed(1)),
    riskScore: cleanRisk,
    formula: "Projected Yield = Base Yield × (1 - Risk Score × 0.5)"
  };
};

const calculateYieldWithHealth = (baseYield, healthScore, riskScore) => {
  // Enhanced version that includes health factor
  const cleanBaseYield = Math.max(Number(baseYield) || 0, 0);
  const cleanHealth = Math.min(Math.max(Number(healthScore) || 100, 0), 100);
  const cleanRisk = Math.min(Math.max(Number(riskScore) || 0, 0), 1);
  
  // Apply health factor first, then risk factor
  const healthAdjustedBase = cleanBaseYield * (cleanHealth / 100);
  const projectedYield = healthAdjustedBase * (1 - cleanRisk * 0.5);
  
  const yieldLossPercent = cleanRisk * 0.5 * 100;
  
  return {
    baseYield: cleanBaseYield,
    healthAdjustedBase: parseFloat(healthAdjustedBase.toFixed(2)),
    projectedYield: parseFloat(projectedYield.toFixed(2)),
    yieldLossPercent: parseFloat(yieldLossPercent.toFixed(1)),
    healthScore: cleanHealth,
    riskScore: cleanRisk,
    formula: "Projected Yield = Base Yield × (Health/100) × (1 - Risk Score × 0.5)"
  };
};

// Crop-specific base yields (agricultural data)
const getCropBaseYield = (crop) => {
  const cropYields = {
    rice: 20,      // tons/hectare (average)
    wheat: 15,     // tons/hectare (average)
    corn: 18,      // tons/hectare (average)
    soybean: 12,   // tons/hectare (average)
    cotton: 8,     // tons/hectare (average)
    sugarcane: 75  // tons/hectare (average)
  };
  
  return cropYields[crop?.toLowerCase()] || 15; // default to wheat
};

const calculateCropYield = (crop, healthScore, riskScore) => {
  const baseYield = getCropBaseYield(crop);
  return calculateYieldWithHealth(baseYield, healthScore, riskScore);
};

// Sensitivity analysis function
const analyzeYieldSensitivity = (baseYield, riskRange) => {
  const results = [];
  
  riskRange.forEach(risk => {
    const result = calculateProjectedYield(baseYield, risk);
    results.push({
      riskScore: risk,
      projectedYield: result.projectedYield,
      yieldLossPercent: result.yieldLossPercent,
      yieldPerRiskUnit: result.projectedYield / risk // Sensitivity metric
    });
  });
  
  return results;
};

module.exports = {
  calculateProjectedYield,
  calculateYieldWithHealth,
  calculateCropYield,
  getCropBaseYield,
  analyzeYieldSensitivity
};
