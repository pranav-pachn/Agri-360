/**
 * Comprehensive test for updated sustainability metrics
 */

const { calculateSustainability, getSustainabilityBreakdown } = require('./ai/trust-engine/sustainabilityEngine');

console.log('🌱 Sustainability Metrics Verification Test\n');

// Test all user-requested scenarios
const testScenarios = [
    {
        name: 'Water Usage - Rice (Intensive)',
        crop: 'rice',
        location: 'Madhya Pradesh, India',
        expected: { water: 40, fertilizer: 60, diversity: 50, soil: 60 }
    },
    {
        name: 'Water Usage - Wheat (Efficient)',
        crop: 'wheat',
        location: 'Punjab, India',
        expected: { water: 70, fertilizer: 65, diversity: 70, soil: 55 }
    },
    {
        name: 'Water Usage - Maize (High)',
        crop: 'maize',
        location: 'Uttar Pradesh, India',
        expected: { water: 75, fertilizer: 70, diversity: 70, soil: 60 }
    },
    {
        name: 'Water Usage - Tomato (Medium)',
        crop: 'tomato',
        location: 'Karnataka, India',
        expected: { water: 65, fertilizer: 60, diversity: 70, soil: 60 }
    },
    {
        name: 'Fertilizer - Rice (High Usage)',
        crop: 'rice',
        location: 'Gujarat, India',
        expected: { water: 40, fertilizer: 50, diversity: 50, soil: 60 }
    },
    {
        name: 'Fertilizer - Wheat (Efficient)',
        crop: 'wheat',
        location: 'Haryana, India',
        expected: { water: 70, fertilizer: 65, diversity: 70, soil: 90 }
    },
    {
        name: 'Diversity - Rice (Low)',
        crop: 'rice',
        location: 'Tamil Nadu, India',
        expected: { water: 40, fertilizer: 60, diversity: 50, soil: 60 }
    },
    {
        name: 'Diversity - Wheat (High)',
        crop: 'wheat',
        location: 'West Bengal, India',
        expected: { water: 70, fertilizer: 65, diversity: 70, soil: 90 }
    },
    {
        name: 'Soil Health - Punjab (Low)',
        crop: 'maize',
        location: 'Punjab, India',
        expected: { water: 75, fertilizer: 70, diversity: 70, soil: 55 }
    },
    {
        name: 'Soil Health - Kerala (High)',
        crop: 'rice',
        location: 'Kerala, India',
        expected: { water: 40, fertilizer: 60, diversity: 50, soil: 75 }
    },
    {
        name: 'Soil Health - Andhra (Medium)',
        crop: 'maize',
        location: 'Andhra Pradesh, India',
        expected: { water: 75, fertilizer: 70, diversity: 70, soil: 65 }
    }
];

console.log('📊 Test Results:\n');

let passedTests = 0;
let totalTests = testScenarios.length;

testScenarios.forEach((scenario, index) => {
    const result = calculateSustainability({
        crop: scenario.crop,
        location: scenario.location
    });
    
    const breakdown = getSustainabilityBreakdown({
        crop: scenario.crop,
        location: scenario.location
    });
    
    const waterMatch = breakdown.components.water_efficiency === scenario.expected.water;
    const fertilizerMatch = breakdown.components.fertilizer_optimization === scenario.expected.fertilizer;
    const diversityMatch = breakdown.components.crop_diversity === scenario.expected.diversity;
    const soilMatch = breakdown.components.soil_health === scenario.expected.soil;
    
    const testPassed = waterMatch && fertilizerMatch && diversityMatch && soilMatch;
    
    console.log(`\n${index + 1}. ${scenario.name}`);
    console.log(`   Expected: Water=${scenario.expected.water}, Fert=${scenario.expected.fertilizer}, Div=${scenario.expected.diversity}, Soil=${scenario.expected.soil}`);
    console.log(`   Actual:   Water=${breakdown.components.water_efficiency}, Fert=${breakdown.components.fertilizer_optimization}, Div=${breakdown.components.crop_diversity}, Soil=${breakdown.components.soil_health}`);
    console.log(`   Overall Score: ${result}`);
    console.log(`   Status: ${testPassed ? '✅ PASS' : '❌ FAIL'}`);
    
    if (testPassed) passedTests++;
});

console.log('\n📈 Summary:');
console.log(`Tests Passed: ${passedTests}/${totalTests}`);
console.log(`Success Rate: ${Math.round((passedTests/totalTests) * 100)}%`);

// Test edge cases
console.log('\n🧪 Edge Case Tests:\n');

const edgeCases = [
    { crop: 'unknown', location: 'unknown' },
    { crop: '', location: '' },
    { crop: null, location: null }
];

edgeCases.forEach((testCase, index) => {
    const result = calculateSustainability(testCase);
    console.log(`Edge Case ${index + 1}: ${JSON.stringify(testCase)} → Score: ${result}`);
});

console.log('\n✅ Sustainability Metrics Verification Complete!');

if (passedTests === totalTests) {
    console.log('\n🎉 All Tests Passed! User metrics implemented correctly.');
} else {
    console.log('\n⚠️  Some tests failed. Check implementation.');
}
