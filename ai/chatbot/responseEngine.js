const INTENTS = {
  disease: ["disease", "infection", "blight", "fungus", "spot", "leaf problem"],
  risk: ["risk", "danger", "threat", "safe", "problem"],
  yield: ["yield", "production", "harvest", "output"],
  loan: ["loan", "credit", "money", "finance", "eligible"],
  help: ["help", "what should i do", "advice", "guide"],
  income: ["profit", "income", "earnings"],
};

const matchIntent = (text, keywords) => keywords.some((keyword) => text.includes(keyword));

const getResponse = (message, context = {}) => {
  const text = String(message || "").toLowerCase();
  const disease = context.disease || "unknown";
  const riskLevel = context.riskLevel || "Low Risk";
  const projectedYield = context.projectedYield || "N/A";
  const trustScore = Number(context.trustScore || 0);
  const hasDiseaseIntent = matchIntent(text, INTENTS.disease);
  const hasRiskIntent = matchIntent(text, INTENTS.risk);
  const hasYieldIntent = matchIntent(text, INTENTS.yield);
  const hasLoanIntent = matchIntent(text, INTENTS.loan);
  const hasHelpIntent = matchIntent(text, INTENTS.help);
  const hasIncomeIntent = matchIntent(text, INTENTS.income);

  if (hasYieldIntent && hasLoanIntent) {
    return `Expected yield is ${projectedYield} tons/hectare. Loan eligibility: ${
      trustScore > 60 ? "Eligible" : "Not eligible yet"
    }.`;
  }

  if (hasDiseaseIntent && hasRiskIntent) {
    const riskMessage = riskLevel === "High Risk"
      ? "The crop is currently at high risk and needs immediate attention."
      : riskLevel === "Medium Risk"
        ? "The crop has moderate risk, so monitor it closely."
        : "The crop is currently stable with low risk.";

    return `Disease detected: ${disease}. Spray fungicide within 48 hours and avoid overwatering. ${riskMessage}`;
  }

  if (hasDiseaseIntent) {
    return `Disease detected: ${disease}. Spray fungicide within 48 hours and avoid overwatering.`;
  }

  if (hasRiskIntent) {
    if (riskLevel === "High Risk") {
      return "High risk detected ⚠️. Immediate action required within 24–48 hours.";
    }

    if (riskLevel === "Medium Risk") {
      return "Moderate risk. Monitor crop regularly and take preventive measures.";
    }

    return "Low risk. Crop condition is stable.";
  }

  if (hasYieldIntent) {
    return `Expected yield is ${projectedYield} tons/hectare.`;
  }

  if (hasIncomeIntent) {
    return "Yield and risk directly affect your income.";
  }

  if (hasLoanIntent) {
    return trustScore > 60
      ? "You are eligible for a loan."
      : "Improve farm stability to increase loan eligibility.";
  }

  if (hasHelpIntent) {
    if (riskLevel === "High Risk") {
      return "Your crop is at high risk. Apply treatment immediately and monitor closely.";
    }

    return "You can ask about disease, yield, or loan eligibility.";
  }

  return "Please upload crop image or ask about disease, yield, risk, or loan eligibility.";
};

module.exports = { getResponse, INTENTS, matchIntent };
