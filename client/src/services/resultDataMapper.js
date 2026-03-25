import { buildMockResultData } from './mockResultData';

const toPercent = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return n > 1 ? Number(n.toFixed(1)) : Number((n * 100).toFixed(1));
};

const normalizeRecommendations = (recommendations) => {
  if (!Array.isArray(recommendations)) return [];

  return recommendations
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item?.action) return item.action;
      if (item?.text) return item.text;
      return null;
    })
    .filter(Boolean);
};

const normalizeLegacyAnalysis = (analysis, options = {}) => {
  const trustScore = Number(analysis.trust_score ?? analysis.score ?? 0);
  const riskScore = Number(analysis.risk ?? analysis.risk_score ?? analysis.risk?.score ?? 0);
  const confidence = analysis.confidence ?? analysis.diagnosis?.confidence ?? 0;
  const disease = analysis.disease || analysis.diagnosis?.disease || 'Detected Condition';
  const severity = analysis.severity || analysis.diagnosis?.severity || 'Unknown';
  const projectedYieldNumeric = Number(
    analysis.yield?.projectedYield
      ?? analysis.yield_prediction?.predicted_yield
      ?? analysis.yield
      ?? 0
  );

  const recommendations = normalizeRecommendations(analysis.recommendations);

  return {
    id: analysis.id || options.id || 'analysis-legacy',
    image: options.image || analysis.image_url || analysis.image || null,
    disease,
    confidence: toPercent(confidence),
    severity,
    riskLevel: analysis.riskLevel || analysis.risk?.level || (riskScore > 0.7 ? 'High' : riskScore > 0.4 ? 'Medium' : 'Low'),
    riskScore,
    projectedYield: `${Number.isFinite(projectedYieldNumeric) ? projectedYieldNumeric : '?'} tons/ha`,
    estimatedLoss: Number(analysis.estimatedLoss ?? analysis.yield?.lossPercent ?? analysis.yield_prediction?.loss_percentage ?? Math.round(Math.max(0, Math.min(100, riskScore * 50)))),
    trustScore,
    eligibility: analysis.eligibility || ((trustScore > 100 ? trustScore >= 600 : trustScore >= 60) ? 'Eligible' : 'Not Eligible'),
    rating: analysis.rating || analysis.trust?.rating || analysis.credit_rating || 'Unknown',
    sustainabilityScore: Number(analysis.sustainabilityScore ?? analysis.sustainability_index ?? 58),
    sustainabilityBreakdown: analysis.sustainabilityBreakdown || analysis.sustainability_breakdown || {
      water_efficiency: 40,
      fertilizer_optimization: 55,
      crop_diversity: 70,
      soil_health: 65,
    },
    recommendations: recommendations.length > 0
      ? recommendations
      : [
          'Review this diagnosis and apply field treatment based on local agronomy guidance.',
          'Monitor crop condition over the next 3-5 days and rescan if symptoms increase.',
        ],
    explainabilityText: analysis.explainabilityText || null,
    dataMode: {
      source: analysis.dataMode?.source || 'backend-legacy',
      fallbackUsed: Boolean(analysis.dataMode?.fallbackUsed),
    },
    raw: {
      crop: analysis.crop || null,
      location: analysis.location || null,
      timestamp: analysis.created_at || analysis.timestamp || null,
    },
  };
};

export const normalizeResultPayload = (analysis, options = {}) => {
  if (!analysis || typeof analysis !== 'object') {
    return buildMockResultData(options.mockOverrides || {});
  }

  // Already normalized result contract from backend/frontend.
  if (
    typeof analysis.disease === 'string' &&
    typeof analysis.projectedYield === 'string' &&
    Object.prototype.hasOwnProperty.call(analysis, 'dataMode')
  ) {
    return {
      ...analysis,
      image: options.image || analysis.image || null,
      dataMode: {
        source: analysis.dataMode?.source || 'backend-normalized',
        fallbackUsed: Boolean(analysis.dataMode?.fallbackUsed),
      },
    };
  }

  return normalizeLegacyAnalysis(analysis, options);
};

export const buildFallbackResultPayload = (overrides = {}) => {
  return buildMockResultData(overrides);
};
