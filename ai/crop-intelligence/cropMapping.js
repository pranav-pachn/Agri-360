/**
 * 🌾 Crop Intelligence Mapping Layer
 * ====================================
 * Converts generic pretrained model labels (MobileNet / ImageNet) into
 * precise, actionable agricultural diagnostic data.
 *
 * Strategy: Pretrained Model + Semantic Mapping (Hackathon-optimised)
 *
 * Instead of training from scratch, we intercept the raw string label
 * output from MobileNet and map it to real crop disease knowledge.
 */

/** @type {Record<string, CropDiagnosis>} */
const CROP_MAPPING = {
  // ─── Healthy / Green indicators ──────────────────────────────────────────────
  "leaf": {
    crop: "General Crop",
    disease: "Healthy",
    confidence_boost: 0.05,
    advice: "No major disease detected. Continue current nutrient management.",
    severity: "None",
    health_score: 88,
    treatment: null
  },
  "plant": {
    crop: "General Crop",
    disease: "Healthy",
    confidence_boost: 0.03,
    advice: "Plant appears in good condition. Monitor regularly.",
    severity: "None",
    health_score: 82,
    treatment: null
  },
  "flower": {
    crop: "Flowering Crop",
    disease: "Healthy (Flowering Stage)",
    confidence_boost: 0.04,
    advice: "Optimal flowering stage observed. Maintain adequate irrigation.",
    severity: "None",
    health_score: 80,
    treatment: null
  },
  "herb": {
    crop: "Herb / Vegetable",
    disease: "Healthy",
    confidence_boost: 0.03,
    advice: "Healthy herb detected. Maintain current cultivation schedule.",
    severity: "None",
    health_score: 85,
    treatment: null
  },
  "grass": {
    crop: "Cereal Crop",
    disease: "Healthy",
    confidence_boost: 0.02,
    advice: "Cereal/grass crop appears healthy.",
    severity: "None",
    health_score: 78,
    treatment: null
  },
  "tree": {
    crop: "Tree Crop",
    disease: "Healthy",
    confidence_boost: 0.02,
    advice: "Tree crop in standard health. Continue routine care.",
    severity: "None",
    health_score: 75,
    treatment: null
  },

  // ─── Specific Crops ─────────────────────────────────────────────────────────────
  "tomato": {
    crop: "Tomato",
    disease: "Under Assessment",
    confidence_boost: 0.10,
    advice: "Tomato detected. Check leaf surface for blight spots.",
    severity: "Low",
    health_score: 72,
    treatment: "Visual inspection recommended."
  },
  "corn": {
    crop: "Maize",
    disease: "Healthy",
    confidence_boost: 0.05,
    advice: "Maize detected. Maintain regular watering.",
    severity: "None",
    health_score: 85,
    treatment: null
  },
  "rice": {
    crop: "Rice",
    disease: "Healthy",
    confidence_boost: 0.05,
    advice: "Rice crop detected. Ensure optimal field flooding.",
    severity: "None",
    health_score: 85,
    treatment: null
  },
  "wheat": {
    crop: "Wheat",
    disease: "Healthy",
    confidence_boost: 0.05,
    advice: "Wheat detected. Monitor for rust during heading stage.",
    severity: "None",
    health_score: 85,
    treatment: null
  },
  "sugarcane": {
    crop: "Sugarcane",
    disease: "Healthy",
    confidence_boost: 0.05,
    advice: "Sugarcane crop detected. Maintain optimal soil moisture.",
    severity: "None",
    health_score: 85,
    treatment: null
  },

  // ─── Fungal / Mould Pathogens ────────────────────────────────────────────────
  "fungus": {
    crop: "Tomato",
    disease: "Early Blight",
    confidence_boost: 0.0,
    advice: "Apply Mancozeb 75% WP at 2.5g/L water. Repeat every 7 days for 3 weeks.",
    severity: "High",
    health_score: 42,
    treatment: "Mancozeb 75% WP — ₹500/hectare"
  },
  "mushroom": {
    crop: "Identified Crop",
    disease: "Severe Fungal Disease",
    confidence_boost: 0.0,
    advice: "Apply copper-based fungicide at 3g/L. Avoid overhead watering.",
    severity: "High",
    health_score: 35,
    treatment: "Copper Oxychloride 50% WP — ₹600/hectare"
  },
  "mold": {
    crop: "Identified Crop",
    disease: "Powdery Mildew / Downy Mildew",
    confidence_boost: 0.0,
    advice: "Spray sulphur-based fungicide. Improve air circulation between plants.",
    severity: "Medium",
    health_score: 52,
    treatment: "Sulphur 80% WG — ₹400/hectare"
  },
  "mould": {
    crop: "Identified Crop",
    disease: "Powdery Mildew / Downy Mildew",
    confidence_boost: 0.0,
    advice: "Spray sulphur-based fungicide. Improve air circulation between plants.",
    severity: "Medium",
    health_score: 52,
    treatment: "Sulphur 80% WG — ₹400/hectare"
  },
  "spore": {
    crop: "Identified Crop",
    disease: "Fungal Spores Detected",
    confidence_boost: 0.0,
    advice: "Isolate affected plants immediately. Apply preventative broad-spectrum fungicide.",
    severity: "Medium",
    health_score: 55,
    treatment: "Chlorothalonil 75% WP — ₹550/hectare"
  },
  "rust": {
    crop: "Wheat / Cereal",
    disease: "Stem / Leaf Rust",
    confidence_boost: 0.0,
    advice: "Apply Tebuconazole 25% EC at 1ml/L. Treat early to prevent spread.",
    severity: "High",
    health_score: 40,
    treatment: "Tebuconazole 25% EC — ₹800/hectare"
  },

  // ─── Bacterial / Viral Pathogens ─────────────────────────────────────────────
  "blight": {
    crop: "Potato / Tomato",
    disease: "Late Blight (Phytophthora)",
    confidence_boost: 0.0,
    advice: "Immediately apply Metalaxyl + Mancozeb. Remove affected leaves.",
    severity: "Critical",
    health_score: 28,
    treatment: "Ridomil Gold MZ 68 WG — ₹1,200/hectare"
  },
  "spot": {
    crop: "Identified Crop",
    disease: "Leaf Spot Disease",
    confidence_boost: 0.0,
    advice: "Apply Copper Oxychloride at 3g/L. Avoid wetting foliage during irrigation.",
    severity: "Medium",
    health_score: 58,
    treatment: "Copper Oxychloride 50% WP — ₹600/hectare"
  },
  "mosaic": {
    crop: "Identified Crop",
    disease: "Mosaic Virus",
    confidence_boost: 0.0,
    advice: "No chemical cure for viruses. Control aphid vectors. Remove infected plants.",
    severity: "High",
    health_score: 38,
    treatment: "Insecticide (Thiamethoxam 25% WG) for vector control — ₹700/hectare"
  },

  // ─── Physical / Abiotic Stress & Specific Pathogens ──────────────────────────
  "red rot": {
    crop: "Sugarcane",
    disease: "Red Rot",
    confidence_boost: 0.0,
    advice: "Uproot and burn affected plants immediately. Practice crop rotation and avoid ratooning.",
    severity: "Critical",
    health_score: 25,
    treatment: "Use disease-free setts for the next cycle. Apply Carbendazim 0.1% for sett treatment."
  },
  "rot": {
    crop: "Identified Crop",
    disease: "Root / Stem Rot",
    confidence_boost: 0.0,
    advice: "Reduce irrigation immediately. Apply Carbendazim soil drench at 1g/L.",
    severity: "Critical",
    health_score: 30,
    treatment: "Carbendazim 50% WP soil drench — ₹650/hectare"
  },
  "decay": {
    crop: "Identified Crop",
    disease: "Post-Harvest Decay / Soft Rot",
    confidence_boost: 0.0,
    advice: "Remove and destroy decayed plant matter. Apply lime to soil.",
    severity: "High",
    health_score: 35,
    treatment: "Lime application + Biocontrol agent (Trichoderma viride)"
  },
  "wilt": {
    crop: "Identified Crop",
    disease: "Fusarium / Bacterial Wilt",
    confidence_boost: 0.0,
    advice: "Drench soil with Carbendazim. Check irrigation for over-watering.",
    severity: "High",
    health_score: 45,
    treatment: "Carbendazim 50% WP — ₹650/hectare"
  },
  "yellow": {
    crop: "Identified Crop",
    disease: "Chlorosis / Iron Deficiency",
    confidence_boost: 0.0,
    advice: "Apply foliar spray of FeSO4 (ferrous sulphate) at 5g/L. Check soil pH.",
    severity: "Medium",
    health_score: 58,
    treatment: "FeSO4 foliar spray — ₹200/hectare"
  },
  "brown": {
    crop: "Identified Crop",
    disease: "Nutrient Deficiency / Tip Burn",
    confidence_boost: 0.0,
    advice: "Perform soil test. Apply balanced NPK 19:19:19 fertilizer.",
    severity: "Medium",
    health_score: 55,
    treatment: "NPK 19:19:19 — ₹350/hectare"
  },
  "dry": {
    crop: "Identified Crop",
    disease: "Drought Stress",
    confidence_boost: 0.0,
    advice: "Increase drip irrigation frequency. Apply mulch to conserve soil moisture.",
    severity: "Medium",
    health_score: 50,
    treatment: "Irrigation management + mulching"
  },
  "pale": {
    crop: "Identified Crop",
    disease: "Nutrient Deficiency (Nitrogen)",
    confidence_boost: 0.0,
    advice: "Apply urea at 5g/L as foliar spray. Follow up with basal nitrogen dose.",
    severity: "Medium",
    health_score: 60,
    treatment: "Urea foliar spray — ₹150/hectare"
  },

  // ─── Pest Indicators ─────────────────────────────────────────────────────────
  "insect": {
    crop: "Identified Crop",
    disease: "Insect Infestation",
    confidence_boost: 0.0,
    advice: "Spray Chlorpyrifos 20% EC at 2ml/L. Install pheromone traps.",
    severity: "High",
    health_score: 48,
    treatment: "Chlorpyrifos 20% EC — ₹700/hectare"
  },
  "aphid": {
    crop: "Identified Crop",
    disease: "Aphid Infestation",
    confidence_boost: 0.0,
    advice: "Apply Imidacloprid 70% WG at 0.5g/L. Spray neem oil as organic alternative.",
    severity: "Medium",
    health_score: 55,
    treatment: "Imidacloprid 70% WG — ₹500/hectare"
  },
  "caterpillar": {
    crop: "Identified Crop",
    disease: "Caterpillar / Bollworm Attack",
    confidence_boost: 0.0,
    advice: "Apply Profenofos 50% EC at 2ml/L. Use Bt-based bioinsecticide for organic option.",
    severity: "High",
    health_score: 45,
    treatment: "Profenofos 50% EC — ₹800/hectare"
  }
};

