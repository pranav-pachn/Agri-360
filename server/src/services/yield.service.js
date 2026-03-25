/**
 * Yield prediction service
 */
const predictYield = (crop, health, risk) => {
  // Crop-specific base yields
  const baseYield = crop === "rice" ? 20 : 15;
  let predictedYield = baseYield * (health / 100) * (1 - risk);
  return parseFloat(predictedYield.toFixed(2));
};

/**
 * Normalize mixed severity vocab to a common set.
 */
const normalizeSeverity = (severity = 'Unknown') => {
  const s = String(severity).toLowerCase();
  if (['critical', 'severe'].includes(s)) return 'Critical';
  if (s === 'high') return 'High';
  if (['medium', 'moderate', 'mild'].includes(s)) return 'Medium';
  if (s === 'low') return 'Low';
  if (s === 'none') return 'None';
  return 'Unknown';
};

/**
 * Parse loss strings like "25–40%", "10-20%", "< 5%" to decimal (0-1).
 */
const parseEstimatedLoss = (estimatedLoss) => {
  if (!estimatedLoss || typeof estimatedLoss !== 'string') return null;

  const normalized = estimatedLoss.replace('–', '-').replace('%', '').trim();

  // Range format: "10-20"
  const rangeMatch = normalized.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
  if (rangeMatch) {
    const min = Number(rangeMatch[1]);
    const max = Number(rangeMatch[2]);
    return ((min + max) / 2) / 100;
  }

  // Less-than format: "< 5"
  const ltMatch = normalized.match(/<\s*(\d+(?:\.\d+)?)/);
  if (ltMatch) {
    return (Number(ltMatch[1]) / 2) / 100;
  }

  // Single number format: "15"
  const singleMatch = normalized.match(/(\d+(?:\.\d+)?)/);
  if (singleMatch) {
    return Number(singleMatch[1]) / 100;
  }

  return null;
};

/**
 * Get disease loss percentage (0-1) from estimatedLoss or severity fallback.
 */
const getLossPercentageFromSeverity = (severity, estimatedLoss = null) => {
  const parsedLoss = parseEstimatedLoss(estimatedLoss);
  if (parsedLoss !== null) return Math.min(Math.max(parsedLoss, 0), 0.95);

  const normalizedSeverity = normalizeSeverity(severity);
  const severityLossMap = {
    None: 0.02,
    Low: 0.08,
    Medium: 0.15,
    High: 0.30,
    Critical: 0.55,
    Unknown: 0.12
  };

  return severityLossMap[normalizedSeverity] ?? severityLossMap.Unknown;
};

/**
 * Apply disease impact to base yield using:
 *   adjustedYield = baseYield * (1 - lossPercentage)
 */
const applyDiseaseImpactToYield = (baseYield, lossPercentage = 0) => {
  const cleanBaseYield = Number(baseYield) || 0;
  const cleanLoss = Math.min(Math.max(Number(lossPercentage) || 0, 0), 0.95);
  const adjusted = cleanBaseYield * (1 - cleanLoss);
  return parseFloat(adjusted.toFixed(2));
};

/**
 * Calculates a normalized yield score (0-100) for trust score calculation
 */
const normalizeYieldScore = (predictedYield, baseYield = 15) => {
  // Assuming base yield is standard maximum, score is percentage of base yield
  let score = (predictedYield / baseYield) * 100;
  // Cap at 100
  return Math.min(Math.round(score), 100);
}

module.exports = {
  predictYield,
  normalizeYieldScore,
  normalizeSeverity,
  parseEstimatedLoss,
  getLossPercentageFromSeverity,
  applyDiseaseImpactToYield
};