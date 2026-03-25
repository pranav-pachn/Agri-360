const DEFAULT_BREAKDOWN = {
  water_efficiency: 40,
  fertilizer_optimization: 55,
  crop_diversity: 70,
  soil_health: 65,
};

export const buildMockResultData = (overrides = {}) => {
  const base = {
    id: overrides.id || 'mock-analysis',
    image: overrides.image || null,
    disease: 'Early Blight',
    confidence: 87.5,
    severity: 'Moderate',
    riskLevel: 'High',
    riskScore: 0.82,
    projectedYield: '12 tons/ha',
    estimatedLoss: 40,
    trustScore: 45,
    eligibility: 'Not Eligible',
    rating: 'Poor',
    sustainabilityScore: 58,
    sustainabilityBreakdown: DEFAULT_BREAKDOWN,
    recommendations: [
      'Apply Copper-based fungicides immediately to halt the spread of Early Blight.',
      'Ensure proper crop rotation in the next planting cycle.',
      'Remove and safely destroy infected plant debris.',
    ],
    explainabilityText:
      'Detected Early Blight with 87.5% confidence. The score is driven by lesion and discoloration patterns linked to fungal pressure. Current risk indicates potential yield and financing impact unless rapid treatment is applied.',
    dataMode: {
      source: 'frontend-mock',
      fallbackUsed: true,
    },
    raw: {
      crop: overrides.crop || null,
      location: overrides.location || null,
      timestamp: new Date().toISOString(),
    },
  };

  return {
    ...base,
    ...overrides,
    sustainabilityBreakdown: {
      ...DEFAULT_BREAKDOWN,
      ...(overrides.sustainabilityBreakdown || {}),
    },
    recommendations: Array.isArray(overrides.recommendations) && overrides.recommendations.length > 0
      ? overrides.recommendations
      : base.recommendations,
    dataMode: {
      ...base.dataMode,
      ...(overrides.dataMode || {}),
      fallbackUsed: true,
    },
  };
};
