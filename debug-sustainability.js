/**
 * Debug sustainability engine
 */

const { getWaterScore, getFertilizerScore, getDiversityScore, getSoilScore } = require('./ai/trust-engine/sustainabilityEngine');

console.log('🔍 Debugging Sustainability Engine\n');

// Test individual functions
console.log('Testing individual functions:');

console.log('getWaterScore("rice"):', getWaterScore('rice'));
console.log('getWaterScore("wheat"):', getWaterScore('wheat'));
console.log('getWaterScore("maize"):', getWaterScore('maize'));
console.log('getWaterScore("tomato"):', getWaterScore('tomato'));

console.log('\ngetFertilizerScore("rice"):', getFertilizerScore('rice'));
console.log('getFertilizerScore("wheat"):', getFertilizerScore('wheat'));
console.log('getFertilizerScore("maize"):', getFertilizerScore('maize'));
console.log('getFertilizerScore("tomato"):', getFertilizerScore('tomato'));

console.log('\ngetDiversityScore("rice"):', getDiversityScore('rice'));
console.log('getDiversityScore("wheat"):', getDiversityScore('wheat'));
console.log('getDiversityScore("maize"):', getDiversityScore('maize'));
console.log('getDiversityScore("tomato"):', getDiversityScore('tomato'));

console.log('\ngetSoilScore("Punjab, India"):', getSoilScore('Punjab, India'));
console.log('getSoilScore("Kerala, India"):', getSoilScore('Kerala, India'));
console.log('getSoilScore("Andhra Pradesh, India"):', getSoilScore('Andhra Pradesh, India'));

// Test main function
console.log('\nTesting calculateSustainability function:');

const test1 = { cropType: 'rice', location: 'Madhya Pradesh, India' };
console.log('Input:', test1);
const result1 = require('./ai/trust-engine/sustainabilityEngine').calculateSustainability(test1);
console.log('Result:', result1);

const test2 = { cropType: 'wheat', location: 'Punjab, India' };
console.log('Input:', test2);
const result2 = require('./ai/trust-engine/sustainabilityEngine').calculateSustainability(test2);
console.log('Result:', result2);

console.log('\n✅ Debug Complete!');
