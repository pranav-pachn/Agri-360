const supabase = require('../config/supabase');
const trustService = require('../services/trust.service');
const yieldService = require('../services/yield.service');
const sustainabilityService = require('../services/sustainability.service');

const seedData = async () => {
    console.log('Seeding demo data...');

    // We will compute their trust score exactly how the application does to make sure it matches.
    const farmers = [
        { crop: 'Rice', location: 'Punjab', health: 85, risk: 0.1, baseYield: 4.5 },   // Good
        { crop: 'Wheat', location: 'Haryana', health: 60, risk: 0.3, baseYield: 2.8 },  // Medium
        { crop: 'Tomato', location: 'Maharashtra', health: 30, risk: 0.6, baseYield: 1.0 } // Low
    ];

    for (const f of farmers) {
        const normalizedYield = yieldService.normalizeYieldScore(f.baseYield, 10);
        const sustainability = sustainabilityService.calculateSustainability(f.crop, f.location);
        const trustEngineResult = trustService.calculateTrustScore(f.health, normalizedYield, sustainability);
        
        const record = {
            crop: f.crop,
            location: f.location,
            health: f.health,
            risk: f.risk,
            yield: f.baseYield,
            trust_score: trustEngineResult.trustScore
        };

        const { data, error } = await supabase
            .from('farm_analysis')
            .insert([record]);
            
        if (error) {
            console.error(`Failed to insert ${f.crop} farmer:`, error.message);
        } else {
            console.log(`Inserted ${f.crop} farmer. Score: ${trustEngineResult.trustScore} - ${trustEngineResult.rating}`);
        }
    }

    console.log('Seeding complete.');
};

seedData();
