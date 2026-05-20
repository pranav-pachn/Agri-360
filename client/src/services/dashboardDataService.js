import { buildMockDashboardData } from './mockDashboardData';
import { getFarmerDetailsRequest } from './farmersApi';
import { api } from './api';

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

const buildRiskExplanation = ({ riskLevel, riskScore, yieldValue, trustScore }) => {
  const safeRiskLevel = riskLevel || toRiskLevel(riskScore);
  const safeRiskScore = toNumber(riskScore, 0);
  const safeYieldValue = toNumber(yieldValue, 0);
  const safeTrustScore = toNumber(trustScore, 0);

  return `Overall risk is ${safeRiskLevel}. The current risk score is ${safeRiskScore.toFixed(2)}, projected yield is ${safeYieldValue.toFixed(1)} tons/hectare, and trust score is ${Math.round(safeTrustScore)}.`;
};

const buildUnavailableWeather = (location = 'Unknown location') => ({
  temperatureC: null,
  humidity: null,
  windSpeed: null,
  condition: 'Unavailable',
  normalizedCondition: 'normal',
  location,
  fetchedAt: new Date().toISOString(),
  available: false,
});

const buildNeutralWeatherImpact = (weather) => ({
  deltaPercent: 0,
  deltaScore: 0,
  direction: 'neutral',
  reason: weather?.available === false
    ? 'Live weather is unavailable, so a neutral weather impact was applied.'
    : 'Current weather conditions are contributing a neutral risk impact.',
  contributors: [],
});

const mapReport = (report, defaults = {}) => ({
  id: report.id,
  crop: report.crop_type || report.crop || 'Unknown Crop',
  location: report.location || defaults.location || 'Unknown location',
  disease: report.disease || defaults.disease || 'Unknown',
  severity: report.severity || defaults.severity || 'Unknown',
  confidence: toNumber(report.confidence, 0),
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

const fetchLiveWeather = async (location) => {
  const safeLocation = String(location || '').trim();
  if (!safeLocation) {
    const weather = buildUnavailableWeather();
    return { weather, impact: buildNeutralWeatherImpact(weather) };
  }

  try {
    const response = await api.get(`/v1/weather/current?location=${encodeURIComponent(safeLocation)}`);
    const weather = response?.weather || buildUnavailableWeather(safeLocation);
    const impact = response?.impact || buildNeutralWeatherImpact(weather);
    return { weather, impact };
  } catch (error) {
    const weather = buildUnavailableWeather(safeLocation);
    return { weather, impact: buildNeutralWeatherImpact(weather) };
  }
};

const buildFromFarmerDetails = async (details = {}, user = null) => {
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
  const riskLevel = toRiskLevel(riskScore);
  const explanation = buildRiskExplanation({ riskLevel, riskScore, yieldValue, trustScore });
  const profileLocation = [details.profile?.district, details.profile?.state].filter(Boolean).join(', ');
  const resolvedLocation = details.location || profileLocation || latestReal?.location || latestCombined?.location || user?.user_metadata?.location || user?.location || 'Nagpur, Maharashtra';
  const liveWeatherResponse = await fetchLiveWeather(resolvedLocation);

  return {
    trustScore,
    riskScore,
    riskLevel,
    yieldValue,
    yieldDelta: -estimatedLossPercent,
    explanation,
    latestReport: latestReal || latestCombined || null,
    liveWeather: liveWeatherResponse.weather,
    weatherImpact: liveWeatherResponse.impact,
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
    return await buildFromFarmerDetails(details, user);
  } catch (error) {
    return buildMockDashboardData(user);
  }
};

export const buildChatContextFromDashboardData = (dashboardData = {}, user = null) => {
  const latestReport = dashboardData.latestReport || dashboardData.analyses?.[0] || {};
  const riskScore = toNumber(dashboardData.riskScore, 0);
  const trustScore = toNumber(dashboardData.trustScore, 0);
  const projectedYield = toNumber(dashboardData.yieldValue ?? latestReport?.yield, 0);
  const riskLevel = dashboardData.riskLevel || toRiskLevel(riskScore);
  const explanation = dashboardData.explanation || buildRiskExplanation({
    riskLevel,
    riskScore,
    yieldValue: projectedYield,
    trustScore,
  });

  return {
    crop: latestReport?.crop || 'Rice',
    location: latestReport?.location || user?.user_metadata?.location || user?.location || 'Unknown location',
    disease: latestReport?.disease || 'Unknown',
    riskScore,
    riskLevel,
    projectedYield,
    trustScore,
    explanation,
  };
};
