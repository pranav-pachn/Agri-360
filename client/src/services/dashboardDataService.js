import { buildMockDashboardData } from './mockDashboardData';
import { getFarmerDetailsRequest } from './farmersApi';

const TARGET_REPORT_COUNT = 5;

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const toRiskLevel = (riskScore) => {
  if (riskScore > 0.7) return 'High Risk';
  if (riskScore > 0.4) return 'Medium Risk';
  return 'Low Risk';
};

const mapReport = (report, defaults = {}) => ({
  id: report.id,
  crop: report.crop_type || report.crop || 'Unknown Crop',
  location: report.location || defaults.location || 'Unknown location',
  score: toNumber(report.trust_score ?? report.score, defaults.score ?? 0),
  timestamp: report.created_at || new Date().toISOString(),
  yield: toNumber(report.yield_prediction ?? report.yield, 0),
  risk: toNumber(report.risk_score ?? report.risk, 0),
});

const mergeReports = (realReports = [], mockReports = [], targetCount = TARGET_REPORT_COUNT) => {
  const merged = [];
  const seen = new Set();

  const pushUnique = (report) => {
    if (!report) return;
    const key = report.id || `${report.crop}-${report.timestamp}`;
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(report);
  };

  realReports.forEach(pushUnique);
  mockReports.forEach(pushUnique);

  return merged.slice(0, targetCount);
};

const buildFromFarmerDetails = (details = {}, user = null) => {
  const reports = Array.isArray(details.recent_reports) ? details.recent_reports : [];
  const trustFromCredit = toNumber(details.credit_score?.trust_score ?? details.credit_score?.score, NaN);
  const fallbackTrust = Number.isFinite(trustFromCredit) ? trustFromCredit : 700;
  const mappedRealReports = reports.map((report) =>
    mapReport(report, {
      location: details.location,
      score: fallbackTrust,
    })
  );

  const mockPayload = buildMockDashboardData(user);
  const combinedReports = mergeReports(mappedRealReports, mockPayload.analyses, TARGET_REPORT_COUNT);
  const latestReal = mappedRealReports[0];
  const latestCombined = combinedReports[0];

  const trustScore = Number.isFinite(trustFromCredit)
    ? trustFromCredit
    : toNumber(latestReal?.score ?? latestCombined?.score, 0);

  const riskScore = toNumber(latestReal?.risk ?? latestCombined?.risk, 0);
  const yieldValue = toNumber(latestReal?.yield ?? latestCombined?.yield, 0);
  const estimatedLossPercent = Math.round(Math.max(0, Math.min(100, riskScore * 50)));

  return {
    trustScore,
    riskScore,
    riskLevel: toRiskLevel(riskScore),
    yieldValue,
    yieldDelta: -estimatedLossPercent,
    analyses: combinedReports,
    dataMode: {
      source: mappedRealReports.length ? 'dashboard-mixed' : 'dashboard-mock',
      fallbackUsed: combinedReports.length > mappedRealReports.length,
      label: mappedRealReports.length
        ? `Live + baseline data for ${user?.user_metadata?.name || user?.name || 'Farmer'}`
        : `Showing baseline intelligence for ${user?.user_metadata?.name || user?.name || 'Farmer'}`,
    },
  };
};

export const getDashboardData = async ({ farmerId, user } = {}) => {
  if (!farmerId) {
    return buildMockDashboardData(user);
  }

  try {
    const response = await getFarmerDetailsRequest(farmerId);
    if (!response.ok) {
      throw new Error(`Failed to fetch reports: ${response.status}`);
    }

    const json = await response.json();
    const details = json.data || {};
    return buildFromFarmerDetails(details, user);
  } catch (error) {
    return buildMockDashboardData(user);
  }
};
