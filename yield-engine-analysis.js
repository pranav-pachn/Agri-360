/**
 * Yield Engine Analysis - Implementation vs Specification
 * Detailed comparison and correction implementation
 */

const yieldService = require('./server/src/services/yield.service');

console.log("=== YIELD ENGINE ANALYSIS ===\n");

console.log("🚨 CRITICAL DISCREPANCY DETECTED\n");

console.log("SPECIFIED FORMULA:");
console.log("Projected Yield = Base Yield × (1 - Risk Score × 0.5)\n");

console.log("ACTUAL IMPLEMENTATION:");
console.log("predictYield(crop, health, risk) {");
console.log("  const baseYield = crop === 'rice' ? 20 : 15;");
console.log("  return baseYield * (health / 100) * (1 - risk);");
console.log("}\n");

console.log("KEY DIFFERENCES:");
console.log("1. Health Factor: Implementation includes (health / 100)");
console.log("2. Risk Multiplier: Implementation uses (1 - risk) vs (1 - risk × 0.5)");
console.log("3. Base Yield: Fixed values (rice: 20, wheat: 15) vs parameterized\n");

// Test the difference with same inputs
console.log("COMPARISON TEST:");
const testCases = [
    { baseYield: 20, health: 80, risk: 0.5 },
    { baseYield: 20, health: 80, risk: 0.8 },
    { baseYield: 15, health: 75, risk: 0.3 }
];

testCases.forEach((test, index) => {
    console.log(`\nTest ${index + 1}: Base=${test.baseYield}, Health=${test.health}, Risk=${test.risk}`);
    
    // Specified formula
    const specResult = test.baseYield * (1 - test.risk * 0.5);
    const specLoss = test.risk * 0.5 * 100;
    
    // Actual implementation (approximating with crop="rice")
    const actualResult = yieldService.predictYield("rice", test.health, test.risk);
    const actualLoss = ((test.baseYield - actualResult) / test.baseYield) * 100;
    
    console.log(`  Specified: ${specResult.toFixed(2)} (loss: ${specLoss.toFixed(1)}%)`);
    console.log(`  Actual:    ${actualResult.toFixed(2)} (loss: ${actualLoss.toFixed(1)}%)`);
    console.log(`  Difference: ${Math.abs(specResult - actualResult).toFixed(2)} (${Math.abs(specLoss - actualLoss).toFixed(1)}%)`);
});

console.log("\n=== IMPLEMENTING CORRECT YIELD ENGINE ===");

// Create the correct yield engine implementation
const createCorrectYieldEngine = () => {
    const calculateProjectedYield = (baseYield, riskScore) => {
        // Input validation
        const cleanBaseYield = Math.max(Number(baseYield) || 0, 0);
        const cleanRisk = Math.min(Math.max(Number(riskScore) || 0, 0), 1);
        
        // Apply formula: Projected Yield = Base Yield × (1 - Risk Score × 0.5)
        const projectedYield = cleanBaseYield * (1 - cleanRisk * 0.5);
        
        // Calculate loss percentage
        const yieldLossPercent = cleanRisk * 0.5 * 100;
        
        return {
            baseYield: cleanBaseYield,
            projectedYield: parseFloat(projectedYield.toFixed(2)),
            yieldLossPercent: parseFloat(yieldLossPercent.toFixed(1)),
            riskScore: cleanRisk
        };
    };
    
    const calculateYieldWithHealth = (baseYield, healthScore, riskScore) => {
        // Enhanced version that includes health factor if needed
        const cleanBaseYield = Math.max(Number(baseYield) || 0, 0);
        const cleanHealth = Math.min(Math.max(Number(healthScore) || 100, 0), 100);
        const cleanRisk = Math.min(Math.max(Number(riskScore) || 0, 0), 1);
        
        // Option 1: Apply health factor to base yield first
        const healthAdjustedBase = cleanBaseYield * (cleanHealth / 100);
        const projectedYield = healthAdjustedBase * (1 - cleanRisk * 0.5);
        
        // Option 2: Apply risk factor first, then health (commented out)
        // const riskAdjustedYield = cleanBaseYield * (1 - cleanRisk * 0.5);
        // const projectedYield = riskAdjustedYield * (cleanHealth / 100);
        
        const yieldLossPercent = cleanRisk * 0.5 * 100;
        
        return {
            baseYield: cleanBaseYield,
            healthAdjustedBase: parseFloat(healthAdjustedBase.toFixed(2)),
            projectedYield: parseFloat(projectedYield.toFixed(2)),
            yieldLossPercent: parseFloat(yieldLossPercent.toFixed(1)),
            healthScore: cleanHealth,
            riskScore: cleanRisk
        };
    };
    
    return {
        calculateProjectedYield,
        calculateYieldWithHealth
    };
};

const correctYieldEngine = createCorrectYieldEngine();

console.log("\nTesting Correct Implementation:");

// Test the correct implementation
const correctTests = [
    { baseYield: 20, risk: 0.8 },
    { baseYield: 15, risk: 0.5 },
    { baseYield: 25, risk: 0.2 },
    { baseYield: 18, risk: 1.0 }
];

correctTests.forEach((test, index) => {
    const result = correctYieldEngine.calculateProjectedYield(test.baseYield, test.risk);
    console.log(`\nCorrect Test ${index + 1}:`);
    console.log(`  Input: Base=${test.baseYield}, Risk=${test.risk}`);
    console.log(`  Output: Projected=${result.projectedYield}, Loss=${result.yieldLossPercent}%`);
    console.log(`  Validation: ${result.projectedYield >= 0 && result.projectedYield <= test.baseYield ? '✅ PASS' : '❌ FAIL'}`);
});

console.log("\nTesting with Health Factor:");

const healthTests = [
    { baseYield: 20, health: 80, risk: 0.5 },
    { baseYield: 20, health: 90, risk: 0.8 },
    { baseYield: 15, health: 75, risk: 0.3 }
];

healthTests.forEach((test, index) => {
    const result = correctYieldEngine.calculateYieldWithHealth(test.baseYield, test.health, test.risk);
    console.log(`\nHealth Test ${index + 1}:`);
    console.log(`  Input: Base=${test.baseYield}, Health=${test.health}, Risk=${test.risk}`);
    console.log(`  Health Adjusted Base: ${result.healthAdjustedBase}`);
    console.log(`  Final Projected: ${result.projectedYield}`);
    console.log(`  Loss %: ${result.yieldLossPercent}%`);
});

module.exports = correctYieldEngine;
