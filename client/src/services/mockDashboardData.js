export const buildMockDashboardData = (overrides = {}) => {
  const now = new Date().toISOString();

  const base = {
    summary: {
      totalFarmers: 1240,
      analysesToday: 42,
      avgTrustScore: 645,
      alerts: 3,
    },
    charts: {
      trustScoreDistribution: [
        { bucket: '300-399', count: 40 },
        { bucket: '400-499', count: 100 },
        { bucket: '500-599', count: 300 },
        { bucket: '600-699', count: 500 },
        { bucket: '700-900', count: 300 },
      ],
      yieldTrend: [
        { date: '2026-05-01', yield: 2.1 },
        { date: '2026-05-05', yield: 2.4 },
        { date: '2026-05-10', yield: 2.35 },
        { date: '2026-05-15', yield: 2.5 },
      ],
    },
    recentAnalyses: [
      {
        id: 'analysis-1001',
        farmerId: 'farmer-21',
        image: null,
        disease: 'Leaf Rust',
        trustScore: 520,
        riskLevel: 'Medium',
        timestamp: now,
      },
      {
        id: 'analysis-1002',
        farmerId: 'farmer-99',
        image: null,
        disease: 'Healthy',
        trustScore: 770,
        riskLevel: 'Low',
        timestamp: now,
      },
    ],
    lastUpdated: now,
  };

  return {
    ...base,
    trustScore: 742,
    riskScore: 0.35,
    riskLevel: 'Low Risk',
    yieldValue: 2.8,
    yieldDelta: -12,
    explanation: 'Overall risk is Low Risk. The score reflects crop health, expected yield pressure, repayment strength, and current field volatility.',
    latestReport: {
      crop: 'Rice',
      location: 'Guntur, Andhra Pradesh',
      disease: 'Early Blight',
      yield: 2.8,
      risk: 0.35,
      timestamp: now,
    },
    analyses: [
      {
        id: 'analysis-1001',
        crop: 'Rice',
        location: 'Guntur, Andhra Pradesh',
        disease: 'Early Blight',
        score: 742,
        yield: 2.8,
        risk: 0.35,
        timestamp: now,
      },
    ],
    dataMode: {
      source: 'dashboard-mock',
      fallbackUsed: true,
      label: 'Showing baseline intelligence for Farmer',
    },
    liveWeather: {
      temperatureC: 32,
      humidity: 65,
      windSpeed: 4.2,
      condition: 'Clear',
      normalizedCondition: 'normal',
      location: 'Guntur, Andhra Pradesh',
      fetchedAt: now,
      available: true,
    },
    weatherImpact: {
      deltaPercent: 2,
      deltaScore: 0.02,
      direction: 'increase',
      reason: 'Warm temperature slightly increased crop stress.',
      contributors: ['Warm temperature slightly increased crop stress.'],
    },
    ...overrides,
  };
};

export default buildMockDashboardData;
