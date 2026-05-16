// Minimal enhanced mock service to provide predictable AI-like responses
async function analyzeCropImage(imageUrl, cropType = 'unknown', location = 'unknown') {
    return {
        diagnosis: {
            disease: 'healthy',
            confidence: 0.98
        },
        yield: {
            predicted: 1.0,
            units: 'tonnes'
        },
        sustainability: 0.75,
        risk: {
            severity: 'low',
            score: 12
        },
        recommendations: ['Monitor crop', 'Maintain irrigation'],
        health_trend: 'stable',
        location_analysis: { region: location },
        metadata: { source: 'enhanced-mock-service', imageUrl, cropType }
    };
}

async function analyzeBatch(imageUrls = [], cropType, location) {
    return Promise.all(imageUrls.map(() => analyzeCropImage(null, cropType, location)));
}

module.exports = {
    analyzeCropImage,
    analyzeBatch
};