/**
 * Priority order for partial substring matching.
 * Specific pathogens and severe symptoms must be matched BEFORE generic plant terms.
 */
const PRIORITY_KEYS = [
  // 1. Specific Pathogens & Pests
  "red rot", "blight", "rust", "rot", "wilt", "mosaic", "spore", "fungus", 
  "mold", "mould", "aphid", "caterpillar", "insect", "mushroom", "decay",
  // 2. Visible Symptoms
  "spot", "yellow", "brown", "pale", "dry",
  // 3. Specific Crops
  "tomato", "corn", "rice", "wheat", "sugarcane",
  // 4. Generic Plant Morphology
  "leaf", "flower", "herb", "grass", "tree", "plant"
];

/**
 * Look up a MobileNet class label in the disease knowledge base.
 * Performs partial substring matching using a priority list to ensure
 * severe conditions (like "blight") match before generic terms ("leaf").
 *
 * @param {string} label - Raw className from TensorFlow prediction
 * @returns {CropDiagnosis} Structured agricultural diagnosis
 */
const mapToCropDisease = (label) => {
  if (!label) return _getFallback();

  const lowerLabel = label.toLowerCase();

  // Exact key match first (fastest)
  if (CROP_MAPPING[lowerLabel]) return CROP_MAPPING[lowerLabel];

  // Partial substring match following priority rules
  for (const key of PRIORITY_KEYS) {
    if (lowerLabel.includes(key) && CROP_MAPPING[key]) {
      return CROP_MAPPING[key];
    }
  }

  return _getFallback();
};

/**
 * Get all mapping keys (useful for debugging / admin UI)
 */
const getMappingKeys = () => Object.keys(CROP_MAPPING);

/**
 * Fallback when no label matches any known crop indicator
 * @private
 */
const _getFallback = () => ({
  crop: "Unknown Crop",
  disease: "Unclassified Condition",
  confidence_boost: 0.0,
  advice: "Image could not be classified precisely. Please retake the photo of the affected leaf/stem up close, or consult your nearest agricultural extension officer.",
  severity: "Unknown",
  health_score: null,
  treatment: "Consult expert"
});

module.exports = {
  mapToCropDisease,
  getMappingKeys,
  CROP_MAPPING
};
