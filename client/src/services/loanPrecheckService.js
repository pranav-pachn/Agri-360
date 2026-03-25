import { api } from './api';
import { supabase } from '../lib/supabase';

const FALLBACK_VALUES = {
  farmerName: 'Farmer',
  location: 'Punjab, India',
  cropType: 'Wheat',
  riskScorePercent: 35,
  riskLevel: 'Medium',
  yieldPrediction: 2.8,
  sustainabilityScore: 78,
  trustScore: 742,
  trustGrade: 'A',
  isEligible: true,
};

const pickLoanAmount = (trustScore) => {
  if (trustScore >= 760) return 150000;
  if (trustScore >= 700) return 100000;
  if (trustScore >= 650) return 75000;
  return 50000;
};

const pickInterestTier = (trustScore) => {
  if (trustScore >= 700) return 'Low Risk (8-10%)';
  if (trustScore >= 620) return 'Standard Risk (10-13%)';
  return 'High Risk (13-16%)';
};

const pickInsuranceRisk = (riskPercent) => {
  if (riskPercent <= 30) return 'Low';
  if (riskPercent <= 60) return 'Moderate';
  return 'High';
};

const pickTrustGrade = (trustScore) => {
  if (trustScore >= 720) return 'A';
  if (trustScore >= 660) return 'B';
  if (trustScore >= 600) return 'C';
  return 'D';
};

const toRiskPercent = (riskValue) => {
  const numeric = Number(riskValue);
  if (!Number.isFinite(numeric)) return FALLBACK_VALUES.riskScorePercent;
  if (numeric <= 1) return Math.round(numeric * 100);
  return Math.round(numeric);
};

const toYieldTonsPerAcre = (yieldValue) => {
  const numeric = Number(yieldValue);
  if (!Number.isFinite(numeric) || numeric <= 0) return FALLBACK_VALUES.yieldPrediction;

  // Existing pipeline commonly reports tons/hectare; convert for panel presentation.
  return Number((numeric / 2.471).toFixed(1));
};

const asLoanPayload = (raw, user) => {
  const trustScore = Number(raw.trust_score);
  const riskPercent = toRiskPercent(raw.risk);
  const sustainabilityScore = Number(raw.sustainability_index);

  const safeTrustScore = Number.isFinite(trustScore) ? trustScore : FALLBACK_VALUES.trustScore;
  const safeSustainability = Number.isFinite(sustainabilityScore)
    ? Math.round(sustainabilityScore)
    : FALLBACK_VALUES.sustainabilityScore;

  const trustGrade = pickTrustGrade(safeTrustScore);
  const isEligible = safeTrustScore >= 600;
  const yieldPrediction = toYieldTonsPerAcre(raw.yield);
  const loanAmount = pickLoanAmount(safeTrustScore);

  return {
    farmerName: user?.user_metadata?.name || user?.name || FALLBACK_VALUES.farmerName,
    location: raw.location || user?.user_metadata?.location || FALLBACK_VALUES.location,
    cropType: raw.crop || FALLBACK_VALUES.cropType,
    riskScorePercent: riskPercent,
    riskLevel: riskPercent <= 30 ? 'Low' : riskPercent <= 60 ? 'Medium' : 'High',
    yieldPrediction,
    sustainabilityScore: safeSustainability,
    trustScore: safeTrustScore,
    trustGrade,
    isEligible,
    smartInsight:
      riskPercent <= 40
        ? 'Based on your crop health and yield stability, you are classified as a low-risk borrower.'
        : 'Your current risk profile is moderate. Following agronomy recommendations can improve lender confidence.',
    eligibleLoanAmount: loanAmount,
    interestTier: pickInterestTier(safeTrustScore),
    insuranceRisk: pickInsuranceRisk(riskPercent),
  };
};

const fallbackPayload = (user, dashboardSnapshot = {}) => {
  const trustScore = Number(dashboardSnapshot.trustScore);
  const riskScore = Number(dashboardSnapshot.riskScore);
  const sustainability = Number(dashboardSnapshot.sustainabilityScore);
  const yieldFromSnapshot = Number(dashboardSnapshot.yieldValue);

  const mergedTrust = Number.isFinite(trustScore) && trustScore > 0 ? trustScore : FALLBACK_VALUES.trustScore;
  const mergedRisk = Number.isFinite(riskScore)
    ? riskScore <= 1
      ? Math.round(riskScore * 100)
      : Math.round(riskScore)
    : FALLBACK_VALUES.riskScorePercent;

  const mergedYield = Number.isFinite(yieldFromSnapshot) && yieldFromSnapshot > 0
    ? yieldFromSnapshot
    : FALLBACK_VALUES.yieldPrediction;

  const mergedSustainability = Number.isFinite(sustainability) && sustainability > 0
    ? Math.round(sustainability)
    : FALLBACK_VALUES.sustainabilityScore;

  const trustGrade = pickTrustGrade(mergedTrust);
  const isEligible = mergedTrust >= 600;

  return {
    farmerName: user?.user_metadata?.name || user?.name || FALLBACK_VALUES.farmerName,
    location: user?.user_metadata?.location || FALLBACK_VALUES.location,
    cropType: dashboardSnapshot.cropType || FALLBACK_VALUES.cropType,
    riskScorePercent: mergedRisk,
    riskLevel: mergedRisk <= 30 ? 'Low' : mergedRisk <= 60 ? 'Medium' : 'High',
    yieldPrediction: mergedYield,
    sustainabilityScore: mergedSustainability,
    trustScore: mergedTrust,
    trustGrade,
    isEligible,
    smartInsight:
      'Based on your crop health and yield stability, you are classified as a low-risk borrower.',
    eligibleLoanAmount: pickLoanAmount(mergedTrust),
    interestTier: pickInterestTier(mergedTrust),
    insuranceRisk: pickInsuranceRisk(mergedRisk),
  };
};

const fetchFromApi = async (user) => {
  const records = await api.get('/analysis');
  if (!Array.isArray(records) || records.length === 0) return null;
  return asLoanPayload(records[0], user);
};

const fetchFromSupabase = async (user) => {
  const { data, error } = await supabase
    .from('crop_reports')
    .select('crop, location, risk, yield, sustainability_index, trust_score, created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return asLoanPayload(data, user);
};

export const getLoanPrecheckData = async ({ user, dashboardSnapshot } = {}) => {
  try {
    const apiPayload = await fetchFromApi(user);
    if (apiPayload) {
      return apiPayload;
    }
  } catch (error) {
    console.warn('Loan pre-check API unavailable, trying Supabase fallback.', error);
  }

  try {
    const supabasePayload = await fetchFromSupabase(user);
    if (supabasePayload) {
      return supabasePayload;
    }
  } catch (error) {
    console.warn('Loan pre-check Supabase fallback unavailable, using local fallback.', error);
  }

  return fallbackPayload(user, dashboardSnapshot);
};
