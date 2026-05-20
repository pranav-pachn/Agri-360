/**
 * Enhanced Mock AI Service
 * ========================
 * Provides crop-specific, varied AI-like responses when TensorFlow.js
 * is unavailable (e.g. on Vercel serverless).
 *
 * Uses a deterministic hash of the imageUrl so that:
 *  - Different images → different diseases
 *  - Same image re-uploaded → same result (reproducible)
 */

// ── Simple deterministic hash ──────────────────────────────────────────────────
const simpleHash = (str) => {
  let hash = 0;
  const s = String(str || '');
  for (let i = 0; i < s.length; i++) {
    const chr = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // 32-bit integer
  }
  return Math.abs(hash);
};

// ── Crop disease database ──────────────────────────────────────────────────────
const CROP_DISEASES = {
  rice: [
    { disease: 'Bacterial Leaf Blight', confidence: 0.88, severity: 'High', health_score: 35, advice: 'Apply copper-based bactericides immediately. Drain excess water from the field.', treatment: 'Copper hydroxide spray + field drainage' },
    { disease: 'Brown Spot', confidence: 0.82, severity: 'Medium', health_score: 55, advice: 'Apply fungicide and improve potassium fertilization.', treatment: 'Mancozeb fungicide + potassium supplement' },
    { disease: 'Rice Blast', confidence: 0.91, severity: 'High', health_score: 30, advice: 'Apply systemic fungicide urgently. Avoid excess nitrogen fertilizer.', treatment: 'Tricyclazole fungicide application' },
    { disease: 'Sheath Blight', confidence: 0.79, severity: 'Medium', health_score: 50, advice: 'Apply validated fungicide at the boot stage. Reduce plant density.', treatment: 'Hexaconazole spray + thinning' },
    { disease: 'Healthy', confidence: 0.95, severity: 'None', health_score: 92, advice: 'Crop appears healthy. Maintain current irrigation and nutrient schedule.', treatment: 'No treatment needed — continue monitoring' },
  ],
  wheat: [
    { disease: 'Leaf Rust', confidence: 0.86, severity: 'High', health_score: 38, advice: 'Apply propiconazole fungicide immediately. Scout surrounding fields.', treatment: 'Propiconazole foliar spray' },
    { disease: 'Powdery Mildew', confidence: 0.84, severity: 'Medium', health_score: 52, advice: 'Apply sulfur-based fungicide. Improve air circulation between rows.', treatment: 'Sulfur dust or Triadimefon spray' },
    { disease: 'Yellow Rust', confidence: 0.89, severity: 'High', health_score: 33, advice: 'Apply triazole fungicide urgently. Report to local agricultural office.', treatment: 'Tebuconazole fungicide application' },
    { disease: 'Septoria Leaf Blotch', confidence: 0.78, severity: 'Medium', health_score: 48, advice: 'Apply protective fungicide and avoid overhead irrigation.', treatment: 'Chlorothalonil preventive spray' },
    { disease: 'Healthy', confidence: 0.93, severity: 'None', health_score: 90, advice: 'Crop is in good condition. Continue current agronomic practices.', treatment: 'No treatment needed — continue monitoring' },
  ],
  tomato: [
    { disease: 'Early Blight', confidence: 0.87, severity: 'High', health_score: 40, advice: 'Remove infected leaves. Apply chlorothalonil-based fungicide.', treatment: 'Chlorothalonil spray + leaf removal' },
    { disease: 'Late Blight', confidence: 0.90, severity: 'Critical', health_score: 22, advice: 'Immediately apply metalaxyl fungicide. Isolate affected plants.', treatment: 'Metalaxyl + Mancozeb combination spray' },
    { disease: 'Leaf Curl Virus', confidence: 0.83, severity: 'High', health_score: 36, advice: 'Control whitefly vector population. Remove severely affected plants.', treatment: 'Imidacloprid for vector control + roguing' },
    { disease: 'Septoria Leaf Spot', confidence: 0.81, severity: 'Medium', health_score: 54, advice: 'Apply fungicide and mulch to prevent soil splash.', treatment: 'Copper fungicide + organic mulching' },
    { disease: 'Healthy', confidence: 0.94, severity: 'None', health_score: 91, advice: 'Plants look healthy. Stake and prune to maintain airflow.', treatment: 'No treatment needed — continue monitoring' },
  ],
  maize: [
    { disease: 'Northern Leaf Blight', confidence: 0.85, severity: 'High', health_score: 37, advice: 'Apply azoxystrobin-based fungicide. Use resistant hybrids next season.', treatment: 'Azoxystrobin foliar application' },
    { disease: 'Common Rust', confidence: 0.82, severity: 'Medium', health_score: 53, advice: 'Apply triazole fungicide if spreading. Monitor pustule density.', treatment: 'Propiconazole spray' },
    { disease: 'Gray Leaf Spot', confidence: 0.80, severity: 'Medium', health_score: 50, advice: 'Improve crop rotation. Apply strobilurin fungicide preventively.', treatment: 'Pyraclostrobin preventive spray' },
    { disease: 'Fall Armyworm Damage', confidence: 0.88, severity: 'High', health_score: 34, advice: 'Apply Bt-based insecticide immediately. Scout for egg masses.', treatment: 'Bacillus thuringiensis (Bt) spray' },
    { disease: 'Healthy', confidence: 0.92, severity: 'None', health_score: 89, advice: 'Crop is vigorous. Maintain weed control and irrigation.', treatment: 'No treatment needed — continue monitoring' },
  ],
  cotton: [
    { disease: 'Bacterial Blight', confidence: 0.84, severity: 'High', health_score: 39, advice: 'Apply copper oxychloride. Use certified disease-free seeds.', treatment: 'Copper oxychloride spray' },
    { disease: 'Bollworm Infestation', confidence: 0.87, severity: 'High', health_score: 32, advice: 'Apply neem-based insecticide or Bt spray. Install pheromone traps.', treatment: 'Neem oil + pheromone traps' },
    { disease: 'Leaf Spot', confidence: 0.79, severity: 'Medium', health_score: 56, advice: 'Apply mancozeb fungicide. Ensure proper spacing.', treatment: 'Mancozeb protective spray' },
    { disease: 'Healthy', confidence: 0.93, severity: 'None', health_score: 90, advice: 'Plants look healthy. Continue pest monitoring and irrigation.', treatment: 'No treatment needed — continue monitoring' },
  ],
  sugarcane: [
    { disease: 'Red Rot', confidence: 0.86, severity: 'High', health_score: 33, advice: 'Remove and destroy infected canes. Use resistant varieties for ratoon crop.', treatment: 'Infected cane removal + Trichoderma application' },
    { disease: 'Smut', confidence: 0.83, severity: 'Medium', health_score: 48, advice: 'Rogue out smutted clumps. Treat seed setts with fungicide.', treatment: 'Carbendazim seed treatment' },
    { disease: 'Leaf Scald', confidence: 0.80, severity: 'Medium', health_score: 51, advice: 'Use disease-free planting material. Avoid mechanical injury to stalks.', treatment: 'Hot water treatment of setts + sanitation' },
    { disease: 'Healthy', confidence: 0.94, severity: 'None', health_score: 91, advice: 'Crop is healthy. Continue earthing up and trash mulching.', treatment: 'No treatment needed — continue monitoring' },
  ],
  potato: [
    { disease: 'Late Blight', confidence: 0.90, severity: 'Critical', health_score: 25, advice: 'Apply metalaxyl + mancozeb immediately. Destroy infected haulms.', treatment: 'Metalaxyl-M + Mancozeb spray' },
    { disease: 'Early Blight', confidence: 0.84, severity: 'High', health_score: 42, advice: 'Apply chlorothalonil or mancozeb. Remove lower infected leaves.', treatment: 'Chlorothalonil preventive spray' },
    { disease: 'Black Scurf', confidence: 0.78, severity: 'Medium', health_score: 55, advice: 'Use clean seed tubers. Treat with bio-agents before planting.', treatment: 'Trichoderma viride seed treatment' },
    { disease: 'Healthy', confidence: 0.93, severity: 'None', health_score: 90, advice: 'Tubers and foliage look healthy. Maintain hilling and irrigation.', treatment: 'No treatment needed — continue monitoring' },
  ],
  soybean: [
    { disease: 'Rust', confidence: 0.87, severity: 'High', health_score: 36, advice: 'Apply triazole + strobilurin fungicide. Scout weekly for pustules.', treatment: 'Tebuconazole + Azoxystrobin spray' },
    { disease: 'Charcoal Rot', confidence: 0.81, severity: 'Medium', health_score: 50, advice: 'Improve soil moisture management. Use resistant varieties.', treatment: 'Trichoderma-based bio-agent + irrigation management' },
    { disease: 'Yellow Mosaic Virus', confidence: 0.85, severity: 'High', health_score: 34, advice: 'Control whitefly population. Remove infected plants to prevent spread.', treatment: 'Imidacloprid spray for vector control + roguing' },
    { disease: 'Healthy', confidence: 0.92, severity: 'None', health_score: 89, advice: 'Crop looks vigorous. Continue weed management and pest monitoring.', treatment: 'No treatment needed — continue monitoring' },
  ],
  groundnut: [
    { disease: 'Tikka Disease', confidence: 0.84, severity: 'Medium', health_score: 49, advice: 'Apply mancozeb or carbendazim fungicide at first symptoms.', treatment: 'Carbendazim + Mancozeb spray' },
    { disease: 'Collar Rot', confidence: 0.82, severity: 'High', health_score: 38, advice: 'Apply Trichoderma to soil. Ensure proper drainage and seed treatment.', treatment: 'Trichoderma viride soil application' },
    { disease: 'Healthy', confidence: 0.93, severity: 'None', health_score: 91, advice: 'Plants look healthy. Continue calcium supplementation for pods.', treatment: 'No treatment needed — continue monitoring' },
  ],
};

