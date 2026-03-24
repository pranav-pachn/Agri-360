/**
 * 🌾 Agri Intelligence Enhancer
 * ==============================
 * Overlays geo-contextual, seasonal, and crop-specific intelligence
 * on top of raw AI inference output to produce a complete diagnostic payload.
 *
 * This is Step 2 of the AI pipeline:
 *
 *   inference.js (AI output)
 *       ↓
 *   enhancePrediction()    ← YOU ARE HERE
 *       ↓
 *   { crop, disease, confidence, riskFactor, estimatedLoss, ... }
 */

// ─── Geo-Contextual Risk Database ──────────────────────────────────────────────
// Real Indian state agricultural risk profiles based on climate & seasonal patterns
const STATE_RISK_PROFILES = {
  "Andhra Pradesh": {
    riskFactor: "High Humidity Risk",
    primaryThreat: "Fungal Diseases",
    rainfall: "High",
    season: "Kharif-dominant",
    notes: "Coastal humidity accelerates fungal spread. Monitor closely after monsoon."
  },
  "Telangana": {
    riskFactor: "High Humidity Risk",
    primaryThreat: "Blight & Leaf Spot",
    rainfall: "High",
    season: "Kharif-dominant",
    notes: "Similar to Andhra Pradesh. Black cotton soil retains moisture — root rot risk."
  },
  "Punjab": {
    riskFactor: "Moderate Risk",
    primaryThreat: "Rust Diseases",
    rainfall: "Medium",
    season: "Rabi-dominant",
    notes: "Cold winters increase wheat rust susceptibility. Irrigated regions have lower drought risk."
  },
  "Haryana": {
    riskFactor: "Moderate Risk",
    primaryThreat: "Rust & Aphid Infestation",
    rainfall: "Medium",
    season: "Rabi-dominant",
    notes: "Paddy-wheat rotation zones face high pest pressure after harvest."
  },
  "Rajasthan": {
    riskFactor: "High Drought Risk",
    primaryThreat: "Drought Stress & Tip Burn",
    rainfall: "Very Low",
    season: "Rabi-dominant",
    notes: "Arid conditions cause nutrient deficiency and wilting. Drip irrigation critical."
  },
  "Gujarat": {
    riskFactor: "Moderate-High Risk",
    primaryThreat: "Cotton Bollworm & Aphids",
    rainfall: "Medium",
    season: "Kharif-dominant",
    notes: "Major cotton belt. Bollworm is a primary concern in Saurashtra region."
  },
  "Maharashtra": {
    riskFactor: "Variable Risk",
    primaryThreat: "Blast & Leaf Blight",
    rainfall: "Variable",
    season: "Kharif-dominant",
    notes: "Vidarbha cotton region and Konkan rice belt have distinctly different disease profiles."
  },
  "Uttar Pradesh": {
    riskFactor: "Moderate Risk",
    primaryThreat: "Sugarcane Red Rot & Leaf Scorch",
    rainfall: "Medium-High",
    season: "Both Kharif & Rabi",
    notes: "Largest sugarcane producer. Excess irrigation in indo-gangetic plain causes waterlogging."
  },
  "Madhya Pradesh": {
    riskFactor: "Low-Moderate Risk",
    primaryThreat: "Soybean Yellow Mosaic Virus",
    rainfall: "Medium",
    season: "Kharif-dominant",
    notes: "Soybean and wheat belt. YMV spread via whitefly is primary concern."
  },
  "Karnataka": {
    riskFactor: "Moderate Risk",
    primaryThreat: "Rice Blast & Coffee Leaf Rust",
    rainfall: "High (Western Ghats)",
    season: "Kharif-dominant",
    notes: "Diverse agri-zones. Coffee estates in Coorg face leaf rust under high humidity."
  },
  "Kerala": {
    riskFactor: "High Humidity Risk",
    primaryThreat: "Phytophthora / Downy Mildew",
    rainfall: "Very High",
    season: "Year-round",
    notes: "Tropical climate with 3000mm+ rainfall. Fungal diseases extremely prevalent."
  },
  "Tamil Nadu": {
    riskFactor: "High Risk (Dual Season)",
    primaryThreat: "Rice Tungro & Sheath Blight",
    rainfall: "High (Northeast Monsoon)",
    season: "Both Samba & Kuruvai",
    notes: "Two major rice seasons. Tungro virus spread by green leafhopper is key threat."
  },
  "West Bengal": {
    riskFactor: "High Humidity Risk",
    primaryThreat: "Rice Blast & Brown Plant Hopper",
    rainfall: "High",
    season: "Kharif-dominant",
    notes: "Major rice bowl. High humidity makes it ideal for blast and BPH outbreaks."
  },
  "Bihar": {
    riskFactor: "Moderate-High Risk",
    primaryThreat: "Maize Lethal Necrosis & Stem Borer",
    rainfall: "Medium-High",
    season: "Kharif-dominant",
    notes: "Flood-prone Kosi region has high wilt and root rot incidence post-inundation."
  },
  "Odisha": {
    riskFactor: "High Risk (Cyclone-prone)",
    primaryThreat: "Rice Blast & Bacterial Leaf Blight",
    rainfall: "Very High",
    season: "Kharif-dominant",
    notes: "Cyclone-induced flooding causes mass crop losses and BLB outbreaks."
  }
};

