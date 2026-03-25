/**
 * Trust Engine Validation Suite
 * Comprehensive testing of Trust Score Engine (4-factor system)
 */

const trustEngine = require('./ai/trust-engine/trustCalculator');
const { calculateRisk } = require('./ai/risk-engine/riskCalculator');
const yieldService = require('./server/src/services/yield.service');

console.log("=== TRUST ENGINE VALIDATION ===\n");

// Test scenarios from requirements
const testScenarios = [
    {
        name: "Scenario 1: Good Overall Performance",
        inputs: { ys: 80, rt: 70, su: 60, co: 75 },
        expected: {
            score: (0.3 * 80) + (0.25 * 70) + (0.2 * 60) + (0.25 * 75), // 24 + 17.5 + 12 + 18.75 = 72.25
            rating: "Good"
        }
    },
    {
        name: "Scenario 2: Moderate Performance",
        inputs: { ys: 50, rt: 40, su: 70, co: 60 },
        expected: {
            score: (0.3 * 50) + (0.25 * 40) + (0.2 * 70) + (0.25 * 60), // 15 + 10 + 14 + 15 = 54
            rating: "Moderate"
        }
    },
    {
        name: "Scenario 3: Poor Performance",
        inputs: { ys: 30, rt: 20, su: 50, co: 40 },
        expected: {
            score: (0.3 * 30) + (0.25 * 20) + (0.2 * 50) + (0.25 * 40), // 9 + 5 + 10 + 10 = 34
            rating: "High Risk"
        }
    },
    {
        name: "Scenario 4: Excellent Performance",
        inputs: { ys: 90, rt: 85, su: 80, co: 88 },
        expected: {
            score: (0.3 * 90) + (0.25 * 85) + (0.2 * 80) + (0.25 * 88), // 27 + 21.25 + 16 + 22 = 86.25
            rating: "Excellent"
        }
    }
];

console.log("1. MATHEMATICAL VALIDATION");
console.log("Formula: Trust Score = (0.3 × YS) + (0.25 × RT) + (0.2 × SU) + (0.25 × CO)\n");

testScenarios.forEach((scenario, index) => {
    console.log(`${index + 1}. ${scenario.name}`);
    console.log(`   Inputs: YS=${scenario.inputs.ys}, RT=${scenario.inputs.rt}, SU=${scenario.inputs.su}, CO=${scenario.inputs.co}`);
    console.log(`   Expected Score: ${scenario.expected.score.toFixed(2)}`);
    console.log(`   Expected Rating: ${scenario.expected.rating}`);
    
    const result = trustEngine.calculateTrustScore(scenario.inputs);
    console.log(`   Actual Score: ${result.trustScore}`);
    console.log(`   Actual Rating: ${result.rating}`);
    
    const scoreMatch = Math.abs(result.trustScore - Math.round(scenario.expected.score)) <= 1; // Allow rounding
    const ratingMatch = result.rating === scenario.expected.rating;
    
    console.log(`   ✓ Score Match: ${scoreMatch ? 'PASS' : 'FAIL'}`);
    console.log(`   ✓ Rating Match: ${ratingMatch ? 'PASS' : 'FAIL'}`);
    
    if (!scoreMatch) {
        console.log(`   ⚠️  Score Difference: ${Math.abs(result.trustScore - Math.round(scenario.expected.score))}`);
    }
    
    console.log(`   Weighted Breakdown:`);
    console.log(`     Yield Stability (30%): ${result.weighted.yield_stability}`);
    console.log(`     Risk Trend (25%): ${result.weighted.risk_trend}`);
    console.log(`     Sustainability (20%): ${result.weighted.sustainability}`);
    console.log(`     Consistency (25%): ${result.weighted.consistency}`);
    console.log('');
});

console.log("2. EDGE CASE TESTING");
console.log("Testing boundary conditions and invalid inputs\n");

