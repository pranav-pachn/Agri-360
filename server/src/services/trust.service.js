/**
 * Trust Score Engine
 */

const calculateTrustScore = (health, normalizedYield, sustainability, behavior = 80, compliance = 85, external = 75) => {
  const cropHealthComponent = 0.30 * health;
  const yieldComponent = 0.25 * normalizedYield;
  const sustainabilityComponent = 0.20 * sustainability;
  const behaviorComponent = 0.10 * behavior;
  const complianceComponent = 0.10 * compliance;
  const externalComponent = 0.05 * external;

  const rawScore = cropHealthComponent + yieldComponent + sustainabilityComponent + behaviorComponent + complianceComponent + externalComponent;
  
  const trustScore = Math.round(300 + (rawScore * 6));
  
  let rating = "Fair";
  if (trustScore >= 750) rating = "Excellent";
  else if (trustScore >= 650) rating = "Good";
  else if (trustScore >= 500) rating = "Average";
  
  const loanEligible = trustScore >= 600;

  return {
    trustScore,
    rating,
    loanEligible,
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
  getExplainabilityReason
};