/** Maps severity string to estimated crop loss percentage */
const SEVERITY_TO_LOSS = {
  "None":     "< 5%",
  "Low":      "5–10%",
  "Medium":   "10–20%",
  "High":     "25–40%",
  "Critical": "40–70%",
  "Unknown":  "Unknown"
};

/** Maps severity string to urgency label */
const SEVERITY_TO_URGENCY = {
  "None":     "Routine",
  "Low":      "Low",
  "Medium":   "Medium",
  "High":     "High",
  "Critical": "Immediate Action Required",
  "Unknown":  "Assessment Needed"
};

// ─── Main Enhancer Function ───────────────────────────────────────────────────

/**
 * Enhance an AI inference result with geo-contextual and agri-specific intelligence.
 *
 * @param {InferenceResult} result - Output from inference.js runInference()
 * @param {string} location - User-provided farm location (state or city, state)
 * @param {string} [cropType] - Optional explicit crop type for crop-specific checks
 * @returns {EnhancedResult} Fully enriched diagnostic payload
 */
const enhancePrediction = (result, location, cropType = null) => {
  // ── 1. Look up geo-risk profile from Indian state database ──────────────────
  const stateProfile = _getStateProfile(location);

  // ── 2. Compute combined risk from disease severity + geographic factors ──────
  const geoRisk = _computeGeoRisk(result.severity, stateProfile);

  // ── 3. Map severity to estimated economic loss ──────────────────────────────
  const estimatedLoss = SEVERITY_TO_LOSS[result.severity] || SEVERITY_TO_LOSS["Unknown"];

  // ── 4. Build the recommended action combining AI advice + moisture monitoring
  const recommendedAction = _buildRecommendedAction(result, stateProfile);

  // ── 5. Generate urgency label for frontend badge rendering ──────────────────
  const urgency = SEVERITY_TO_URGENCY[result.severity] || "Assessment Needed";

  // ── 6. Crop-specific advisory overlay ──────────────────────────────────────
  const cropAdvisory = _getCropAdvisory(cropType || result.crop, stateProfile);

  // ── 7. Return fully enriched prediction ─────────────────────────────────────
  return {
    // Spread original AI inference result
    ...result,

    // Geo-contextual enrichments
    riskFactor: stateProfile.riskFactor,
    primaryThreat: stateProfile.primaryThreat,
    seasonalNote: stateProfile.notes,
    rainfall: stateProfile.rainfall,
    season: stateProfile.season,

    // Economic intelligence
    estimatedLoss,
    geoRisk,
    urgency,

    // Enriched action string (AI advice + moisture note)
    recommendedAction,

    // Crop + location specific advisory
    cropAdvisory,

    // Source tracing
    enhanced: true,
    enhanced_by: "AgriEnhancer v1.0"
  };
};

