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

const AGRI_KEYWORDS = [
  "plant", "leaf", "crop", "tree", "flower", "corn", "wheat", "rice", "sugarcane",
  "tomato", "potato", "soybean", "herb", "grass", "seed", "fruit",
  "fungus", "mushroom", "mold", "mould", "spore", "rust", "blight",
  "rot", "wilt", "decay", "spot", "insect", "aphid", "caterpillar"
];

const isAgricultural = (predictions) => {
  if (!predictions || predictions.length === 0) return false;
  return predictions.some(p =>
    AGRI_KEYWORDS.some(k => p.className.toLowerCase().includes(k))
  );
};

/**
 * Step 1: Raw AI
 * Normalize top TensorFlow/MobileNet predictions into a stable raw payload.
 *
 * @param {Array<{className: string, probability: number}>} predictions
 * @returns {{label: string|null, probability: number, alternatives: Array<{label:string, probability:number}>, model: string, source: string}}
 */
const runTensorflow = (predictions) => {
  if (!predictions || predictions.length === 0) {
    return {
      label: null,
      probability: 0,
      alternatives: [],
      model: 'MobileNetV2',
      source: 'tensorflow'
    };
  }

  const top = predictions[0];
  return {
    label: top.className,
    probability: Number(top.probability.toFixed(4)),
    alternatives: predictions.slice(1, 3).map((p) => ({
      label: p.className,
      probability: Number(p.probability.toFixed(4))
    })),
    model: 'MobileNetV2',
    source: 'tensorflow'
  };
};

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
  // ── Step 0: Non-Agricultural Validation Gate ──────────────────────────────
  if (!isAgricultural(predictions)) {
    return {
      error: "NON_AGRICULTURAL_IMAGE",
      message: "This image does not appear to be related to agriculture or plants. Please upload a specific photo of a crop, leaf, or field condition.",
      source: "tensorflow-gate"
    };
  }

  // ── Step 1: Raw AI ────────────────────────────────────────────────────────
  const rawAI = runTensorflow(predictions);

  if (!rawAI.label) {
    return _fallbackResult(cropTypeOverride);
  }

  // ── Step 1.5: Low Confidence Validation Gate ──────────────────────────────
  if (rawAI.probability < 0.3) {
    return {
      error: "LOW_CONFIDENCE",
      message: "Image unclear, please retake",
      confidence: Number(rawAI.probability.toFixed(4)),
      source: "tensorflow-gate"
    };
  }

  // ── Step 2: Agricultural AI (semantic disease mapping) ────────────────────
  const mapped = mapToCropDisease(rawAI.label);

  // Apply any confidence boost the mapping provides (for known disease labels)
  const finalConfidence = Math.min(0.99, rawAI.probability + (mapped.confidence_boost || 0));

  // ── Step 2b: Determine severity level using confidence thresholds ──────────
  const severity = _computeSeverity(rawAI.probability, mapped.severity);

  // ── Step 2c: Allow user crop override ──────────────────────────────────────
  const crop = cropTypeOverride || mapped.crop;

  // ── Step 2d: Agricultural AI output ────────────────────────────────────────
  const agriculturalResult = {
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
    raw_label: rawAI.label,
    raw_probability: rawAI.probability,

    // Alt predictions for debugging / explainability panel
    alternatives: rawAI.alternatives
  };

  // ── Step 3: Decision AI (geo-contextual enhancement) ───────────────────────
  const decisionResult = location
    ? enhancePrediction(agriculturalResult, location, crop)
    : { ...agriculturalResult, enhanced: false };

  return {
    ...decisionResult,
    pipeline: {
      raw_ai: rawAI,
      agricultural_ai: {
        mapped_from_label: rawAI.label,
        crop,
        disease: mapped.disease,
        severity,
        health_score: mapped.health_score,
        confidence_boost: mapped.confidence_boost || 0
      },
      decision_ai: {
        enhanced: Boolean(location),
        location: location || null,
        riskFactor: decisionResult.riskFactor || null,
        primaryThreat: decisionResult.primaryThreat || null,
        estimatedLoss: decisionResult.estimatedLoss || null,
        urgency: decisionResult.urgency || null
      }
    }
  };
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
  health_score: null,
  advice: "No predictions generated. Please upload a clearer image of the crop leaf or stem.",
  treatment: null,
  source: "tensorflow-fallback",
  raw_label: null,
  raw_probability: 0.0,
  alternatives: [],
  pipeline: {
    raw_ai: {
      label: null,
      probability: 0,
      alternatives: [],
      model: 'MobileNetV2',
      source: 'tensorflow'
    },
    agricultural_ai: null,
    decision_ai: {
      enhanced: false,
      location: null,
      riskFactor: null,
      primaryThreat: null,
      estimatedLoss: null,
      urgency: null
    }
  }
});

module.exports = {
  runInference,
  runTensorflow
};