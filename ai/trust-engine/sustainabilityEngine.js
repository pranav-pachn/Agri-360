/**
 * Sustainability Engine
 * Calculates sustainability scores based on crop type and location factors
 */

// Crop-specific water requirements scoring
const getWaterScore = (crop) => {
    if (!crop) return 60;
    
    const map = {
        rice: 40,     // water intensive
        wheat: 70,
        maize: 75,
        tomato: 65
    };

    return map[crop.toLowerCase()] || 60;
};

// Crop-specific fertilizer optimization scoring
const getFertilizerScore = (crop, level = 'medium') => {
    if (!crop) return 60;
    
    const baseScores = {
        'rice': { low: 30, medium: 50, high: 70 },
        'wheat': { low: 45, medium: 65, high: 85 },
        'maize': { low: 40, medium: 60, high: 80 },
        'tomato': { low: 35, medium: 55, high: 75 }
    };
    
    const cropScores = baseScores[crop.toLowerCase()] || baseScores['tomato'];
    return cropScores[level] || cropScores.medium;
};

// Crop diversity and rotation benefits scoring
const getDiversityScore = (crop) => {
    if (!crop) return 70;
    
    // simple mock as requested
    return crop.toLowerCase() === "rice" ? 50 : 70;
};

// Location-based soil health scoring
const getSoilScore = (location) => {
    if (!location || typeof location !== 'string') return 60;
    
    if (location.includes("Punjab")) return 55;
    if (location.includes("Kerala")) return 75;
    if (location.includes("Andhra")) return 65;

    return 60;
};

/**
 * Calculate sustainability score based on crop type and location
 * @param {string} cropType - Type of crop
 * @param {string} location - Geographic location
 * @param {string} [fertilizerLevel] - Fertilizer usage level (low, medium, high)
 * @returns {number} Sustainability score (0-100)
 */
const calculateSustainability = ({
    cropType,
    location,
    fertilizerLevel = 'medium'
}) => {
    // Calculate individual component scores
    const waterScore = getWaterScore(cropType);
    const fertilizerScore = getFertilizerScore(cropType, fertilizerLevel);
    const diversityScore = getDiversityScore(cropType);
    const soilScore = getSoilScore(location);

    // Calculate weighted sustainability score
    const score =
        (0.3 * waterScore) +
        (0.3 * fertilizerScore) +
        (0.2 * diversityScore) +
        (0.2 * soilScore);

    // Ensure score is within valid range
    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    return finalScore;
};

/**
 * Get detailed sustainability breakdown for analysis
 * @param {string} cropType - Type of crop
 * @param {string} location - Geographic location
 * @param {string} [fertilizerLevel] - Fertilizer usage level (low, medium, high)
 * @returns {object} Detailed breakdown of sustainability scores
 */
const getSustainabilityBreakdown = ({
    cropType,
    location,
    fertilizerLevel = 'medium'
}) => {
    const waterScore = getWaterScore(cropType);
    const fertilizerScore = getFertilizerScore(cropType, fertilizerLevel);
    const diversityScore = getDiversityScore(cropType);
    const soilScore = getSoilScore(location);

    const overallScore = Math.round(
        (0.3 * waterScore) +
        (0.3 * fertilizerScore) +
        (0.2 * diversityScore) +
        (0.2 * soilScore)
    );

    return {
        overall: Math.max(0, Math.min(100, overallScore)),
        components: {
            water_efficiency: Math.round(waterScore),
            fertilizer_optimization: Math.round(fertilizerScore),
            crop_diversity: Math.round(diversityScore),
            soil_health: Math.round(soilScore)
        },
        weights: {
            water_efficiency: 0.3,
            fertilizer_optimization: 0.3,
            crop_diversity: 0.2,
            soil_health: 0.2
        },
        metadata: {
            crop_type: cropType,
            location: location,
            fertilizer_level: fertilizerLevel,
            calculation_method: 'sustainability-engine-v1',
            timestamp: new Date().toISOString()
        }
    };
};

// Export utility functions for testing
module.exports = {
    calculateSustainability,
    getSustainabilityBreakdown,
    getWaterScore,
    getFertilizerScore,
    getDiversityScore,
    getSoilScore
};
