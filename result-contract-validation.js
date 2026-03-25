require('dotenv').config({ path: './.env' });

const analysisService = require('./server/src/services/analysisService');
const supabase = require('./server/src/config/supabase');

const requiredTopLevel = [
  'id',
  'image',
  'disease',
  'confidence',
  'severity',
  'riskLevel',
  'riskScore',
  'projectedYield',
  'estimatedLoss',
  'trustScore',
  'eligibility',
  'rating',
  'sustainabilityScore',
  'sustainabilityBreakdown',
  'recommendations',
  'explainabilityText',
  'dataMode',
  'raw',
];

const requiredBreakdownKeys = [
  'water_efficiency',
  'fertilizer_optimization',
  'crop_diversity',
  'soil_health',
];

const requiredDataModeKeys = ['source', 'fallbackUsed'];

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

async function getExistingAnalysisId() {
  const analyses = await analysisService.getAllAnalyses();

  if (!Array.isArray(analyses) || analyses.length === 0 || !analyses[0]?.id) {
    throw new Error('No analysis rows found. Run at least one crop analysis before running this test.');
  }

  return analyses[0].id;
}

function validatePayload(payload) {
  requiredTopLevel.forEach((key) => {
    assert(Object.prototype.hasOwnProperty.call(payload, key), `Missing key: ${key}`);
  });

  assert(typeof payload.projectedYield === 'string', 'projectedYield must be a string');
  assert(Array.isArray(payload.recommendations), 'recommendations must be an array');
  assert(payload.recommendations.length > 0, 'recommendations should not be empty');
  assert(typeof payload.explainabilityText === 'string' && payload.explainabilityText.length > 0, 'explainabilityText must be present');

  requiredBreakdownKeys.forEach((key) => {
    assert(Object.prototype.hasOwnProperty.call(payload.sustainabilityBreakdown, key), `Missing sustainabilityBreakdown key: ${key}`);
  });

  requiredDataModeKeys.forEach((key) => {
    assert(Object.prototype.hasOwnProperty.call(payload.dataMode, key), `Missing dataMode key: ${key}`);
  });

  assert(payload.eligibility === 'Eligible' || payload.eligibility === 'Not Eligible', 'eligibility must be Eligible or Not Eligible');
}

async function run() {
  console.log('=== Result Contract Validation ===');

  const analysisId = await getExistingAnalysisId();
  console.log(`Using analysis id: ${analysisId}`);

  const payload = await analysisService.getAnalysisById(analysisId);
  assert(payload, 'getAnalysisById returned null');

  validatePayload(payload);
  console.log('Result payload contract: PASS');

  const explainability = await analysisService.getExplainability(analysisId);
  assert(explainability?.explainabilityText, 'Explainability payload missing explainabilityText');
  assert(Array.isArray(explainability?.recommendations), 'Explainability payload recommendations missing');
  console.log('Explainability payload contract: PASS');

  console.log('All validations passed.');
}

run().catch((error) => {
  console.error('Result contract validation failed:', error.message);
  process.exit(1);
});
