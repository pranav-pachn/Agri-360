export const buildMockResultData = (overrides = {}) => {
  const base = {
    id: 'mock-analysis-1',
    image: null,
    disease: 'Healthy',
    confidence: 99.9,
    severity: 'None',
    riskLevel: 'Low',
    riskScore: 0,
    projectedYield: '?.? tons/ha',
    estimatedLoss: 0,
    trustScore: 750,
    eligibility: 'Eligible',
    rating: 'A',
    sustainabilityScore: 65,
    sustainabilityBreakdown: {
      water_efficiency: 60,
      fertilizer_optimization: 60,
      crop_diversity: 70,
      soil_health: 70,
    },
    recommendations: [
      'No treatment necessary — crop appears healthy.',
      'Continue routine monitoring and periodic rescans.'
    ],
    explainabilityText: null,
    dataMode: {
      source: 'mock',
      fallbackUsed: true,
    },
    raw: {
      crop: null,
      location: null,
      timestamp: null,
    },
  };

  return {
    ...base,
    ...overrides,
  };
};

export default buildMockResultData;
