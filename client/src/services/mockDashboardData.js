export const buildMockDashboardData = (user = null) => {
  const now = new Date().toISOString();
  const derivedName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Farmer';

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
    trustScore: 0,
    riskScore: 0,
    riskLevel: 'Low Risk',
    yieldValue: 0,
    yieldDelta: 0,
    explanation: 'No analysis data yet. Run your first crop diagnosis to see personalized insights.',
    latestReport: null,
    analyses: [],
    dataMode: {
      source: 'dashboard-mock',
      fallbackUsed: true,
      label: `Showing baseline intelligence for ${derivedName}`,
    },
    liveWeather: null,
    weatherImpact: null,
  };
};

export default buildMockDashboardData;
