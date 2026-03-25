/**
 * Enhanced Sustainability Analysis Service
 * Data-driven sustainability scoring with agricultural logic
 */

// Configuration for real vs simulated data
const USE_REAL_DATA = process.env.USE_REAL_DATA === 'true';

// Sustainability scoring weights
const SUSTAINABILITY_WEIGHTS = {
    WATER_EFFICIENCY: 0.25,
    FERTILIZER_OPTIMIZATION: 0.25,
    CROP_DIVERSITY: 0.25,
    SOIL_HEALTH: 0.25
};

// Crop-specific sustainability characteristics
const CROP_PROFILES = {
    'Tomato': {
        waterNeeds: 'high',      // High water requirements
        fertilizerNeeds: 'medium', // Moderate fertilizer needs
        diversityImpact: 'medium',  // Good for crop rotation
        soilHealthImpact: 'medium'  // Moderate soil impact
    },
    'Wheat': {
        waterNeeds: 'medium',
        fertilizerNeeds: 'low',
        diversityImpact: 'high',     // Excellent for rotation
        soilHealthImpact: 'high'     // Improves soil structure
    },
    'Rice': {
        waterNeeds: 'very-high',  // Very high water needs
        fertilizerNeeds: 'high',
        diversityImpact: 'medium',
        soilHealthImpact: 'low'      // Can degrade soil if not managed
    },
    'Corn': {
        waterNeeds: 'high',
        fertilizerNeeds: 'high',
        diversityImpact: 'medium',
        soilHealthImpact: 'medium'
    },
    'Potato': {
        waterNeeds: 'medium',
        fertilizerNeeds: 'medium',
        diversityImpact: 'high',     // Good rotation crop
        soilHealthImpact: 'medium'
    },
    'Cotton': {
        waterNeeds: 'high',
        fertilizerNeeds: 'high',
        diversityImpact: 'low',      // Often monoculture
        soilHealthImpact: 'low'      // Can be soil intensive
    }
};

// Location-based climate factors
const LOCATION_FACTORS = {
    'Punjab': {
        rainfall: 'adequate',
        temperature: 'optimal',
        seasonLength: 'long',
        waterEfficiency: 0.1,   // Good irrigation infrastructure
        sustainabilityBonus: 5
    },
    'Gujarat': {
        rainfall: 'variable',
        temperature: 'hot',
        seasonLength: 'medium',
        waterEfficiency: 0.05,
        sustainabilityBonus: -2
    },
    'Maharashtra': {
        rainfall: 'seasonal',
        temperature: 'variable',
        seasonLength: 'medium',
        waterEfficiency: -0.05,
        sustainabilityBonus: -3
    },
    'Rajasthan': {
        rainfall: 'low',
        temperature: 'hot',
        seasonLength: 'short',
        waterEfficiency: -0.1,
        sustainabilityBonus: -5
    },
    'Uttar Pradesh': {
        rainfall: 'adequate',
        temperature: 'optimal',
        seasonLength: 'long',
        waterEfficiency: 0.08,
        sustainabilityBonus: 0
    },
    'Madhya Pradesh': {
        rainfall: 'moderate',
        temperature: 'optimal',
        seasonLength: 'medium',
        waterEfficiency: 0.02,
        sustainabilityBonus: 2
    },
    'Karnataka': {
        rainfall: 'seasonal',
        temperature: 'warm',
        seasonLength: 'medium',
        waterEfficiency: 0.06,
        sustainabilityBonus: 1
    }
};

const calculateWaterEfficiency = (crop, location) => {
    const cropProfile = CROP_PROFILES[crop] || CROP_PROFILES['Tomato'];
    const locationData = LOCATION_FACTORS[location.split(',').pop()?.trim() || location] || LOCATION_FACTORS['Madhya Pradesh'];
    
    let baseScore = 50; // Base score out of 100
    
    // Adjust based on crop water needs
    const waterNeedsMultiplier = {
        'very-high': 0.7,
        'high': 0.8,
        'medium': 0.9,
        'low': 0.95
    };
    
    baseScore *= waterNeedsMultiplier[cropProfile.waterNeeds] || 0.8;
    
    // Adjust for location water efficiency
    baseScore += (locationData.waterEfficiency * 20);
    
    // Add some realistic variation
    const variation = (Math.sin(Date.now() / 10000) * 5); // Small variation
    baseScore += variation;
    
    return Math.max(0, Math.min(100, baseScore));
};

