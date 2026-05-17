import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

import FarmerProfile from '../components/dashboard/FarmerProfile';
import RiskPanel from '../components/dashboard/RiskPanel';
import CropInsights from '../components/dashboard/CropInsights';
import WeatherImpactCard from '../components/dashboard/WeatherImpactCard';
import Recommendations from '../components/dashboard/Recommendations';
import AnalyticsSection from '../components/dashboard/AnalyticsSection';
import { getDashboardData } from '../services/dashboardDataService';
import { getPendingApplicationsRequest } from '../services/farmersApi';

const buildAnalyticsSnapshot = (dashboardData = {}) => {
  const reports = Array.isArray(dashboardData.analyses) ? dashboardData.analyses : [];
  const districtBuckets = new Map();
  const stateBuckets = new Map();

  const upsertBucket = (bucketMap, key, seed) => {
    if (!bucketMap.has(key)) {
      bucketMap.set(key, {
        ...seed,
        total_reports: 0,
        healthy_reports: 0,
        avg_risk_score_sum: 0,
        avg_health_score_sum: 0,
      });
    }

    return bucketMap.get(key);
  };

  reports.forEach((report, index) => {
    const location = String(report?.location || '').trim();
    const parts = location.split(',').map((part) => part.trim()).filter(Boolean);
    const district = parts[0] || report?.crop || `District ${index + 1}`;
    const state = parts[1] || 'Unknown State';
    const riskScore = Number(report?.risk ?? 0);
    const healthScore = Math.max(0, Math.min(100, Math.round((1 - Math.min(1, Math.max(0, riskScore))) * 100)));
    const isHealthy = String(report?.disease || '').toLowerCase().includes('healthy');

    const districtBucket = upsertBucket(districtBuckets, `${district}::${state}`, {
      district,
      state,
    });

    districtBucket.total_reports += 1;
    districtBucket.healthy_reports += isHealthy ? 1 : 0;
    districtBucket.avg_risk_score_sum += riskScore;
    districtBucket.avg_health_score_sum += healthScore;

    const stateBucket = upsertBucket(stateBuckets, state, {
      state,
    });

    stateBucket.total_reports += 1;
    stateBucket.healthy_reports += isHealthy ? 1 : 0;
    stateBucket.avg_risk_score_sum += riskScore;
    stateBucket.avg_health_score_sum += healthScore;
  });

  return {
    states: Array.from(stateBuckets.values()).map((bucket) => ({
      state: bucket.state,
      avg_risk_score: bucket.total_reports ? bucket.avg_risk_score_sum / bucket.total_reports : 0,
      avg_health_score: bucket.total_reports ? bucket.avg_health_score_sum / bucket.total_reports : 0,
      total_reports: bucket.total_reports,
      healthy_reports: bucket.healthy_reports,
    })),
    districts: Array.from(districtBuckets.values()).map((bucket) => ({
      district: bucket.district,
      state: bucket.state,
      avg_risk_score: bucket.total_reports ? bucket.avg_risk_score_sum / bucket.total_reports : 0,
      avg_health_score: bucket.total_reports ? bucket.avg_health_score_sum / bucket.total_reports : 0,
      total_reports: bucket.total_reports,
      healthy_reports: bucket.healthy_reports,
    })),
  };
};