// Default fallback for any unrecognized crop
const DEFAULT_DISEASES = [
  { disease: 'Leaf Spot', confidence: 0.80, severity: 'Medium', health_score: 52, advice: 'Apply a broad-spectrum fungicide. Remove heavily infected foliage.', treatment: 'Mancozeb broad-spectrum spray' },
  { disease: 'Powdery Mildew', confidence: 0.83, severity: 'Medium', health_score: 50, advice: 'Improve air circulation. Apply sulfur-based or systemic fungicide.', treatment: 'Sulfur dust or systemic fungicide' },
  { disease: 'Wilting', confidence: 0.78, severity: 'High', health_score: 38, advice: 'Check for root rot or vascular disease. Improve drainage.', treatment: 'Soil drenching with fungicide + drainage improvement' },
  { disease: 'Nutrient Deficiency', confidence: 0.76, severity: 'Low', health_score: 65, advice: 'Conduct soil testing and apply balanced NPK fertilizer.', treatment: 'Balanced NPK application based on soil test' },
  { disease: 'Healthy', confidence: 0.94, severity: 'None', health_score: 90, advice: 'Crop appears healthy. Maintain current agronomic practices.', treatment: 'No treatment needed — continue monitoring' },
];

// ── Location-specific risk context ─────────────────────────────────────────────
const LOCATION_CONTEXT = {
  'andhra pradesh': { risk_factor: 'Cyclone-prone coastal belt', primary_threat: 'Flood damage during Kharif', estimated_loss: '15-25%' },
  'maharashtra': { risk_factor: 'Erratic monsoon patterns', primary_threat: 'Drought stress in Vidarbha region', estimated_loss: '10-20%' },
  'punjab': { risk_factor: 'Stubble burning soil degradation', primary_threat: 'Wheat rust post-monsoon', estimated_loss: '8-15%' },
  'karnataka': { risk_factor: 'Semi-arid climate variability', primary_threat: 'Moisture stress in rain-fed areas', estimated_loss: '12-18%' },
  'tamil nadu': { risk_factor: 'Northeast monsoon dependency', primary_threat: 'Cyclonic rainfall damage', estimated_loss: '10-22%' },
  'uttar pradesh': { risk_factor: 'High pest pressure in Indo-Gangetic plain', primary_threat: 'Sugarcane borers and wheat rust', estimated_loss: '10-20%' },
  'gujarat': { risk_factor: 'Water scarcity in Saurashtra', primary_threat: 'Groundnut and cotton wilt', estimated_loss: '12-20%' },
  'madhya pradesh': { risk_factor: 'Rainfed agriculture dominance', primary_threat: 'Soybean rust during Kharif', estimated_loss: '10-18%' },
  'telangana': { risk_factor: 'High humidity during Kharif', primary_threat: 'Fungal diseases in cotton and rice', estimated_loss: '10-20%' },
  'west bengal': { risk_factor: 'Flood-prone low-lying fields', primary_threat: 'Rice blast during monsoon', estimated_loss: '15-25%' },
};