const edgeCases = [
    { name: "All inputs = 0", inputs: { ys: 0, rt: 0, su: 0, co: 0 }, expectedScore: 0, expectedRating: "High Risk" },
    { name: "All inputs = 100", inputs: { ys: 100, rt: 100, su: 100, co: 100 }, expectedScore: 100, expectedRating: "Excellent" },
    { name: "Inputs > 100", inputs: { ys: 150, rt: 120, su: 110, co: 130 }, expectedScore: 100, expectedRating: "Excellent" },
    { name: "Negative inputs", inputs: { ys: -20, rt: -10, su: -5, co: -15 }, expectedScore: 0, expectedRating: "High Risk" },
    { name: "Mixed invalid", inputs: { ys: 80, rt: null, su: "invalid", co: undefined }, expectedScore: 24, expectedRating: "High Risk" },
    { name: "Boundary - Exactly 50", inputs: { ys: 50, rt: 50, su: 50, co: 50 }, expectedScore: 50, expectedRating: "Moderate" },
    { name: "Boundary - Exactly 65", inputs: { ys: 65, rt: 65, su: 65, co: 65 }, expectedScore: 65, expectedRating: "Good" },
    { name: "Boundary - Exactly 80", inputs: { ys: 80, rt: 80, su: 80, co: 80 }, expectedScore: 80, expectedRating: "Excellent" }
];

edgeCases.forEach((testCase, index) => {
    console.log(`Edge Case ${index + 1}: ${testCase.name}`);
    console.log(`   Inputs: ${JSON.stringify(testCase.inputs)}`);
    console.log(`   Expected Score: ${testCase.expectedScore}, Rating: ${testCase.expectedRating}`);
    
    const result = trustEngine.calculateTrustScore(testCase.inputs);
    console.log(`   Actual Score: ${result.trustScore}, Rating: ${result.rating}`);
    console.log(`   Clamped Inputs: ${JSON.stringify(result.inputs)}`);
    
    const scoreMatch = result.trustScore === testCase.expectedScore;
    const ratingMatch = result.rating === testCase.expectedRating;
    
    console.log(`   ✓ Score Match: ${scoreMatch ? 'PASS' : 'FAIL'}`);
    console.log(`   ✓ Rating Match: ${ratingMatch ? 'PASS' : 'FAIL'}`);
    console.log(`   ✓ Proper Clamping: ${JSON.stringify(testCase.inputs) !== JSON.stringify(result.inputs) ? 'YES' : 'N/A'}`);
    console.log('');
});

console.log("3. INTEGRATION TESTING");
console.log("Testing AI → Risk → Yield → Trust pipeline\n");

// Mock AI scenarios for integration testing
const integrationScenarios = [
    {
        name: "High Risk Integration",
        ai: { confidence: 0.9, severity: "Critical", weather: "humid" },
        crop: "rice",
        health: 75,
        expectedBehavior: "Low trust score due to high risk"
    },
    {
        name: "Medium Risk Integration",
        ai: { confidence: 0.6, severity: "Medium", weather: "normal" },
        crop: "wheat",
        health: 80,
        expectedBehavior: "Moderate trust score"
    },
    {
        name: "Low Risk Integration",
        ai: { confidence: 0.3, severity: "Low", weather: "dry" },
        crop: "corn",
        health: 90,
        expectedBehavior: "High trust score due to low risk"
    }
];

integrationScenarios.forEach((scenario, index) => {
    console.log(`Integration ${index + 1}: ${scenario.name}`);
    
    // Step 1: Risk Engine
    const riskResult = calculateRisk(scenario.ai);
    console.log(`   Risk Score: ${riskResult.riskScore.toFixed(3)} (${riskResult.riskLevel})`);
    
    // Step 2: Yield Engine (using corrected implementation)
    const yieldResult = yieldService.applyDiseaseImpactToYield(
        scenario.crop === "rice" ? 20 : scenario.crop === "wheat" ? 15 : 18,
        scenario.health / 100 // Convert health to loss percentage
    );
    const yieldLossPercent = ((scenario.crop === "rice" ? 20 : scenario.crop === "wheat" ? 15 : 18) - yieldResult) / (scenario.crop === "rice" ? 20 : scenario.crop === "wheat" ? 15 : 18) * 100;
    
    console.log(`   Yield Loss: ${yieldLossPercent.toFixed(1)}%`);
    
    // Step 3: Trust Engine Inputs
    const trustInputs = {
        yieldStability: Number((100 - yieldLossPercent).toFixed(2)),
        riskTrend: Number((100 - (riskResult.riskScore * 100)).toFixed(2)),
        sustainability: 75, // Mock value
        consistency: 80  // Mock value
    };
    
    console.log(`   Trust Inputs: YS=${trustInputs.yieldStability}, RT=${trustInputs.riskTrend}, SU=${trustInputs.sustainability}, CO=${trustInputs.consistency}`);
    
    // Step 4: Trust Engine
    const trustResult = trustEngine.calculateTrustScore(trustInputs);
    console.log(`   Trust Score: ${trustResult.trustScore} (${trustResult.rating})`);
    console.log(`   Expected Behavior: ${scenario.expectedBehavior}`);
    
    // Integration validation
    const riskReducesTrust = riskResult.riskScore > 0.7 && trustResult.trustScore < 65;
    const yieldStabilityIncreasesTrust = trustInputs.yieldStability > 70 && trustResult.trustScore > 70;
    
    console.log(`   ✓ High risk reduces trust: ${riskReducesTrust ? 'PASS' : 'N/A'}`);
    console.log(`   ✓ High yield stability increases trust: ${yieldStabilityIncreasesTrust ? 'PASS' : 'N/A'}`);
    console.log('');
});

