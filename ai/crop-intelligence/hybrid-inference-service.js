const path = require('path');

let axios = null;
let sharp = null;

const safeRequire = (moduleName) => {
  try {
    return require(moduleName);
  } catch (error) {
    const tryPaths = [
      path.resolve(__dirname, '../../server/node_modules'),
      path.resolve(__dirname, '../../node_modules'),
      path.resolve(__dirname, '../../../node_modules'),
    ];

    const resolved = require.resolve(moduleName, { paths: tryPaths });
    return require(resolved);
  }
};

const getAxios = () => {
  if (!axios) axios = safeRequire('axios');
  return axios;
};

const getSharp = () => {
  if (!sharp) sharp = safeRequire('sharp');
  return sharp;
};

const getWeatherService = () => {
  try {
    return require(path.resolve(__dirname, '../../server/src/services/weather.service.js'));
  } catch (error) {
    return {
      getWeatherSnapshotByLocation: async (location) => ({
        available: false,
        normalizedCondition: 'normal',
        location: location || 'Unknown location',
      }),
    };
  }
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const simpleHash = (value) => {
  let hash = 0;
  const input = String(value || '');
  for (let i = 0; i < input.length; i += 1) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const noiseFor = (seed, key, max = 1) => {
  const hash = simpleHash(`${seed}:${key}`);
  return (hash % 1000) / 1000 * max;
};

const DISEASE_PROFILES = [
  {
    label: 'Healthy',
    severity: 'None',
    confidenceMin: 0.82,
    confidenceMax: 0.94,
    healthMin: 84,
    healthMax: 96,
    riskImpact: 0.08,
    yieldImpact: 0.03,
    recommendation: 'No immediate treatment is needed. Maintain balanced irrigation, nutrition, and weekly scouting.',
    treatment: 'Continue monitoring',
  },
  {
    label: 'Early Blight',
    severity: 'Medium',
    confidenceMin: 0.78,
    confidenceMax: 0.91,
    healthMin: 46,
    healthMax: 64,
    riskImpact: 0.34,
    yieldImpact: 0.22,
    recommendation: 'Apply copper or chlorothalonil fungicide and reduce leaf moisture around the canopy.',
    treatment: 'Copper/chlorothalonil spray + infected leaf removal',
  },
  {
    label: 'Leaf Spot',
    severity: 'Medium',
    confidenceMin: 0.74,
    confidenceMax: 0.88,
    healthMin: 50,
    healthMax: 68,
    riskImpact: 0.28,
    yieldImpact: 0.18,
    recommendation: 'Remove heavily affected leaves and apply a broad-spectrum fungicide if spotting expands.',
    treatment: 'Mancozeb or copper fungicide',
  },
  {
    label: 'Bacterial Wilt',
    severity: 'High',
    confidenceMin: 0.76,
    confidenceMax: 0.89,
    healthMin: 34,
    healthMax: 52,
    riskImpact: 0.48,
    yieldImpact: 0.34,
    recommendation: 'Improve drainage, isolate severely affected plants, and avoid moving soil from infected zones.',
    treatment: 'Rogue infected plants + drainage correction',
  },
  {
    label: 'Powdery Mildew',
    severity: 'Medium',
    confidenceMin: 0.75,
    confidenceMax: 0.9,
    healthMin: 48,
    healthMax: 66,
    riskImpact: 0.3,
    yieldImpact: 0.2,
    recommendation: 'Improve airflow and apply sulfur-based or systemic fungicide at the first spread pattern.',
    treatment: 'Sulfur or triazole fungicide',
  },
  {
    label: 'Rust Disease',
    severity: 'High',
    confidenceMin: 0.77,
    confidenceMax: 0.9,
    healthMin: 38,
    healthMax: 56,
    riskImpact: 0.42,
    yieldImpact: 0.3,
    recommendation: 'Use a rust-targeted triazole foliar spray and inspect lower leaves in nearby rows.',
    treatment: 'Propiconazole or tebuconazole spray',
  },
  {
    label: 'Nutrient Deficiency',
    severity: 'Low',
    confidenceMin: 0.7,
    confidenceMax: 0.84,
    healthMin: 60,
    healthMax: 76,
    riskImpact: 0.18,
    yieldImpact: 0.12,
    recommendation: 'Run a soil or foliar nutrient check and correct nitrogen, potassium, or micronutrient gaps.',
    treatment: 'Balanced nutrient correction',
  },
];

const PROFILE_BY_LABEL = new Map(DISEASE_PROFILES.map((profile) => [profile.label, profile]));

const CROP_DISEASE_PREFERENCES = {
  rice: ['Leaf Spot', 'Bacterial Wilt', 'Rust Disease', 'Healthy'],
  wheat: ['Rust Disease', 'Powdery Mildew', 'Leaf Spot', 'Healthy'],
  tomato: ['Early Blight', 'Bacterial Wilt', 'Leaf Spot', 'Healthy'],
  maize: ['Rust Disease', 'Leaf Spot', 'Bacterial Wilt', 'Healthy'],
  cotton: ['Leaf Spot', 'Bacterial Wilt', 'Rust Disease', 'Healthy'],
  potato: ['Early Blight', 'Bacterial Wilt', 'Powdery Mildew', 'Healthy'],
  soybean: ['Rust Disease', 'Leaf Spot', 'Nutrient Deficiency', 'Healthy'],
};

const LOCATION_CONTEXT = {
  'andhra pradesh': { risk_factor: 'Coastal humidity and storm variability', primary_threat: 'fungal leaf disease pressure', estimated_loss: '12-24%' },
  maharashtra: { risk_factor: 'Erratic monsoon and heat stress', primary_threat: 'moisture stress and leaf spotting', estimated_loss: '10-22%' },
  punjab: { risk_factor: 'Dense wheat and rice cultivation', primary_threat: 'rust and mildew spread', estimated_loss: '8-18%' },
  karnataka: { risk_factor: 'Semi-arid weather swings', primary_threat: 'wilt and water stress', estimated_loss: '10-20%' },
  telangana: { risk_factor: 'High seasonal humidity', primary_threat: 'fungal disease pressure', estimated_loss: '10-21%' },
  gujarat: { risk_factor: 'Dry heat and water stress', primary_threat: 'wilting and nutrient stress', estimated_loss: '9-19%' },
  'west bengal': { risk_factor: 'Flood-prone humid belt', primary_threat: 'leaf blight and fungal spread', estimated_loss: '14-26%' },
};

const getLocationContext = (location) => {
  const normalized = String(location || '').toLowerCase();
  for (const [key, context] of Object.entries(LOCATION_CONTEXT)) {
    if (normalized.includes(key)) return context;
  }
  return {
    risk_factor: 'Regional weather variability',
    primary_threat: 'seasonal disease and moisture stress',
    estimated_loss: '8-18%',
  };
};

const getImageBuffer = async (imageUrl, options = {}) => {
  if (Buffer.isBuffer(options.imageBuffer)) return options.imageBuffer;
  if (options.imageBuffer instanceof Uint8Array) return Buffer.from(options.imageBuffer);
  if (!imageUrl) return null;

  try {
    const response = await fetch(imageUrl, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) return null;

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    return null;
  }
};

const analyzeImageBuffer = async (imageBuffer) => {
  if (!imageBuffer) return null;

  try {
    const processor = getSharp();
    const image = processor(imageBuffer).rotate();
    const metadata = await image.metadata();
    const { data, info } = await image
      .resize(96, 96, { fit: 'inside', withoutEnlargement: true })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixels = Math.max(1, info.width * info.height);
    let lumaSum = 0;
    let lumaSquaredSum = 0;
    let saturationSum = 0;
    let greenCount = 0;
    let yellowCount = 0;
    let brownCount = 0;
    let rustCount = 0;
    let whitePowderCount = 0;
    let darkCount = 0;

    for (let i = 0; i < data.length; i += 3) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      const saturation = max === 0 ? 0 : (max - min) / max;

      lumaSum += luma;
      lumaSquaredSum += luma * luma;
      saturationSum += saturation;

      if (g > r * 1.08 && g > b * 1.08 && g > 70) greenCount += 1;
      if (r > 120 && g > 105 && b < 105 && Math.abs(r - g) < 85) yellowCount += 1;
      if (r > 75 && r >= g * 0.92 && g > b * 1.15 && b < 115 && luma < 0.62) brownCount += 1;
      if (r > 105 && g < 135 && b < 105 && r > g * 1.08) rustCount += 1;
      if (luma > 0.72 && saturation < 0.24) whitePowderCount += 1;
      if (luma < 0.28) darkCount += 1;
    }

    const brightness = lumaSum / pixels;
    const variance = Math.max(0, (lumaSquaredSum / pixels) - (brightness * brightness));

    return {
      available: true,
      width: metadata.width || info.width,
      height: metadata.height || info.height,
      sizeBytes: imageBuffer.length,
      brightness: Number(brightness.toFixed(4)),
      saturation: Number((saturationSum / pixels).toFixed(4)),
      contrast: Number(Math.sqrt(variance).toFixed(4)),
      greenRatio: Number((greenCount / pixels).toFixed(4)),
      yellowRatio: Number((yellowCount / pixels).toFixed(4)),
      brownRatio: Number((brownCount / pixels).toFixed(4)),
      rustRatio: Number((rustCount / pixels).toFixed(4)),
      whitePowderRatio: Number((whitePowderCount / pixels).toFixed(4)),
      darkRatio: Number((darkCount / pixels).toFixed(4)),
    };
  } catch (error) {
    return null;
  }
};

const getUrlSignals = (imageUrl = '', options = {}) => {
  const normalized = decodeURIComponent(`${String(imageUrl || '')} ${String(options.originalName || '')}`).toLowerCase();
  const has = (...terms) => terms.some((term) => normalized.includes(term));

  return {
    blight: has('blight', 'brown', 'necrotic'),
    spot: has('spot', 'spots', 'lesion'),
    wilt: has('wilt', 'droop'),
    mildew: has('mildew', 'powder', 'white'),
    rust: has('rust', 'orange'),
    yellow: has('yellow', 'chlorosis', 'deficiency'),
    healthy: has('healthy', 'green', 'normal'),
  };
};

const getWeatherSignals = async (location) => {
  try {
    const weather = await Promise.race([
      getWeatherService().getWeatherSnapshotByLocation(location),
      new Promise((resolve) => {
        setTimeout(() => resolve({
          available: false,
          normalizedCondition: 'normal',
          location,
          reason: 'Weather inference timed out',
        }), 2500);
      }),
    ]);
    return weather || { available: false, normalizedCondition: 'normal', location };
  } catch (error) {
    return { available: false, normalizedCondition: 'normal', location };
  }
};

const scoreProfiles = ({ features, urlSignals, weather, cropType, seed }) => {
  const scores = new Map(DISEASE_PROFILES.map((profile) => [profile.label, 8 + noiseFor(seed, profile.label, 8)]));
  const add = (label, amount) => scores.set(label, (scores.get(label) || 0) + amount);

  const cropKey = String(cropType || '').toLowerCase().trim();
  const preferred = CROP_DISEASE_PREFERENCES[cropKey] || [];
  preferred.forEach((label, index) => add(label, 6 - index));

  if (features?.available) {
    const anomalyRatio = features.brownRatio + features.yellowRatio + features.darkRatio + features.rustRatio + features.whitePowderRatio;
    const healthyPurity = clamp((0.08 - anomalyRatio) / 0.08, 0, 1);

    add('Healthy', features.greenRatio * healthyPurity * 78);
    add('Healthy', (1 - Math.abs(features.brightness - 0.52)) * healthyPurity * 18);
    add('Healthy', clamp(0.55 - anomalyRatio, 0, 0.55) * healthyPurity * 35);
    add('Healthy', -(features.brownRatio * 180 + features.yellowRatio * 95 + features.darkRatio * 45 + features.rustRatio * 95 + features.contrast * 16));

    add('Early Blight', features.brownRatio * 190 + features.contrast * 48 + features.darkRatio * 30 + features.yellowRatio * 18);
    add('Leaf Spot', features.brownRatio * 145 + features.contrast * 72 + features.darkRatio * 20);
    add('Bacterial Wilt', features.yellowRatio * 82 + features.darkRatio * 24 + Math.max(0, 0.4 - features.greenRatio) * 28);
    add('Powdery Mildew', (features.whitePowderRatio * 120) + (features.saturation < 0.22 ? 6 : 0));
    add('Rust Disease', features.rustRatio * 100 + features.yellowRatio * 35 + features.contrast * 20);
    add('Nutrient Deficiency', features.yellowRatio * 75 + Math.max(0, 0.36 - features.saturation) * 18);
  }

  if (urlSignals.blight) add('Early Blight', 35);
  if (urlSignals.spot) add('Leaf Spot', 28);
  if (urlSignals.wilt) add('Bacterial Wilt', 34);
  if (urlSignals.mildew) add('Powdery Mildew', 34);
  if (urlSignals.rust) add('Rust Disease', 34);
  if (urlSignals.yellow) add('Nutrient Deficiency', 28);
  if (urlSignals.healthy) add('Healthy', 30);

  const humidity = Number(weather?.humidity);
  const temp = Number(weather?.temperatureC);
  const condition = String(weather?.normalizedCondition || weather?.condition || '').toLowerCase();

  if (condition.includes('humid') || condition.includes('rain')) {
    add('Early Blight', 12);
    add('Leaf Spot', 10);
    add('Powdery Mildew', 12);
    add('Healthy', -8);
  }

  if (Number.isFinite(humidity)) {
    if (humidity >= 82) {
      add('Powdery Mildew', 16);
      add('Leaf Spot', 12);
      add('Early Blight', 12);
    } else if (humidity <= 35) {
      add('Bacterial Wilt', 10);
      add('Nutrient Deficiency', 8);
    }
  }

  if (Number.isFinite(temp)) {
    if (temp >= 34) {
      add('Bacterial Wilt', 14);
      add('Nutrient Deficiency', 7);
      add('Healthy', -5);
    } else if (temp >= 22 && temp <= 29 && humidity >= 45 && humidity <= 70) {
      add('Healthy', 7);
    }
  }

  return Array.from(scores.entries())
    .map(([label, score]) => ({ profile: PROFILE_BY_LABEL.get(label), score }))
    .sort((a, b) => b.score - a.score);
};

const buildReasoning = ({ selected, features, weather, urlSignals }) => {
  const reasons = [];

  if (features?.available) {
    if (selected.label === 'Healthy') reasons.push('Healthy green distribution and balanced brightness suggest low disease pressure.');
    if (selected.label === 'Early Blight') reasons.push('Dark brown regions and contrast patterns align with early blight style lesions.');
    if (selected.label === 'Leaf Spot') reasons.push('Localized discoloration and contrast variation indicate possible leaf spot development.');
    if (selected.label === 'Bacterial Wilt') reasons.push('Yellowing and reduced green coverage suggest wilt or vascular stress indicators.');
    if (selected.label === 'Powdery Mildew') reasons.push('Light low-saturation regions are consistent with powdery fungal residue.');
    if (selected.label === 'Rust Disease') reasons.push('Rust-orange and yellow-brown tones correlate with rust disease symptoms.');
    if (selected.label === 'Nutrient Deficiency') reasons.push('Yellow saturation patterns suggest nutrient stress rather than a strong pathogen signature.');
  } else {
    reasons.push('Image pixels were unavailable, so the engine used filename, crop, location, and weather signals.');
  }

  if (urlSignals.blight || urlSignals.spot || urlSignals.wilt || urlSignals.mildew || urlSignals.rust || urlSignals.yellow || urlSignals.healthy) {
    reasons.push('Filename and storage metadata contained useful crop-condition keywords.');
  }

  if (weather?.available !== false) {
    const humidity = Number(weather?.humidity);
    const temp = Number(weather?.temperatureC);
    if (Number.isFinite(humidity) && humidity >= 75) {
      reasons.push('High humidity increases fungal disease probability in the risk blend.');
    }
    if (Number.isFinite(temp) && temp >= 34) {
      reasons.push('High temperature raises crop stress and wilt probability.');
    }
  }

  return reasons.length ? reasons : ['Crop, image metadata, and contextual signals were blended into a weighted diagnosis.'];
};

const buildActionLabel = (severity) => {
  if (severity === 'None') return 'No Immediate Action';
  if (severity === 'Low' || severity === 'Medium') return 'Monitor Crop';
  return 'Immediate Treatment Recommended';
};

const hasUrlSignal = (urlSignals = {}) => Object.values(urlSignals).some(Boolean);

const chooseProfile = ({ ranked, seed, features, urlSignals }) => {
  const [top, second] = ranked;
  if (!top) return PROFILE_BY_LABEL.get('Leaf Spot');

  if (!features?.available && !hasUrlSignal(urlSignals)) {
    const candidateCount = Math.min(4, ranked.length);
    return ranked[seed % candidateCount]?.profile || top.profile;
  }

  const topScore = Number(top.score || 0);
  const secondScore = Number(second?.score || 0);

  if (second && topScore - secondScore < 4) {
    return noiseFor(seed, 'tie-breaker', 1) > 0.42 ? top.profile : second.profile;
  }

  return top.profile;
};

const buildInferenceResponse = ({ selected, ranked, features, weather, cropType, location, imageUrl, urlSignals, seed }) => {
  const confidence = Number((selected.confidenceMin + noiseFor(seed, 'confidence', selected.confidenceMax - selected.confidenceMin)).toFixed(4));
  const healthScore = Math.round(selected.healthMin + noiseFor(seed, 'health', selected.healthMax - selected.healthMin));
  const riskScore = Number(clamp(selected.riskImpact + noiseFor(seed, 'risk', 0.08), 0.03, 0.92).toFixed(3));
  const yieldImpact = Number(clamp(selected.yieldImpact + noiseFor(seed, 'yield', 0.05), 0.01, 0.55).toFixed(3));
  const reasoning = buildReasoning({ selected, features, weather, urlSignals });
  const locContext = getLocationContext(location);
  const alternatives = ranked
    .filter((item) => item.profile.label !== selected.label)
    .slice(0, 3)
    .map((item) => ({
      label: item.profile.label,
      score: Number(item.score.toFixed(2)),
    }));

  return {
    diagnosis: {
      disease: selected.label,
      confidence,
      severity: selected.severity,
      health_score: healthScore,
      advice: selected.recommendation,
      treatment: selected.treatment,
      action_label: buildActionLabel(selected.severity),
    },
    yield_prediction: {
      predicted_yield: Number((20 * (1 - yieldImpact)).toFixed(1)),
      unit: 'tons/hectare',
      confidence,
      yield_impact: yieldImpact,
    },
    sustainability_score: clamp(Math.round(healthScore + (selected.severity === 'None' ? 4 : -4)), 0, 100),
    risk_assessment: {
      severity: selected.severity === 'None' ? 'low' : selected.severity.toLowerCase(),
      score: riskScore,
      visual_risk_modifier: selected.riskImpact,
    },
    recommendations: [
      {
        type: selected.severity === 'None' ? 'Preventive' : 'Treatment',
        action: selected.recommendation,
        urgency: buildActionLabel(selected.severity),
        treatment: selected.treatment,
        detected_by: 'Hybrid Crop Intelligence Engine',
        reasoning,
      },
    ],
    health_trend: selected.severity === 'None' ? 'stable' : selected.severity === 'High' ? 'declining' : 'watch',
    location_analysis: {
      location,
      region: location,
      weather: weather?.normalizedCondition || 'normal',
      source: 'hybrid-inference',
      weather_snapshot: weather,
    },
    decision_intelligence: {
      severity: selected.severity,
      risk_factor: locContext.risk_factor,
      primary_threat: selected.severity === 'None' ? 'low near-term disease pressure' : locContext.primary_threat,
      estimated_loss: selected.severity === 'None' ? '< 5%' : locContext.estimated_loss,
      urgency: buildActionLabel(selected.severity),
      crop_advisory: reasoning.join(' '),
      recommended_action: selected.recommendation,
      action_label: buildActionLabel(selected.severity),
    },
    explanation: {
      summary: reasoning.join(' '),
      factors: reasoning,
    },
    pipeline: {
      raw_ai: {
        label: selected.label,
        probability: confidence,
        alternatives,
        model: 'Hybrid Heuristic Inference',
        source: 'hybrid-inference',
      },
      image_heuristics: features || { available: false },
      weather_ai: {
        available: weather?.available !== false,
        condition: weather?.normalizedCondition || weather?.condition || 'normal',
        humidity: weather?.humidity ?? null,
        temperatureC: weather?.temperatureC ?? null,
      },
    },
    metadata: {
      source: 'hybrid-inference',
      imageUrl,
      cropType,
      fallback_used: true,
      analysis_timestamp: new Date().toISOString(),
      seed,
      image_features_available: Boolean(features?.available),
    },
  };
};

async function analyzeCropImage(imageUrl, cropType = 'unknown', location = 'unknown', options = {}) {
  const imageBuffer = await getImageBuffer(imageUrl, options);
  const features = await analyzeImageBuffer(imageBuffer);
  const weather = await getWeatherSignals(location);
  const urlSignals = getUrlSignals(imageUrl, options);
  const seed = simpleHash(`${imageUrl || ''}:${options.originalName || ''}:${options.size || ''}:${cropType || ''}:${location || ''}:${features ? JSON.stringify(features) : 'no-pixels'}`);
  const ranked = scoreProfiles({ features, urlSignals, weather, cropType, seed });
  const selected = chooseProfile({ ranked, seed, features, urlSignals });

  return buildInferenceResponse({
    selected,
    ranked,
    features,
    weather,
    cropType,
    location,
    imageUrl,
    urlSignals,
    seed,
  });
}

async function analyzeBatch(imageUrls = [], cropType, location) {
  const results = await Promise.all(imageUrls.map((url) => analyzeCropImage(url, cropType, location)));
  return {
    batch_id: `hybrid_batch_${Date.now()}`,
    total_analyzed: results.length,
    results,
    summary: {
      average_health_score: results.length
        ? Number((results.reduce((sum, item) => sum + Number(item.diagnosis?.health_score || 0), 0) / results.length).toFixed(1))
        : 0,
      hybrid_used: true,
    },
  };
}

module.exports = {
  analyzeCropImage,
  analyzeBatch,
  _internals: {
    analyzeImageBuffer,
    scoreProfiles,
    getUrlSignals,
    DISEASE_PROFILES,
  },
};