const getLocationContext = (location) => {
  const loc = String(location || '').toLowerCase();
  for (const [key, context] of Object.entries(LOCATION_CONTEXT)) {
    if (loc.includes(key)) return context;
  }
  return { risk_factor: 'Regional weather variability', primary_threat: 'Seasonal pest and disease pressure', estimated_loss: '10-20%' };
};

// ── Main analyze function ──────────────────────────────────────────────────────
async function analyzeCropImage(imageUrl, cropType = 'unknown', location = 'unknown') {
  const cropKey = String(cropType || 'unknown').toLowerCase().trim();
  const diseases = CROP_DISEASES[cropKey] || DEFAULT_DISEASES;

  // Deterministic selection: hash the imageUrl to pick a disease index
  const hash = simpleHash(imageUrl || `${Date.now()}-${Math.random()}`);
  const diseaseIndex = hash % diseases.length;
  const selected = diseases[diseaseIndex];

  // Location context
  const locContext = getLocationContext(location);

  // Build the urgency based on severity
  const urgencyMap = { None: 'Low', Low: 'Moderate', Medium: 'High', High: 'Immediate', Critical: 'Immediate' };
  const urgency = urgencyMap[selected.severity] || 'Moderate';

  return {
    diagnosis: {
      disease: selected.disease,
      confidence: selected.confidence,
      severity: selected.severity,
      health_score: selected.health_score,
      advice: selected.advice,
      treatment: selected.treatment,
    },
    yield_prediction: {
      predicted_yield: Number(((selected.health_score / 100) * 20).toFixed(1)),
      unit: 'tons/hectare',
      confidence: selected.confidence,
    },
    sustainability_score: Math.min(100, selected.health_score + 5),
    risk_assessment: {
      severity: selected.severity === 'None' ? 'low' : selected.severity.toLowerCase(),
      score: Math.round((100 - selected.health_score) * 0.8),
    },
    recommendations: [
      {
        type: selected.severity === 'None' ? 'Preventive' : 'Treatment',
        action: selected.advice,
        urgency,
        treatment: selected.treatment,
        detected_by: 'Enhanced Agricultural Intelligence Engine',
      },
    ],
    health_trend: 'stable',
    location_analysis: {
      location,
      region: location,
      weather: 'normal',
      source: 'enhanced-mock-service',
    },
    decision_intelligence: {
      severity: selected.severity,
      risk_factor: locContext.risk_factor,
      primary_threat: locContext.primary_threat,
      estimated_loss: locContext.estimated_loss,
      urgency,
      crop_advisory: selected.advice,
      recommended_action: selected.advice,
    },
    pipeline: {
      raw_ai: {
        label: `mock-${selected.disease.toLowerCase().replace(/\s+/g, '-')}`,
        probability: selected.confidence,
        alternatives: [],
        model: 'Enhanced Mock AI',
        source: 'enhanced-mock-service',
      },
    },
    metadata: {
      source: 'enhanced-mock-service',
      imageUrl,
      cropType,
      fallback_used: true,
      analysis_timestamp: new Date().toISOString(),
    },
  };
}

async function analyzeBatch(imageUrls = [], cropType, location) {
  return Promise.all(imageUrls.map((url) => analyzeCropImage(url, cropType, location)));
}

module.exports = {
  analyzeCropImage,
  analyzeBatch,
};