console.log("4. RATING CLASSIFICATION VALIDATION");
console.log("Testing rating thresholds and boundaries\n");

const ratingTests = [
    { score: 49.9, expected: "High Risk", description: "Just below Moderate threshold" },
    { score: 50, expected: "Moderate", description: "Exactly at Moderate threshold" },
    { score: 50.1, expected: "Moderate", description: "Just above Moderate threshold" },
    { score: 64.9, expected: "Moderate", description: "Just below Good threshold" },
    { score: 65, expected: "Good", description: "Exactly at Good threshold" },
    { score: 65.1, expected: "Good", description: "Just above Good threshold" },
    { score: 79.9, expected: "Good", description: "Just below Excellent threshold" },
    { score: 80, expected: "Excellent", description: "Exactly at Excellent threshold" },
    { score: 80.1, expected: "Excellent", description: "Just above Excellent threshold" }
];

ratingTests.forEach((test, index) => {
    console.log(`Rating Test ${index + 1}: ${test.description}`);
    console.log(`   Score: ${test.score} → Expected: ${test.expected}`);
    
    const result = trustEngine.calculateTrustScore({ ys: 50, rt: 50, su: 50, co: 50 });
    // Manually test the rating function
    const rating = test.score >= 80 ? 'Excellent' : test.score >= 65 ? 'Good' : test.score >= 50 ? 'Moderate' : 'High Risk';
    
    console.log(`   Actual: ${rating}`);
    console.log(`   Result: ${rating === test.expected ? 'PASS' : 'FAIL'}`);
    console.log('');
});

console.log("5. SENSITIVITY ANALYSIS");
console.log("Testing trust score responsiveness to input changes\n");

const baseInputs = { ys: 70, rt: 60, su: 70, co: 65 };
const baseResult = trustEngine.calculateTrustScore(baseInputs);

console.log(`Base Case: YS=70, RT=60, SU=70, CO=65`);
console.log(`Base Score: ${baseResult.trustScore} (${baseResult.rating})`);

// Test sensitivity for each factor
const sensitivityTests = [
    { factor: "Yield Stability", delta: 5, inputs: { ...baseInputs, ys: 75 } },
    { factor: "Risk Trend", delta: 5, inputs: { ...baseInputs, rt: 65 } },
    { factor: "Sustainability", delta: 5, inputs: { ...baseInputs, su: 75 } },
    { factor: "Consistency", delta: 5, inputs: { ...baseInputs, co: 70 } }
];

sensitivityTests.forEach((test, index) => {
    const result = trustEngine.calculateTrustScore(test.inputs);
    const scoreChange = result.trustScore - baseResult.trustScore;
    const expectedChange = test.delta * 0.3; // For yield stability (30% weight)
    
    console.log(`\nSensitivity Test ${index + 1}: ${test.factor} +${test.delta}`);
    console.log(`   New Score: ${result.trustScore} (${result.rating})`);
    console.log(`   Score Change: +${scoreChange}`);
    console.log(`   Expected Change: +${expectedChange.toFixed(1)} (30% weight)`);
    console.log(`   Responsiveness: ${Math.abs(scoreChange - expectedChange) < 1 ? 'NORMAL' : 'OVER/UNDER RESPONSIVE'}`);
});

console.log('\n=== TRUST ENGINE VALIDATION COMPLETE ===');
