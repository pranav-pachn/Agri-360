const INTENTS = {
  disease: ['disease', 'infection', 'blight', 'fungus', 'spot', 'leaf problem', 'रोग', 'వ్యాధి'],
  risk: ['risk', 'danger', 'threat', 'safe', 'problem', 'जोखिम', 'రిస్క్', 'ప్రమాదం'],
  yield: ['yield', 'production', 'harvest', 'output', 'उपज', 'దిగుబడి'],
  loan: ['loan', 'credit', 'money', 'finance', 'eligible', 'लोन', 'ऋण', 'లోన్', 'రుణ'],
  trust: ['trust', 'trust score', 'score', 'विश्वास', 'ट्रस्ट', 'నమ్మకం', 'ట్రస్ట్'],
  why: ['why', 'reason', 'explain', 'because', 'क्यों', 'क्यूँ', 'कாரண', 'ఎందుకు', 'వివరించ'],
};

const matchIntent = (text, keywords) => keywords.some((keyword) => text.includes(keyword));

const toNumber = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const normalizeRiskLevel = (riskLevel, riskScore) => {
  if (riskLevel) return String(riskLevel);

  const safeRisk = toNumber(riskScore, 0);
  if (safeRisk > 0.7) return 'High Risk';
  if (safeRisk > 0.4) return 'Medium Risk';
  return 'Low Risk';
};

const getLoanThreshold = (trustScore) => (trustScore > 100 ? 600 : 60);

const normalizeExplanation = (context = {}) => {
  if (context.explanation) return String(context.explanation).trim();

  const riskLevel = normalizeRiskLevel(context.riskLevel, context.riskScore);
  const crop = context.crop || 'your crop';
  const location = context.location ? ` in ${context.location}` : '';
  return `Overall risk is ${riskLevel} for ${crop}${location}. The score reflects crop health, expected yield pressure, repayment strength, and current field volatility.`;
};

const getChatResponse = (message, context = {}) => {
  const text = String(message || '').toLowerCase();
  const disease = context.disease || 'Unknown';
  const crop = context.crop || 'your crop';
  const riskScore = toNumber(context.riskScore, 0);
  const riskLevel = normalizeRiskLevel(context.riskLevel, riskScore);
  const projectedYield = toNumber(context.projectedYield, 0);
  const trustScore = Math.round(toNumber(context.trustScore, 0));
  const explanation = normalizeExplanation(context);
  const eligibleForLoan = trustScore >= getLoanThreshold(trustScore);

  const hasDiseaseIntent = matchIntent(text, INTENTS.disease);
  const hasRiskIntent = matchIntent(text, INTENTS.risk);
  const hasYieldIntent = matchIntent(text, INTENTS.yield);
  const hasLoanIntent = matchIntent(text, INTENTS.loan);
  const hasTrustIntent = matchIntent(text, INTENTS.trust);
  const hasWhyIntent = matchIntent(text, INTENTS.why);

  if (hasYieldIntent) {
    return `Your projected yield is ${projectedYield.toFixed(1)} tons/hectare.`;
  }

  if (hasWhyIntent) {
    return `Here is why: ${explanation}`;
  }

  if (hasRiskIntent) {
    return `Your risk is ${riskScore.toFixed(2)} (${riskLevel}). ${explanation}`;
  }

  if (hasLoanIntent) {
    return eligibleForLoan
      ? `You are eligible for a loan with moderate confidence. Your trust score is ${trustScore}, and current risk is ${riskLevel}.`
      : `Your current trust score is ${trustScore}, which is below the current loan approval range.`;
  }

  if (hasTrustIntent) {
    return eligibleForLoan
      ? `Your trust score is ${trustScore}. This currently supports loan eligibility.`
      : `Your trust score is ${trustScore}. Improving yield stability and lowering risk will strengthen eligibility.`;
  }

  if (hasDiseaseIntent) {
    return `The latest crop diagnosis indicates ${disease} for ${crop}.`;
  }

  return 'Please ask about risk, yield, trust score, or loan eligibility.';
};

module.exports = { getResponse: getChatResponse, getChatResponse, INTENTS, matchIntent };
