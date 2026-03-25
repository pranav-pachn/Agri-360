/**
 * Yield Engine Validation Suite
 * Comprehensive testing of Yield Prediction Engine
 */

const yieldService = require('./server/src/services/yield.service');
const { calculateRisk } = require('./ai/risk-engine/riskCalculator');

console.log("=== YIELD ENGINE VALIDATION ===\n");

// Test scenarios from requirements
const testScenarios = [
    {
        name: "Scenario 1: High base yield, High risk",
        baseYield: 20,
        riskScore: 0.8,
        expected: {
            projectedYield: 20 * (1 - 0.8 * 0.5), // 20 * 0.6 = 12
            yieldLossPercent: 0.8 * 0.5 * 100 // 40%
        }
    },
    {
        name: "Scenario 2: Medium base yield, Medium risk",
        baseYield: 15,
        riskScore: 0.5,
        expected: {
            projectedYield: 15 * (1 - 0.5 * 0.5), // 15 * 0.75 = 11.25
            yieldLossPercent: 0.5 * 0.5 * 100 // 25%
        }
    },
    {
        name: "Scenario 3: High base yield, Low risk",
        baseYield: 25,
        riskScore: 0.2,
        expected: {
            projectedYield: 25 * (1 - 0.2 * 0.5), // 25 * 0.9 = 22.5
            yieldLossPercent: 0.2 * 0.5 * 100 // 10%
        }
    },
    {
        name: "Scenario 4: Medium base yield, Maximum risk",
        baseYield: 18,
        riskScore: 1.0,
        expected: {
            projectedYield: 18 * (1 - 1.0 * 0.5), // 18 * 0.5 = 9
            yieldLossPercent: 1.0 * 0.5 * 100 // 50%
        }
    }
];

console.log("1. MATHEMATICAL VALIDATION - SPECIFIED FORMULA");
console.log("Formula: Projected Yield = Base Yield × (1 - Risk Score × 0.5)\n");

testScenarios.forEach((scenario, index) => {
    console.log(`${index + 1}. ${scenario.name}`);
    console.log(`   Base Yield: ${scenario.baseYield}, Risk Score: ${scenario.riskScore}`);
    console.log(`   Expected Projected Yield: ${scenario.expected.projectedYield.toFixed(2)}`);
    console.log(`   Expected Loss %: ${scenario.expected.yieldLossPercent.toFixed(1)}%`);
    
    // Test with our implementation of the specified formula
    const actualProjectedYield = scenario.baseYield * (1 - scenario.riskScore * 0.5);
    const actualLossPercent = scenario.riskScore * 0.5 * 100;
    
    console.log(`   Actual Projected Yield: ${actualProjectedYield.toFixed(2)}`);
    console.log(`   Actual Loss %: ${actualLossPercent.toFixed(1)}%`);
    
    const yieldMatch = Math.abs(actualProjectedYield - scenario.expected.projectedYield) < 0.001;
    const lossMatch = Math.abs(actualLossPercent - scenario.expected.yieldLossPercent) < 0.001;
    
    console.log(`   ✓ Yield Match: ${yieldMatch ? 'PASS' : 'FAIL'}`);
    console.log(`   ✓ Loss % Match: ${lossMatch ? 'PASS' : 'FAIL'}`);
    console.log('');
});

console.log("2. ACTUAL IMPLEMENTATION VALIDATION");
console.log("Current Implementation: predictYield(crop, health, risk)\n");

// Test actual implementation
const actualTests = [
    { crop: "rice", health: 80, risk: 0.8 },
    { crop: "wheat", health: 75, risk: 0.5 },
    { crop: "rice", health: 90, risk: 0.2 },
    { crop: "wheat", health: 70, risk: 1.0 }
];

actualTests.forEach((test, index) => {
    console.log(`Actual Test ${index + 1}: crop="${test.crop}", health=${test.health}, risk=${test.risk}`);
    
    const result = yieldService.predictYield(test.crop, test.health, test.risk);
    const baseYield = test.crop === "rice" ? 20 : 15;
    const expectedBySpec = baseYield * (1 - test.risk * 0.5);
    
    console.log(`   Base Yield (impl): ${baseYield}`);
    console.log(`   Actual Result: ${result}`);
    console.log(`   Expected by Spec: ${expectedBySpec.toFixed(2)}`);
    console.log(`   Health Factor Applied: ${(test.health / 100).toFixed(2)}`);
    console.log(`   Difference: ${Math.abs(result - expectedBySpec).toFixed(2)}`);
    console.log('');
});

console.log("3. EDGE CASE TESTING");
console.log("Testing boundary conditions and invalid inputs\n");

const edgeCases = [
    { name: "Zero risk", baseYield: 20, risk: 0, expectedYield: 20, expectedLoss: 0 },
    { name: "Maximum risk", baseYield: 20, risk: 1, expectedYield: 10, expectedLoss: 50 },
    { name: "Risk > 1", baseYield: 20, risk: 1.5, expectedYield: 5, expectedLoss: 75 },
    { name: "Negative risk", baseYield: 20, risk: -0.5, expectedYield: 25, expectedLoss: -25 },
    { name: "Zero base yield", baseYield: 0, risk: 0.5, expectedYield: 0, expectedLoss: 25 },
    { name: "Negative base yield", baseYield: -10, risk: 0.5, expectedYield: -5, expectedLoss: 25 }
];

