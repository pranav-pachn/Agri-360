const supabase = require('../config/supabase');
const cropService = require('./crop.service');
const yieldService = require('./yield.service');
const sustainabilityService = require('./sustainability.service');
const trustService = require('./trust.service');

/**
 * Generate analysis for a crop and store it
 */
const generateAnalysis = async (crop, location) => {
  // 1. Crop Health
  const health = cropService.calculateCropHealth(crop, location);
  
  // 2. Risk (Keep random value between 0.2-0.6 for now, or move to a service if preferred. The original analysis had it.)
  const risk = parseFloat((Math.random() * (0.6 - 0.2) + 0.2).toFixed(2));
  
  // 3. Yield Prediction
  const predictedYield = yieldService.predictYield(crop, health, risk);
  const normalizedYield = yieldService.normalizeYieldScore(predictedYield, 10);

  // 4. Sustainability
  const sustainability = sustainabilityService.calculateSustainability(crop, location);

  // 5. Trust Score Engine
  const trustEngineResult = trustService.calculateTrustScore(health, normalizedYield, sustainability);

  const analysisResult = {
    crop,
    location,
    health,
    risk,
    yield: predictedYield,
    trust_score: trustEngineResult.trustScore,
    // Store additional raw data to reconstruct breakdown later, or just store the breakdown in a JSON column if the schema supports it.
    // For now, based on original schema, we just store the required fields.
    // We assume the schema has health, risk, yield, trust_score.
  };

  // 6. Store results in Supabase
  const { data, error } = await supabase
    .from('farm_analysis')
    .insert([analysisResult])
    .select()
    .single();

  if (error) {
    throw new Error(`Supabase Error: ${error.message}`);
  }

  return {
    id: data.id,
    crop: data.crop,
    health: data.health,
    risk: data.risk,
    yield: `${data.yield} tons/acre`,
    trustScore: trustEngineResult.trustScore,
    rating: trustEngineResult.rating,
    loanEligibility: trustEngineResult.loanEligible ? "Approved" : "Denied"
  };
};

/**
 * Fetch a stored analysis by ID
 */
const getAnalysisById = async (id) => {
  const { data, error } = await supabase
    .from('farm_analysis')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(`Supabase Error: ${error.message}`);
  }

  return data;
};

/**
 * Fetch all stored analyses
 */
const getAllAnalyses = async () => {
  const { data, error } = await supabase
    .from('farm_analysis')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Supabase Error: ${error.message}`);
  }

  return data;
};

/**
 * Explainability Analysis
 */
const getExplainability = async (id) => {
  const analysis = await getAnalysisById(id);
  if (!analysis) return null;

  // Re-calculate the breakdown from stored health, yield, and a mock sustainability if not stored
  // Usually, we'd store these or re-run the algorithm. 
  // Let's re-run for consistency or use stored values
  const health = analysis.health;
  const normalizedYield = yieldService.normalizeYieldScore(analysis.yield, 10);
  const sustainability = sustainabilityService.calculateSustainability(analysis.crop, analysis.location); // recalculating as it wasn't stored

  const trustEngineResult = trustService.calculateTrustScore(health, normalizedYield, sustainability);
  const reason = trustService.getExplainabilityReason(trustEngineResult.rating);

  return {
    score: analysis.trust_score || trustEngineResult.trustScore,
    breakdown: {
      crop_health: trustEngineResult.breakdown.crop_health,
      yield: trustEngineResult.breakdown.yield,
      sustainability: trustEngineResult.breakdown.sustainability,
      behavior: trustEngineResult.breakdown.behavior,
      compliance: trustEngineResult.breakdown.compliance,
      external: trustEngineResult.breakdown.external
    },
    reason
  };
};

module.exports = {
  generateAnalysis,
  getAnalysisById,
  getAllAnalyses,
  getExplainability
};
