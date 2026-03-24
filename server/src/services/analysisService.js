const supabase = require('../config/supabase');
const { calculateTrustScore } = require('../utils/formula');

/**
 * Generate mock analysis for a crop and store it
 */
const generateAnalysis = async (crop, location) => {
  // 1. Crop Health: Random value between 60–90
  const health = Math.floor(Math.random() * (90 - 60 + 1)) + 60;
  
  // 2. Risk: Random value between 0.2–0.6
  const risk = parseFloat((Math.random() * (0.6 - 0.2) + 0.2).toFixed(2));
  
  // 3. Yield Prediction: Simple rule-based formula
  const baseYield = 10; // example base yield
  let predictedYield = baseYield * (health / 100) * (1 - risk);
  predictedYield = parseFloat(predictedYield.toFixed(2));

  // 4. Trust Score Engine
  const trustScore = calculateTrustScore(health, risk, predictedYield);

  const analysisResult = {
    crop,
    location,
    health,
    risk,
    yield: predictedYield,
    trust_score: trustScore
  };

  // 5. Store results in Supabase
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
    health: data.health,
    risk: data.risk,
    yield: data.yield,
    trustScore: data.trust_score
  };
};

/**
 * Fetch a stored analysis by ID
 */
const getAnalysisById = async (id) => {
  const { data, error } = await supabase
    .from('farm_analysis')
    .select('id, crop, location, health, risk, yield, trust_score, created_at')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Supabase Error: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    health: data.health,
    risk: data.risk,
    yield: data.yield,
    trustScore: data.trust_score
  };
};

module.exports = {
  generateAnalysis,
  getAnalysisById
};