// ─── Private Helpers ─────────────────────────────────────────────────────────

/**
 * Extracts state from "City, State" formatted location strings.
 * Falls back to the full location string if no comma present.
 * @private
 */
const _getStateProfile = (location) => {
  if (!location) return _getDefaultProfile();

  // Attempt to match "City, State" format
  const parts = location.split(',');
  const state = parts.length > 1
    ? parts[parts.length - 1].trim()
    : location.trim();

  // Find profile by state name (case-insensitive partial match)
  const key = Object.keys(STATE_RISK_PROFILES).find(
    k => state.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(state.toLowerCase())
  );

  return key ? STATE_RISK_PROFILES[key] : _getDefaultProfile(state);
};

/**
 * Combine disease severity + geography to produce a human-readable risk label.
 * @private
 */
const _computeGeoRisk = (severity, stateProfile) => {
  if (severity === "Critical" || severity === "High") {
    return stateProfile.riskFactor === "High Humidity Risk"
      ? "🚨 Elevated — Disease likely to spread rapidly in humid conditions"
      : "⚠️ High — Treat immediately to prevent further crop loss";
  }
  if (severity === "Medium") {
    return `⚠️ Moderate — ${stateProfile.riskFactor}. Monitor closely.`;
  }
  if (severity === "None" || severity === "Low") {
    return `✅ Low — ${stateProfile.riskFactor}. Preventive care recommended.`;
  }
  return `ℹ️ Unknown — ${stateProfile.riskFactor}`;
};

/**
 * Combine AI advice with moisture/weather context from the state profile.
 * This implements the pattern from the spec:  `result.advice | Monitor moisture levels`
 * @private
 */
const _buildRecommendedAction = (result, stateProfile) => {
  const baseAdvice = result.advice || "Follow standard crop management practices.";
  const moistureNote = stateProfile.rainfall === "Very High" || stateProfile.rainfall === "High"
    ? "Monitor moisture levels closely and ensure proper field drainage."
    : stateProfile.rainfall === "Very Low"
    ? "Monitor soil moisture daily. Consider drip irrigation to conserve water."
    : "Monitor moisture levels regularly.";

  return `${baseAdvice} | ${moistureNote}`;
};

/**
 * Provide crop-specific advisory overlays based on local conditions.
 * @private
 */
const _getCropAdvisory = (crop, stateProfile) => {
  const cropLower = (crop || "").toLowerCase();

  if (cropLower.includes("rice") && stateProfile.rainfall === "High") {
    return "High rainfall region detected. Inspect for Rice Blast and Bacterial Leaf Blight weekly.";
  }
  if (cropLower.includes("wheat") && stateProfile.season === "Rabi-dominant") {
    return "Rabi season wheat. Monitor for rust diseases from November through February.";
  }
  if (cropLower.includes("cotton") && stateProfile.primaryThreat.includes("Bollworm")) {
    return "Cotton bollworm is a primary risk in this region. Install pheromone traps every 5 hectares.";
  }
  if (cropLower.includes("tomato") && stateProfile.riskFactor === "High Humidity Risk") {
    return "Humidity accelerates Early Blight progression on tomato. Apply preventive fungicide before rain.";
  }
  if (cropLower.includes("potato") && stateProfile.rainfall === "High") {
    return "High humidity + rainfall = Late Blight risk. Apply metalaxyl-based fungicide preventively.";
  }

  return `${stateProfile.season} — Apply region-appropriate nutrient management for this crop.`;
};

/**
 * Default profile when no state is recognised.
 * @private
 */
const _getDefaultProfile = (locationName = "India") => ({
  riskFactor: "Normal",
  primaryThreat: "General Crop Disease",
  rainfall: "Medium",
  season: "Mixed",
  notes: `Location "${locationName}" not in regional database. Using average national risk profile.`
});

module.exports = {
  enhancePrediction,
  STATE_RISK_PROFILES,
  SEVERITY_TO_LOSS
};