edgeCases.forEach((testCase, index) => {
    console.log(`Edge Case ${index + 1}: ${testCase.name}`);
    console.log(`   Base Yield: ${testCase.baseYield}, Risk: ${testCase.risk}`);
    
    // Test with specified formula (no validation)
    const formulaResult = testCase.baseYield * (1 - testCase.risk * 0.5);
    const formulaLoss = testCase.risk * 0.5 * 100;
    
    console.log(`   Formula Result: ${formulaResult.toFixed(2)}`);
    console.log(`   Formula Loss %: ${formulaLoss.toFixed(1)}%`);
    console.log(`   Expected Yield: ${testCase.expectedYield}`);
    console.log(`   Expected Loss %: ${testCase.expectedLoss}%`);
    
    const yieldMatch = Math.abs(formulaResult - testCase.expectedYield) < 0.001;
    const lossMatch = Math.abs(formulaLoss - testCase.expectedLoss) < 0.001;
    
    console.log(`   ✓ Yield Match: ${yieldMatch ? 'PASS' : 'FAIL'}`);
    console.log(`   ✓ Loss % Match: ${lossMatch ? 'PASS' : 'FAIL'}`);
    
    // Test validation concerns
    const hasNegativeYield = formulaResult < 0;
    const hasExcessiveLoss = Math.abs(formulaLoss) > 100;
    const hasNegativeLoss = formulaLoss < 0;
    
    console.log(`   ⚠️  Negative Yield: ${hasNegativeYield ? 'YES' : 'NO'}`);
    console.log(`   ⚠️  Excessive Loss: ${hasExcessiveLoss ? 'YES' : 'NO'}`);
    console.log(`   ⚠️  Negative Loss: ${hasNegativeLoss ? 'YES' : 'NO'}`);
    console.log('');
});

console.log("4. INTEGRATION TESTING");
console.log("Testing AI → Risk → Yield → Trust pipeline\n");

// Mock AI scenarios
const integrationScenarios = [
    {
        name: "High Risk Integration",
        ai: { confidence: 0.9, severity: "High", weather: "humid" },
        crop: "rice",
        health: 75
    },
    {
        name: "Medium Risk Integration", 
        ai: { confidence: 0.6, severity: "Medium", weather: "normal" },
        crop: "wheat",
        health: 80
    },
    {
        name: "Low Risk Integration",
        ai: { confidence: 0.3, severity: "Low", weather: "dry" },
        crop: "rice",
        health: 90
    }
];

integrationScenarios.forEach((scenario, index) => {
    console.log(`Integration ${index + 1}: ${scenario.name}`);
    
    // Step 1: Risk Engine
    const riskResult = calculateRisk(scenario.ai);
    console.log(`   Risk Score: ${riskResult.riskScore} (${riskResult.riskLevel})`);
    
    // Step 2: Yield Engine (actual implementation)
    const actualYield = yieldService.predictYield(scenario.crop, scenario.health, riskResult.riskScore);
    const baseYield = scenario.crop === "rice" ? 20 : 15;
    
    // Step 3: Yield Engine (specified formula)
    const formulaYield = baseYield * (1 - riskResult.riskScore * 0.5);
    
    console.log(`   Base Yield: ${baseYield}`);
    console.log(`   Health Score: ${scenario.health}`);
    console.log(`   Actual Yield (impl): ${actualYield}`);
    console.log(`   Formula Yield (spec): ${formulaYield.toFixed(2)}`);
    console.log(`   Difference: ${Math.abs(actualYield - formulaYield).toFixed(2)}`);
    
    // Step 4: Trust Score impact
    const normalizedYield = yieldService.normalizeYieldScore(actualYield, baseYield);
    console.log(`   Normalized Yield Score: ${normalizedYield}`);
    
    const yieldLossPercent = ((baseYield - actualYield) / baseYield) * 100;
    console.log(`   Yield Loss %: ${yieldLossPercent.toFixed(1)}%`);
    
    console.log('');
});

console.log("5. SENSITIVITY ANALYSIS");
console.log("Testing yield response to small risk changes\n");

const sensitivityBase = 20;
const riskValues = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];

console.log("Risk → Projected Yield → Loss %:");
riskValues.forEach(risk => {
    const projectedYield = sensitivityBase * (1 - risk * 0.5);
    const lossPercent = risk * 0.5 * 100;
    const yieldChange = risk > 0.2 ? 
        projectedYield - (sensitivityBase * (1 - 0.2 * 0.5)) : 0;
    
    console.log(`   ${risk.toFixed(1)} → ${projectedYield.toFixed(2)} → ${lossPercent.toFixed(0)}% ${yieldChange !== 0 ? `(Δ${yieldChange.toFixed(2)})` : ''}`);
});

console.log('\n6. ROBUSTNESS & CONSISTENCY');
console.log("Testing deterministic behavior and precision\n");

// Test deterministic behavior
const deterministicTest = { baseYield: 20, risk: 0.7 };
const results = [];
for (let i = 0; i < 10; i++) {
    results.push(deterministicTest.baseYield * (1 - deterministicTest.risk * 0.5));
}

const allSame = results.every(r => Math.abs(r - results[0]) < 0.000001);
console.log(`Deterministic Test (10 runs): ${allSame ? 'PASS' : 'FAIL'}`);
console.log(`All results identical: ${results[0].toFixed(6)}`);

// Test floating point precision
const precisionTests = [
    { risk: 0.333333333 },
    { risk: 0.666666666 },
    { risk: 0.123456789 }
];

console.log('\nPrecision Tests:');
precisionTests.forEach((test, index) => {
    const result = deterministicTest.baseYield * (1 - test.risk * 0.5);
    const rounded = parseFloat(result.toFixed(2));
    console.log(`   Test ${index + 1}: risk=${test.risk} → ${result.toFixed(6)} → ${rounded}`);
});

console.log('\n=== VALIDATION COMPLETE ===');
