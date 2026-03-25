/**
 * Trust Score Engine
 */

const clampTrustScore = (score) => Math.max(300, Math.min(900, Math.round(score)));

const getSeverityMultiplier = (severity = 'Unknown') => {
  if (!severity || typeof severity !== 'string') return 1.0;
  
  const s = String(severity).toLowerCase().trim();
  if (s === 'medium') return 0.9;
  if (s === 'high') return 0.8;
  if (['critical', 'severe'].includes(s)) return 0.65;
  return 1.0;
};

const calculateTrustScore = (
  health,
  normalizedYield,
  sustainability,
  behavior = 80,
  compliance = 85,
  external = 75,
  options = {}
) => {
  const severity = options.severity || 'Unknown';
  const multiplier = Number.isFinite(options.severityMultiplier)
    ? options.severityMultiplier
    : getSeverityMultiplier(severity);

  const cropHealthComponent = 0.30 * health;
  const yieldComponent = 0.25 * normalizedYield;
  const sustainabilityComponent = 0.20 * sustainability;
  const behaviorComponent = 0.10 * behavior;
  const complianceComponent = 0.10 * compliance;
  const externalComponent = 0.05 * external;

  const rawScore = cropHealthComponent + yieldComponent + sustainabilityComponent + behaviorComponent + complianceComponent + externalComponent;
  const trustScoreBeforePenalty = clampTrustScore(300 + (rawScore * 6));
  const trustScore = clampTrustScore(trustScoreBeforePenalty * multiplier);
  const customPenalty = trustScoreBeforePenalty - trustScore;
  
  let rating = "Fair";
  if (trustScore >= 750) rating = "Excellent";
  else if (trustScore >= 650) rating = "Good";
  else if (trustScore >= 500) rating = "Average";
  
  const loanEligible = trustScore >= 600;

  return {
    trustScore,
    rating,
    loanEligible,
    severity_penalty: customPenalty,
    trust_score_before_penalty: trustScoreBeforePenalty,
    trust_score_after_penalty: trustScore,
    breakdown: {
      crop_health: Number(cropHealthComponent.toFixed(1)),
      yield: Number(yieldComponent.toFixed(1)),
      sustainability: Number(sustainabilityComponent.toFixed(1)),
      behavior: Number(behaviorComponent.toFixed(1)),
      compliance: Number(complianceComponent.toFixed(1)),
      external: Number(externalComponent.toFixed(1))
    },
    rawScoreDetails: {
      health,
      normalizedYield,
      sustainability,
      behavior,
      compliance,
      external
    }
  };
};

const getExplainabilityReason = (rating) => {
    if (rating === "Excellent" || rating === "Good") {
        return "Your score is high due to good crop health and yield performance";
    } else if (rating === "Average") {
        return "Your score is average. Improving crop health and sustainability practices can increase it.";
    }
    return "Your score needs improvement. Focus on enhancing yield and crop health.";
};

module.exports = {
  calculateTrustScore,
  getExplainabilityReason,
  getSeverityMultiplier,
  clampTrustScore
};