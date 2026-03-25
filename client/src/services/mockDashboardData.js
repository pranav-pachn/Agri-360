export const buildMockDashboardData = (user = null) => {
  const nameFromUser = user?.user_metadata?.name || user?.name || 'Farmer';

  return {
    trustScore: 742,
    riskScore: 0.35,
    riskLevel: 'Medium Risk',
    yieldValue: 2.8,
    yieldDelta: -12,
    analyses: [
      {
        id: 'mock-report-1',
        crop: 'Wheat',
        location: 'Punjab, India',
        score: 742,
        timestamp: new Date().toISOString(),
        yield: 2.8,
        risk: 0.35,
      },
      {
        id: 'mock-report-2',
        crop: 'Rice',
        location: 'Kerala, India',
        score: 695,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        yield: 2.5,
        risk: 0.41,
      },
      {
        id: 'mock-report-3',
        crop: 'Tomato',
        location: 'Maharashtra, India',
        score: 668,
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        yield: 2.2,
        risk: 0.48,
      },
    ],
    dataMode: {
      source: 'dashboard-mock',
      fallbackUsed: true,
      label: `Showing demo intelligence for ${nameFromUser}`,
    },
  };
};
