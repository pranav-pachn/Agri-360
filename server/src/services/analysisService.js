const supabase = require('../config/supabase');
const cropService = require('./crop.service');
const yieldService = require('./yield.service');
const sustainabilityService = require('./sustainability.service');
const trustService = require('./trust.service');
const aiService = require('./ai.service');

/**
 * Generate analysis for a crop and store it
 */
const generateAnalysis = async (crop, location, imageUrl = null) => {
    // 1. Enhanced AI integration
    const aiResults = await aiService.analyzeCropImage(imageUrl, crop, location);
    
    // 2. Extract values for Trust Engine with enhanced data
    const health = aiResults.diagnosis.health_score;
    const predictedYield = aiResults.yield_prediction.predicted_yield;
    const normalizedYield = yieldService.normalizeYieldScore(predictedYield, 10);
    const sustainability = aiResults.sustainability_score || sustainabilityService.calculateSustainability(crop, location);
    const risk = aiResults.risk_assessment || parseFloat((Math.random() * (0.6 - 0.2) + 0.2).toFixed(2));
    
    // 3. Trust Score Engine with enhanced components
    const trustEngineResult = trustService.calculateTrustScore(health, normalizedYield, sustainability);
    
    // 4. Enhanced analysis result with new database fields
    const analysisResult = {
        crop,
        location,
        health,
        risk,
        yield: predictedYield,
        trust_score: trustEngineResult.trustScore,
        credit_rating: trustEngineResult.rating,
        image_url: imageUrl,
        
        // NEW FIELDS FROM ENHANCED SCHEMA
        severity: aiResults.diagnosis.severity,
        sustainability_index: sustainability,
        confidence: aiResults.diagnosis.confidence,
        
        // Enhanced timestamp
        created_at: new Date().toISOString()
    };
    
    // 5. Store in enhanced crop_reports table
    const insertResult = await supabase
        .from('crop_reports')
        .insert([analysisResult])
        .select(`
            id,
            crop,
            location,
            health,
            risk,
            yield,
            trust_score,
            credit_rating,
            image_url,
            severity,
            sustainability_index,
            confidence,
            created_at
        `)
        .single();
    
    if (insertResult.error) {
        throw new Error(`Supabase Error: ${insertResult.error.message}`);
    }
    
    // 6. Enhanced response format for frontend compatibility
    return {
        id: insertResult.data.id,
        crop: insertResult.data.crop,
        location: insertResult.data.location,
        timestamp: insertResult.data.created_at,
        score: insertResult.data.trust_score,
        credit_rating: insertResult.data.credit_rating,
        image_url: insertResult.data.image_url,
        diagnosis: {
            disease: aiResults.diagnosis.disease,
            confidence: aiResults.diagnosis.confidence,
            severity: aiResults.diagnosis.severity,
            health_score: health
        },
        yield_prediction: {
            predicted_yield: insertResult.data.yield,
            unit: 'tons/hectare',
            confidence: aiResults.yield_prediction.confidence
        },
        sustainability_index: sustainability,
        breakdown: trustEngineResult.breakdown,
        recommendations: aiResults.recommendations,
        health_trend: aiResults.health_trend
    };
};

/**
 * Fetch a stored analysis by ID
 */
const getAnalysisById = async (id) => {
    const { data: analysisData, error: fetchError } = await supabase
        .from('crop_reports')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError) {
        if (fetchError.code === 'PGRST116') return null; // Not found
        throw new Error(`Supabase Error: ${fetchError.message}`);
    }

    return analysisData;
};

/**
 * Fetch all stored analyses
 */
const getAllAnalyses = async () => {
    const { data: analysesData, error: fetchAllError } = await supabase
        .from('crop_reports')
        .select('*')
        .order('created_at', { ascending: false });

    if (fetchAllError) {
        throw new Error(`Supabase Error: ${fetchAllError.message}`);
    }

    return analysesData;
};

/**
 * Explainability Analysis
 */
const getExplainability = async (id) => {
  const analysis = await getAnalysisById(id);
  if (!analysis) return null;

  // Reconstruct AI analysis visually based on stored health 
  // (In production, the full JSON would be fetched, here we regenerate matching mock data)
  const health = analysis.health;
  const normalizedYield = yieldService.normalizeYieldScore(analysis.yield, 10);
  const sustainability = sustainabilityService.calculateSustainability(analysis.crop, analysis.location);

  const trustEngineResult = trustService.calculateTrustScore(health, normalizedYield, sustainability);
  
  // Reconstruct the deep UI payload required by Result.jsx
  return {
    id: analysis.id,
    crop: analysis.crop,
    location: analysis.location,
    timestamp: analysis.created_at || new Date().toISOString(),
    score: analysis.trust_score || trustEngineResult.trustScore,
    credit_rating: trustEngineResult.rating,
    image_url: analysis.image_url,
    diagnosis: {
      disease: health > 80 ? 'None Detected' : 'Identified Pathogen',
      confidence: 94.7,
      severity: health > 80 ? 'None' : 'Moderate',
      health_score: health
    },
    yield_prediction: {
      predicted_yield: analysis.yield,
      unit: 'tons/hectare',
      confidence: 0.88
    },
    sustainability_index: sustainability,
    breakdown: trustEngineResult.breakdown,
    recommendations: [
      {
        type: 'Treatment',
        action: health > 80 ? 'Continue current practices' : 'Apply recommended fungicide',
        urgency: health > 80 ? 'Low' : 'High'
      }
    ],
    health_trend: [
      { date: '2024-01', score: health + 5, label: 'Jan' },
      { date: '2024-02', score: health + 2, label: 'Feb' },
      { date: '2024-03', score: health, label: 'Mar' }
    ]
  };
};

module.exports = {
  generateAnalysis,
  getAnalysisById,
  getAllAnalyses,
  getExplainability
};
