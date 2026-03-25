import { buildMockDashboardData } from './mockDashboardData';

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const toRiskLevel = (riskScore) => {
  if (riskScore > 0.7) return 'High Risk';
  if (riskScore > 0.4) return 'Medium Risk';
  return 'Low Risk';
};

const mapReport = (report) => ({
  id: report.id,
  crop: report.crop || report.crop_type || 'Unknown Crop',
  location: report.location || 'Unknown location',
  score: toNumber(report.trust_score, 0),
  timestamp: report.created_at || new Date().toISOString(),
  yield: toNumber(report.yield ?? report.yield_prediction, 0),
  risk: toNumber(report.risk ?? report.risk_score, 0),
});

const buildFromFarmerDetails = (details = {}, user = null) => {
  const reports = Array.isArray(details.recent_reports) ? details.recent_reports : [];
  const mappedReports = reports.map(mapReport).slice(0, 5);
  const latest = mappedReports[0];

  const trustFromCredit = toNumber(details.credit_score?.trust_score ?? details.credit_score?.score, NaN);
  const trustScore = Number.isFinite(trustFromCredit)
    ? trustFromCredit
    : toNumber(latest?.score, 0);

  const riskScore = toNumber(latest?.risk, 0);
  const yieldValue = toNumber(latest?.yield, 0);
  const estimatedLossPercent = Math.round(Math.max(0, Math.min(100, riskScore * 50)));

  return {
    trustScore,
    riskScore,
    riskLevel: toRiskLevel(riskScore),
    yieldValue,
    yieldDelta: -estimatedLossPercent,
    analyses: mappedReports,
    dataMode: {
      source: 'dashboard-real',
      fallbackUsed: false,
      label: `Live data for ${user?.user_metadata?.name || user?.name || 'Farmer'}`,
    },
  };
};

export const getDashboardData = async ({ farmerId, user } = {}) => {
  if (!farmerId) {
    return buildMockDashboardData(user);
  }

  try {
    const response = await fetch(`/api/v1/farmers/${farmerId}/details`);
    if (!response.ok) {
      throw new Error(`Failed to fetch reports: ${response.status}`);
    }

    const json = await response.json();
    const details = json.data || {};
    return buildFromFarmerDetails(details, user);
  } catch (error) {
    console.warn('Dashboard real data unavailable, using fallback mock data.', error);
    return buildMockDashboardData(user);
  }
};
