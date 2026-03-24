/**
 * 🧠 AI Inference Engine
 * =======================
 * Consumes raw TensorFlow.js MobileNet predictions and converts them into
 * structured, actionable crop diagnostic payloads using the Smart Mapping Layer.
 *
 * Architecture:
 *   Image Buffer
 *     ↓
 *   TensorFlow MobileNet (pretrained — no retraining needed)
 *     ↓  predictions[]  e.g. [{className: "fungus, plant", probability: 0.91}]
 *   mapToCropDisease()  ← cropMapping.js (our agricultural intelligence layer)
 *     ↓
 *   {crop, disease, confidence, severity, advice, source: "tensorflow"}
 */

const { mapToCropDisease } = require('./cropMapping');
const { enhancePrediction } = require('./agriEnhancer');

/**
 * Run inference on a set of raw MobileNet predictions.
 *
 * @param {Array<{className: string, probability: number}>} predictions
 *   Array of top-k predictions returned by MobileNet.classify()
 * @param {string} [cropTypeOverride]
 *   If the user already told us the crop type, use it to override the mapped value.
 * @param {string} [location]
 *   Optional farm location string (e.g. "Nagpur, Maharashtra").
 *   When provided, the result is automatically enhanced with geo-contextual intelligence.
 * @returns {InferenceResult|EnhancedResult}
 */
const runInference = (predictions, cropTypeOverride = null, location = null) => {
  if (!predictions || predictions.length === 0) {
    return _fallbackResult(cropTypeOverride);
  }

  // ── 1. Extract the top prediction ──────────────────────────────────────────
  const top = predictions[0];
  const rawProbability = Number(top.probability.toFixed(4));

  // ── 2. Send the raw label through our Crop Intelligence Mapping Layer ──────
  const mapped = mapToCropDisease(top.className);

  // Apply any confidence boost the mapping provides (for known disease labels)
  const finalConfidence = Math.min(0.99, rawProbability + (mapped.confidence_boost || 0));

  // ── 3. Determine severity level using confidence thresholds ────────────────
  const severity = _computeSeverity(rawProbability, mapped.severity);

  // ── 4. Allow the user-provided crop type to override the generic mapped crop
  const crop = cropTypeOverride || mapped.crop;

  // ── 5. Build the structured diagnostic result ──────────────────────────────
  const baseResult = {
    // Core diagnostic fields consumed by the frontend
    crop,
    disease: mapped.disease,
    confidence: finalConfidence,
    severity,
    health_score: mapped.health_score,

    // Actionable intelligence
    advice: mapped.advice,
    treatment: mapped.treatment,

    // Provenance — always log what the raw model actually saw
    source: "tensorflow",
    raw_label: top.className,
    raw_probability: rawProbability,

    // Alt predictions for debugging / explainability panel
    alternatives: predictions.slice(1, 3).map(p => ({
      label: p.className,
      probability: Number(p.probability.toFixed(4))
    }))
  };

  // ── 6. Auto-enhance with geo-contextual intelligence if location provided ───
  if (location) {
    return enhancePrediction(baseResult, location, crop);
  }

  return baseResult;
};

/**
 * Compute the final severity, merging the model confidence with
 * the semantic severity from the mapping dictionary.
 *
 * Rules:
 *  - If mapping says "None" → always healthy regardless of confidence
 *  - Otherwise use confidence thresholds to bump or downgrade
 *
 * @param {number} probability
 * @param {string} mappedSeverity
 * @returns {"None"|"Low"|"Medium"|"High"|"Critical"}
 */
const _computeSeverity = (probability, mappedSeverity) => {
  if (mappedSeverity === "None") return "None";
  if (mappedSeverity === "Critical") return "Critical";

  if (probability >= 0.90) return mappedSeverity === "Low" ? "Medium" : mappedSeverity;
  if (probability >= 0.75) return mappedSeverity;
  if (probability >= 0.55) return mappedSeverity === "High" ? "Medium" : mappedSeverity;

  // Low confidence — downgrade severity
  return "Low";
};

/**
 * Fallback result when TensorFlow produces no usable predictions.
 * @private
 */
const _fallbackResult = (cropTypeOverride) => ({
  crop: cropTypeOverride || "Unknown Crop",
  disease: "Unclassified",
  confidence: 0.0,
  severity: "Unknown",
  health_score: 60,
  advice: "No predictions generated. Please upload a clearer image of the crop leaf or stem.",
  treatment: null,
  source: "tensorflow-fallback",
  raw_label: null,
  raw_probability: 0.0,
  alternatives: []
});

module.exports = {
  runInference
};