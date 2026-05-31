/**
 * Disease to Severity Mapping
 * Maps raw ML predictions (like PlantVillage classes) to standard risk severity levels.
 */

const DISEASE_SEVERITY_MAP = {
    // Healthy classes
    'Pepper__bell___healthy': 'Low', // We map None/Healthy to Low for the risk engine base
    'Potato___healthy': 'Low',
    'Tomato_healthy': 'Low',

    // Low severity
    'Tomato_Leaf_Mold': 'Low',

    // Medium severity
    'Tomato_Septoria_leaf_spot': 'Medium',
    'Tomato_Early_blight': 'Medium',
    'Potato___Early_blight': 'Medium',
    'Tomato_Spider_mites_Two_spotted_spider_mite': 'Medium',
    'Tomato__Target_Spot': 'Medium',

    // High severity
    'Tomato_Late_blight': 'High',
    'Potato___Late_blight': 'High',
    'Tomato_Bacterial_spot': 'High',
    'Pepper__bell___Bacterial_spot': 'High',
    'Tomato__Tomato_YellowLeaf__Curl_Virus': 'High',

    // Critical severity
    'Tomato__Tomato_mosaic_virus': 'Critical'
};

const getDiseaseSeverity = (diseaseName) => {
    if (!diseaseName) return 'Medium'; // default fallback
    
    // Check exact match
    if (DISEASE_SEVERITY_MAP[diseaseName]) {
        return DISEASE_SEVERITY_MAP[diseaseName];
    }
    
    // Check partial matches
    const name = diseaseName.toLowerCase();
    if (name.includes('healthy') || name.includes('none')) return 'Low';
    if (name.includes('late blight') || name.includes('bacterial') || name.includes('virus')) return 'High';
    
    return 'Medium'; // safe fallback
};

module.exports = {
    getDiseaseSeverity,
    DISEASE_SEVERITY_MAP
};