const calculateFertilizerOptimization = (crop, location) => {
    const cropProfile = CROP_PROFILES[crop] || CROP_PROFILES['Tomato'];
    let baseScore = 60;
    
    // Adjust based on crop fertilizer needs
    const fertilizerMultiplier = {
        'high': 0.8,
        'medium': 0.9,
        'low': 0.95
    };
    
    baseScore *= fertilizerMultiplier[cropProfile.fertilizerNeeds] || 0.9;
    
    // Location-specific farming practices (simulated)
    const locationData = LOCATION_FACTORS[location.split(',').pop()?.trim() || location] || LOCATION_FACTORS['Madhya Pradesh'];
    baseScore += locationData.sustainabilityBonus;
    
    // Add realistic variation
    const variation = (Math.cos(Date.now() / 8000) * 3);
    baseScore += variation;
    
    return Math.max(0, Math.min(100, baseScore));
};

const calculateCropDiversity = (crop, location) => {
    const cropProfile = CROP_PROFILES[crop] || CROP_PROFILES['Tomato'];
    let baseScore = 70;
    
    // Adjust based on crop diversity impact
    const diversityMultiplier = {
        'high': 1.1,
        'medium': 1.0,
        'low': 0.9
    };
    
    baseScore *= diversityMultiplier[cropProfile.diversityImpact] || 1.0;
    
    // Location diversity practices (simulated)
    const locationData = LOCATION_FACTORS[location.split(',').pop()?.trim() || location] || LOCATION_FACTORS['Madhya Pradesh'];
    
    // Some locations have better crop rotation practices
    if (locationData.rainfall === 'adequate') {
        baseScore += 5;
    }
    
    // Add variation
    const variation = (Math.sin(Date.now() / 12000) * 4);
    baseScore += variation;
    
    return Math.max(0, Math.min(100, baseScore));
};

const calculateSoilHealth = (crop, location) => {
    const cropProfile = CROP_PROFILES[crop] || CROP_PROFILES['Tomato'];
    let baseScore = 65;
    
    // Adjust based on crop soil impact
    const soilMultiplier = {
        'high': 1.1,
        'medium': 1.0,
        'low': 0.9
    };
    
    baseScore *= soilMultiplier[cropProfile.soilHealthImpact] || 1.0;
    
    // Location soil conditions (simulated)
    const locationData = LOCATION_FACTORS[location.split(',').pop()?.trim() || location] || LOCATION_FACTORS['Madhya Pradesh'];
    
    // Adjust for climate impact on soil
    if (locationData.temperature === 'optimal') {
        baseScore += 5;
    } else if (locationData.temperature === 'variable') {
        baseScore -= 2;
    }
    
    // Add variation
    const variation = (Math.cos(Date.now() / 10000) * 3);
    baseScore += variation;
    
    return Math.max(0, Math.min(100, baseScore));
};

const calculateSustainability = (crop, location) => {
    if (USE_REAL_DATA) {
        // Future: Integrate with real APIs and sensors
        // For now, return enhanced mock data
        return calculateRealDataSustainability(crop, location);
    } else {
        // Use enhanced mock data-driven approach
        return calculateMockDataSustainability(crop, location);
    }
};

const calculateMockDataSustainability = (crop, location) => {
    // Calculate individual sustainability metrics
    const waterEfficiency = calculateWaterEfficiency(crop, location);
    const fertilizerOptimization = calculateFertilizerOptimization(crop, location);
    const cropDiversity = calculateCropDiversity(crop, location);
    const soilHealth = calculateSoilHealth(crop, location);
    
    // Calculate weighted sustainability score
    const sustainabilityScore = 
        (waterEfficiency * SUSTAINABILITY_WEIGHTS.WATER_EFFICIENCY) +
        (fertilizerOptimization * SUSTAINABILITY_WEIGHTS.FERTILIZER_OPTIMIZATION) +
        (cropDiversity * SUSTAINABILITY_WEIGHTS.CROP_DIVERSITY) +
        (soilHealth * SUSTAINABILITY_WEIGHTS.SOIL_HEALTH);
    
    return {
        score: Math.round(sustainabilityScore),
        breakdown: {
            water_efficiency: Math.round(waterEfficiency),
            fertilizer_optimization: Math.round(fertilizerOptimization),
            crop_diversity: Math.round(cropDiversity),
            soil_health: Math.round(soilHealth),
            weights: SUSTAINABILITY_WEIGHTS
        },
        metadata: {
            crop_type: crop,
            location: location,
            calculation_method: 'data-driven-mock',
            timestamp: new Date().toISOString()
        }
    };
};

const calculateRealDataSustainability = (crop, location) => {
    // Placeholder for future real data integration
    // This would integrate with:
    // - IoT soil sensors
    // - Weather APIs
    // - Satellite imagery
    // - Farm management records
    
    return calculateMockDataSustainability(crop, location);
};

module.exports = {
    calculateSustainability,
    calculateWaterEfficiency,
    calculateFertilizerOptimization,
    calculateCropDiversity,
    calculateSoilHealth,
    CROP_PROFILES,
    LOCATION_FACTORS,
    SUSTAINABILITY_WEIGHTS
};