const toTitleCase = (value = '') =>
  String(value)
    .replace(/[_-]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const getRiskCategory = (score) => {
  if (score >= 0.7) return 'High';
  if (score >= 0.4) return 'Medium';
  return 'Low';
};

const buildRiskData = ({ riskScore, riskLevel, yieldDelta, latestReport, trustScore, weatherImpact }) => {
  const normalizedRisk = Math.max(0, Math.min(1, Number(riskScore) || 0));
  const category = getRiskCategory(normalizedRisk);
  const diseasePenalty = String(latestReport?.disease || '').toLowerCase().includes('healthy') ? 8 : -18;
  const yieldImpact = -(Math.abs(Number(yieldDelta) || 0));
  const financialStrength = Math.round(((Number(trustScore) || 650) - 600) / 12);
  const liveWeatherImpact = Number(weatherImpact?.deltaPercent || 0);
  const weatherStressImpact = -liveWeatherImpact;
  const weatherReason = weatherImpact?.reason || 'Current weather conditions are contributing a neutral risk impact.';

  return {
    riskScore: normalizedRisk.toFixed(2),
    riskCategory: category,
    confidence: `${Math.round(78 + normalizedRisk * 18)}%`,
    breakdown: [
      { factor: 'Disease pressure', impact: diseasePenalty },
      { factor: 'Yield outlook', impact: yieldImpact },
      { factor: 'Financial resilience', impact: financialStrength },
      { factor: 'Live weather overlay', impact: weatherStressImpact },
    ],
    explanation: `Overall risk is ${riskLevel}. The stored score reflects crop health, expected yield pressure, and repayment strength. ${weatherReason}`,
  };
};

const buildRecommendationItems = ({ latestReport, riskScore, yieldDelta }) => {
  const disease = String(latestReport?.disease || '').toLowerCase();
  const recommendations = [];

  if (disease.includes('blight')) {
    recommendations.push('✅ Apply a blight-control fungicide within 48 hours');
  } else if (disease.includes('rust')) {
    recommendations.push('✅ Use a rust-targeted foliar spray and inspect lower leaves');
  } else if (disease.includes('healthy')) {
    recommendations.push('✅ Maintain current nutrient schedule and scouting routine');
  } else {
    recommendations.push('✅ Use nitrogen-based fertilizer where leaf vigor is dropping');
  }

  if ((Number(riskScore) || 0) >= 0.4) {
    recommendations.push('⏳ Delay sowing by 2 weeks if weather volatility remains elevated');
  } else {
    recommendations.push('⏳ Continue sowing on schedule with a 7-day field review');
  }

  if (Math.abs(Number(yieldDelta) || 0) >= 10) {
    recommendations.push('🌧 Monitor rainfall patterns and irrigation timing every 3 days');
  } else {
    recommendations.push('🌧 Monitor rainfall patterns and maintain balanced moisture levels');
  }

  return recommendations;
};

const buildYieldTrend = (analyses = [], fallbackYield = 0) => {
  const trend = analyses
    .slice(0, 5)
    .reverse()
    .map((item, index) => ({
      label: `S${index + 1}`,
      value: Number(item?.yield || 0),
    }))
    .filter((item) => item.value > 0);

  if (trend.length) return trend;

  const base = Number(fallbackYield) || 12;
  return [
    { label: 'S1', value: Math.max(6, Number((base * 0.74).toFixed(1))) },
    { label: 'S2', value: Math.max(7, Number((base * 0.8).toFixed(1))) },
    { label: 'S3', value: Math.max(8, Number((base * 0.88).toFixed(1))) },
    { label: 'S4', value: Math.max(9, Number((base * 0.95).toFixed(1))) },
    { label: 'S5', value: Number(base.toFixed(1)) },
  ];
};

const buildRiskDistribution = (analyticsSnapshot, currentRisk) => {
  const states = Array.isArray(analyticsSnapshot?.states) ? analyticsSnapshot.states : [];

  if (states.length) {
    let low = 0;
    let medium = 0;
    let high = 0;

    states.forEach((row) => {
      const score = Number(row?.avg_risk_score || 0);
      const weight = Number(row?.total_reports || 1);
      if (score >= 0.7) high += weight;
      else if (score >= 0.4) medium += weight;
      else low += weight;
    });

    const total = Math.max(1, low + medium + high);
    return [
      { label: 'Low', value: Math.round((low / total) * 100), tone: 'bg-emerald-400' },
      { label: 'Medium', value: Math.round((medium / total) * 100), tone: 'bg-amber-400' },
      { label: 'High', value: Math.round((high / total) * 100), tone: 'bg-rose-400' },
    ];
  }

  const score = Number(currentRisk) || 0.35;
  const high = Math.round(score * 100);
  const medium = Math.round(Math.max(20, 55 - high / 3));
  const low = Math.max(5, 100 - high - medium);

  return [
    { label: 'Low', value: low, tone: 'bg-emerald-400' },
    { label: 'Medium', value: medium, tone: 'bg-amber-400' },
    { label: 'High', value: high, tone: 'bg-rose-400' },
  ];
};

export default function Dashboard() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trustScore, setTrustScore] = useState(0);
  const [riskScore, setRiskScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState('Low Risk');
  const [yieldData, setYieldData] = useState({});
  const [yieldDelta, setYieldDelta] = useState(0);
  const [liveWeather, setLiveWeather] = useState(null);
  const [weatherImpact, setWeatherImpact] = useState(null);
  const [analyticsSnapshot, setAnalyticsSnapshot] = useState({ states: [], districts: [] });
  const loadRequestIdRef = useRef(0);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    loadDashboardData(user.id);

    const subscription = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'crop_reports' },
        (payload) => {
          if (payload.new?.farmer_id === user.id) {
            loadDashboardData(user.id);
          }
        }
      )
      .subscribe();

    const handleManualRefresh = () => {
      loadDashboardData(user.id);
    };

    window.addEventListener('agri:analysis-created', handleManualRefresh);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('agri:analysis-created', handleManualRefresh);
    };
  }, [user?.id]);

  const loadDashboardData = async (farmerId) => {
    const requestId = ++loadRequestIdRef.current;

    try {
      const [data] = await Promise.all([
        getDashboardData({ farmerId, user }),
        getPendingApplicationsRequest(42),
      ]);

      if (requestId !== loadRequestIdRef.current) {
        return;
      }

      setAnalyses(data.analyses);
      setTrustScore(data.trustScore);
      setRiskScore(data.riskScore);
      setRiskLevel(data.riskLevel);
      setYieldData({ predictedYield: data.yieldValue });
      setYieldDelta(data.yieldDelta);
      setLiveWeather(data.liveWeather || null);
      setWeatherImpact(data.weatherImpact || null);
      setAnalyticsSnapshot(buildAnalyticsSnapshot(data));
    } catch (error) {
      if (requestId !== loadRequestIdRef.current) {
        return;
      }

      const fallback = {
        analyses: [],
        trustScore: 742,
        riskScore: 0.35,
        riskLevel: 'Medium Risk',
        yieldValue: 12,
        yieldDelta: -12,
        liveWeather: null,
        weatherImpact: null,
      };

      setAnalyses(fallback.analyses);
      setTrustScore(fallback.trustScore);
      setRiskScore(fallback.riskScore);
      setRiskLevel(fallback.riskLevel);
      setYieldData({ predictedYield: fallback.yieldValue });
      setYieldDelta(fallback.yieldDelta);
      setLiveWeather(fallback.liveWeather);
      setWeatherImpact(fallback.weatherImpact);
      setAnalyticsSnapshot(buildAnalyticsSnapshot({ analyses: fallback.analyses }));
    } finally {
      if (requestId === loadRequestIdRef.current) {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center rounded-2xl bg-slate-800 p-12 shadow-md">
          <p className="text-lg font-semibold">Loading dashboard intelligence...</p>
        </div>
      </div>
    );
  }

  const latestReport = analyses?.[0] || {};
  const farmerName = user?.user_metadata?.name || 'Ramesh Kumar';
  const farmerLocation = user?.user_metadata?.location || latestReport?.location || 'Guntur, Andhra Pradesh';
  const cropName = latestReport?.crop || 'Rice';
  const diseaseName = latestReport?.disease || 'Early Blight';
  const confidence = Math.round(78 + Math.max(0, Math.min(1, Number(riskScore) || 0)) * 18);
  const yieldValue = Number(yieldData?.predictedYield || latestReport?.yield || 12);
  const lossPercent = Math.abs(Number(yieldDelta) || 0);
  const riskData = buildRiskData({ riskScore, riskLevel, yieldDelta, latestReport, trustScore, weatherImpact });
  const recommendationItems = buildRecommendationItems({ latestReport, riskScore, yieldDelta });
  const yieldTrend = buildYieldTrend(analyses, yieldValue);
  const riskDistribution = buildRiskDistribution(analyticsSnapshot, riskScore);

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <FarmerProfile
          name={farmerName}
          location={farmerLocation}
          crop={toTitleCase(cropName)}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <RiskPanel riskData={riskData} />
          <CropInsights
            disease={toTitleCase(diseaseName)}
            confidence={confidence}
            yieldValue={Number(yieldValue.toFixed(1))}
            lossPercent={lossPercent}
          />
          <WeatherImpactCard weather={liveWeather} impact={weatherImpact} />
        </div>

        <Recommendations items={recommendationItems} />

        <AnalyticsSection
          yieldTrend={yieldTrend}
          riskDistribution={riskDistribution}
        />
      </div>
    </div>
  );
}
