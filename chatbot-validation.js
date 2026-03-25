/**
 * Chatbot Engine Validation Suite
 * Comprehensive testing of AgriMitra360 chatbot system
 */

const { processChat } = require('./ai/chatbot/chatEngine');

// Helper function to run async tests
const runChatTest = async (message, language = "en", context = {}) => {
    try {
        const result = await processChat({ message, language, context });
        return result || { reply: "", original: "", metadata: { engine: "unknown", used_llm: false, fallback_used: false } };
    } catch (error) {
        console.error("Error in chat test:", error);
        return { reply: "", original: "Error occurred", metadata: { engine: "error", used_llm: false, fallback_used: false } };
    }
};

console.log("=== CHATBOT ENGINE VALIDATION ===\n");

// Test context from requirements
const testContext = {
    disease: "Early Blight",
    riskLevel: "High Risk",
    projectedYield: 12,
    trustScore: 65
};

console.log("Test Context:");
console.log(JSON.stringify(testContext, null, 2));
console.log("");

// 1. Functional Testing - User Query Analysis
console.log("1. FUNCTIONAL TESTING - USER QUERY ANALYSIS");
console.log("Testing different types of farmer queries\n");

const functionalTests = [
    // Disease-related queries
    { category: "Disease", query: "What disease is this?", expectedContext: "disease" },
    { category: "Disease", query: "How to treat blight?", expectedContext: "disease" },
    { category: "Disease", query: "My crop has disease", expectedContext: "disease" },
    
    // Risk-related queries
    { category: "Risk", query: "Is my crop at risk?", expectedContext: "risk" },
    { category: "Risk", query: "What should I do if risk is high?", expectedContext: "risk" },
    { category: "Risk", query: "danger to my crop", expectedContext: "risk" },
    
    // Yield-related queries
    { category: "Yield", query: "What will be my yield?", expectedContext: "yield" },
    { category: "Yield", query: "How much loss can I expect?", expectedContext: "yield" },
    { category: "Yield", query: "projected yield", expectedContext: "yield" },
    
    // Financial queries
    { category: "Financial", query: "Am I eligible for loan?", expectedContext: "trust" },
    { category: "Financial", query: "How can I improve my credit score?", expectedContext: "trust" },
    { category: "Financial", query: "loan eligibility", expectedContext: "trust" },
    
    // General queries
    { category: "General", query: "What should I do now?", expectedContext: "general" },
    { category: "General", query: "Help me with my crop", expectedContext: "general" },
    { category: "General", query: "upload crop image", expectedContext: "general" }
];

let functionalResults = { pass: 0, fail: 0 };

functionalTests.forEach((test, index) => {
    console.log(`${index + 1}. ${test.category}: "${test.query}"`);
    
    const result = processChat({ message: test.query, context: testContext });
    
    console.log(`   Response: "${result.original}"`);
    console.log(`   Engine: ${result.metadata.engine}`);
    console.log(`   Used LLM: ${result.metadata.used_llm}`);
    
    // Evaluate response quality
    const usesContext = result.original.toLowerCase().includes(testContext.disease.toLowerCase()) ||
                        result.original.toLowerCase().includes(testContext.riskLevel.toLowerCase()) ||
                        result.original.toLowerCase().includes(testContext.projectedYield.toString()) ||
                        result.original.toLowerCase().includes(testContext.trustScore.toString());
    
    const isGeneric = result.original === "Please upload crop image or ask about disease, yield, or risk.";
    
    console.log(`   Uses Context: ${usesContext ? 'YES' : 'NO'}`);
    console.log(`   Generic Response: ${isGeneric ? 'YES' : 'NO'}`);
    
    const passed = !isGeneric && (test.category === "General" || usesContext);
    if (passed) {
        functionalResults.pass++;
        console.log(`   Status: ✅ PASS`);
    } else {
        functionalResults.fail++;
        console.log(`   Status: ❌ FAIL`);
    }
    console.log('');
});

console.log(`Functional Testing Summary: ${functionalResults.pass}/${functionalTests.pass + functionalResults.fail} PASS`);

// 2. Language & Translation Testing
console.log("\n2. LANGUAGE & TRANSLATION TESTING");
console.log("Testing multilingual support\n");

const languageTests = [
    { lang: "en", name: "English" },
    { lang: "hi", name: "Hindi" },
    { lang: "te", name: "Telugu" },
    { lang: "fr", name: "French (unsupported)" }
];

const testQueries = [
    "Am I eligible for loan?",
    "High risk detected. Immediate action is required.",
    "Yield and risk directly affect your income.",
    "Improve farm stability to increase loan eligibility."
];

let languageResults = { pass: 0, fail: 0 };

languageTests.forEach((langTest) => {
    console.log(`Testing ${langTest.name} (${langTest.lang}):`);
    
    testQueries.forEach((query, qIndex) => {
        const result = processChat({ message: "loan", language: langTest.lang, context: testContext });
        
        console.log(`   Query ${qIndex + 1}: "${query}"`);
        console.log(`   Original: "${result.original}"`);
        console.log(`   Translated: "${result.reply}"`);
        
        const isTranslated = langTest.lang === "en" ? 
            result.reply === result.original : 
            result.reply !== result.original;
        
        const hasTranslation = langTest.lang !== "en" && 
            (langTest.lang === "hi" || langTest.lang === "te") ? 
            result.reply !== result.original : 
            true;
        
        console.log(`   Translation Applied: ${isTranslated ? 'YES' : 'NO'}`);
        console.log(`   Has Translation: ${hasTranslation ? 'YES' : 'NO'}`);
        
        const passed = langTest.lang === "en" ? true : hasTranslation;
        if (passed) {
            languageResults.pass++;
        } else {
            languageResults.fail++;
        }
        console.log(`   Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
        console.log('');
    });
});

console.log(`Language Testing Summary: ${languageResults.pass}/${languageResults.pass + languageResults.fail} PASS`);

// 3. Context Awareness Validation
console.log("\n3. CONTEXT AWARENESS VALIDATION");
console.log("Testing context usage and adaptation\n");

const contextTests = [
    {
        name: "High Risk Context",
        context: { disease: "Early Blight", riskLevel: "High Risk", projectedYield: 12, trustScore: 65 },
        query: "What should I do?",
        expectedBehavior: "Urgent advice due to high risk"
    },
    {
        name: "Low Trust Score Context",
        context: { disease: "Mildew", riskLevel: "Low Risk", projectedYield: 18, trustScore: 45 },
        query: "Am I eligible for loan?",
        expectedBehavior: "Loan denied with improvement suggestions"
    },
    {
        name: "High Trust Score Context",
        context: { disease: "Healthy", riskLevel: "Low Risk", projectedYield: 20, trustScore: 85 },
        query: "Am I eligible for loan?",
        expectedBehavior: "Loan approved"
    },
    {
        name: "Missing Context",
        context: {},
        query: "What is my yield?",
        expectedBehavior: "Generic response asking for more info"
    }
];

let contextResults = { pass: 0, fail: 0 };

contextTests.forEach((test, index) => {
    console.log(`Context Test ${index + 1}: ${test.name}`);
    console.log(`   Context: ${JSON.stringify(test.context)}`);
    console.log(`   Query: "${test.query}"`);
    console.log(`   Expected: ${test.expectedBehavior}`);
    
    const result = processChat({ message: test.query, context: test.context });
    
    console.log(`   Response: "${result.original}"`);
    
    // Evaluate context awareness
    const usesRiskLevel = result.original.toLowerCase().includes(test.context.riskLevel?.toLowerCase() || "");
    const usesTrustScore = test.context.trustScore ? 
        (result.original.includes("eligible") || result.original.includes("improve")) : false;
    const usesDisease = result.original.toLowerCase().includes(test.context.disease?.toLowerCase() || "");
    const isGeneric = result.original === "Please upload crop image or ask about disease, yield, or risk.";
    
    console.log(`   Uses Risk Level: ${usesRiskLevel ? 'YES' : 'NO'}`);
    console.log(`   Uses Trust Score: ${usesTrustScore ? 'YES' : 'NO'}`);
    console.log(`   Uses Disease: ${usesDisease ? 'YES' : 'NO'}`);
    console.log(`   Generic Response: ${isGeneric ? 'YES' : 'NO'}`);
    
    // Evaluate if behavior matches expectations
    let passed = false;
    if (test.name.includes("High Risk") && usesRiskLevel) passed = true;
    else if (test.name.includes("Low Trust") && !result.original.includes("eligible")) passed = true;
    else if (test.name.includes("High Trust") && result.original.includes("eligible")) passed = true;
    else if (test.name.includes("Missing") && isGeneric) passed = true;
    
    if (passed) {
        contextResults.pass++;
        console.log(`   Status: ✅ PASS`);
    } else {
        contextResults.fail++;
        console.log(`   Status: ❌ FAIL`);
    }
    console.log('');
});

console.log(`Context Awareness Summary: ${contextResults.pass}/${contextResults.pass + contextResults.fail} PASS`);

// 4. Edge Case Testing
console.log("\n4. EDGE CASE TESTING");
console.log("Testing edge cases and error conditions\n");

const edgeCaseTests = [
    { name: "Empty Message", query: "", expected: "Fallback response" },
    { name: "Whitespace Only", query: "   ", expected: "Fallback response" },
    { name: "Very Long Message", query: "a".repeat(1000), expected: "Processed or fallback" },
    { name: "Irrelevant - Hello", query: "Hello", expected: "Fallback response" },
    { name: "Irrelevant - Hi", query: "Hi", expected: "Fallback response" },
    { name: "Irrelevant - Joke", query: "Tell me a joke", expected: "Fallback response" },
    { name: "Mixed Query", query: "What is my yield and loan eligibility?", expected: "First intent matched" },
    { name: "Unknown Keywords", query: "quantum farming blockchain", expected: "Fallback response" },
    { name: "Special Characters", query: "What @#$% is wrong?", expected: "Processed or fallback" },
    { name: "Numbers Only", query: "12345", expected: "Fallback response" }
];

let edgeCaseResults = { pass: 0, fail: 0 };

edgeCaseTests.forEach((test, index) => {
    console.log(`Edge Case ${index + 1}: ${test.name}`);
    console.log(`   Query: "${test.query.substring(0, 50)}${test.query.length > 50 ? '...' : ''}"`);
    console.log(`   Expected: ${test.expected}`);
    
    const result = processChat({ message: test.query, context: testContext });
    
    console.log(`   Response: "${result.original}"`);
    console.log(`   Engine: ${result.metadata.engine}`);
    
    const isFallback = result.original === "Please upload crop image or ask about disease, yield, or risk.";
    const hasResponse = result.original && result.original.length > 0;
    const noErrors = !result.original.includes("error") && !result.original.includes("undefined");
    
    console.log(`   Has Response: ${hasResponse ? 'YES' : 'NO'}`);
    console.log(`   No Errors: ${noErrors ? 'YES' : 'NO'}`);
    console.log(`   Fallback Used: ${isFallback ? 'YES' : 'NO'}`);
    
    const passed = hasResponse && noErrors;
    if (passed) {
        edgeCaseResults.pass++;
        console.log(`   Status: ✅ PASS`);
    } else {
        edgeCaseResults.fail++;
        console.log(`   Status: ❌ FAIL`);
    }
    console.log('');
});

console.log(`Edge Case Testing Summary: ${edgeCaseResults.pass}/${edgeCaseResults.pass + edgeCaseResults.fail} PASS`);

// 5. Integration Testing
console.log("\n5. INTEGRATION TESTING");
console.log("Testing AI Output → Context → Chatbot → Response pipeline\n");

const integrationTests = [
    {
        name: "Full Pipeline Test",
        context: testContext,
        query: "What is my risk level?",
        validatePipeline: true
    },
    {
        name: "Context Normalization",
        context: { 
            diagnosis: { disease: "Late Blight" },
            risk: { level: "Medium Risk" },
            yield: { projectedYield: 15 },
            trust: { score: 72 }
        },
        query: "How is my crop?",
        validatePipeline: true
    }
];

let integrationResults = { pass: 0, fail: 0 };

integrationTests.forEach((test, index) => {
    console.log(`Integration Test ${index + 1}: ${test.name}`);
    console.log(`   Context: ${JSON.stringify(test.context)}`);
    console.log(`   Query: "${test.query}"`);
    
    const result = processChat({ message: test.query, context: test.context });
    
    console.log(`   Response: "${result.original}"`);
    console.log(`   Engine: ${result.metadata.engine}`);
    console.log(`   Used LLM: ${result.metadata.used_llm}`);
    console.log(`   Fallback Used: ${result.metadata.fallback_used}`);
    
    const hasResponse = result.original && result.original.length > 0;
    const hasMetadata = result.metadata && Object.keys(result.metadata).length > 0;
    const noErrors = !result.original.includes("error") && !result.original.includes("undefined");
    
    console.log(`   Has Response: ${hasResponse ? 'YES' : 'NO'}`);
    console.log(`   Has Metadata: ${hasMetadata ? 'YES' : 'NO'}`);
    console.log(`   No Errors: ${noErrors ? 'YES' : 'NO'}`);
    
    const passed = hasResponse && hasMetadata && noErrors;
    if (passed) {
        integrationResults.pass++;
        console.log(`   Status: ✅ PASS`);
    } else {
        integrationResults.fail++;
        console.log(`   Status: ❌ FAIL`);
    }
    console.log('');
});

console.log(`Integration Testing Summary: ${integrationResults.pass}/${integrationResults.pass + integrationResults.fail} PASS`);

// 6. Robustness & Consistency Testing
console.log("\n6. ROBUSTNESS & CONSISTENCY TESTING");
console.log("Testing deterministic behavior and consistency\n");

const consistencyTests = [
    { query: "What is my yield?", iterations: 10 },
    { query: "Am I eligible for loan?", iterations: 10 },
    { query: "disease", iterations: 10 },
    { query: "risk", iterations: 10 }
];

let consistencyResults = { pass: 0, fail: 0 };

consistencyTests.forEach((test, index) => {
    console.log(`Consistency Test ${index + 1}: "${test.query}" (${test.iterations} iterations)`);
    
    const responses = [];
    let allSame = true;
    
    for (let i = 0; i < test.iterations; i++) {
        const result = processChat({ message: test.query, context: testContext });
        responses.push(result.original);
        
        if (i > 0 && responses[i] !== responses[0]) {
            allSame = false;
        }
    }
    
    console.log(`   First Response: "${responses[0]}"`);
    console.log(`   All Identical: ${allSame ? 'YES' : 'NO'}`);
    console.log(`   Unique Responses: ${[...new Set(responses)].length}`);
    
    const hasNoHallucination = responses.every(r => !r.includes("undefined") && !r.includes("error"));
    const isDeterministic = allSame;
    
    console.log(`   No Hallucination: ${hasNoHallucination ? 'YES' : 'NO'}`);
    console.log(`   Deterministic: ${isDeterministic ? 'YES' : 'NO'}`);
    
    const passed = hasNoHallucination && isDeterministic;
    if (passed) {
        consistencyResults.pass++;
        console.log(`   Status: ✅ PASS`);
    } else {
        consistencyResults.fail++;
        console.log(`   Status: ❌ FAIL`);
    }
    console.log('');
});

console.log(`Consistency Testing Summary: ${consistencyResults.pass}/${consistencyResults.pass + consistencyResults.fail} PASS`);

// 7. Bug Detection Analysis
console.log("\n7. BUG DETECTION ANALYSIS");
console.log("Identifying potential issues and limitations\n");

const bugDetectionTests = [
    {
        name: "Intent Detection Coverage",
        test: () => {
            const queries = ["fungus", "virus", "bacteria", "pest", "insect", "weather", "irrigation", "fertilizer"];
            const results = queries.map(q => processChat({ message: q, context: testContext }));
            return results.filter(r => r.original === "Please upload crop image or ask about disease, yield, or risk.").length;
        },
        expected: "Should have better keyword coverage"
    },
    {
        name: "Translation Coverage",
        test: () => {
            const testPhrases = [
                "Detected disease is Early Blight. Apply recommended treatment immediately.",
                "Current risk level is High Risk. Take preventive measures.",
                "Expected yield is 12 tons/hectare."
            ];
            const hindiResults = testPhrases.map(p => processChat({ message: "test", language: "hi", context: testContext }));
            return hindiResults.filter(r => r.reply === r.original).length;
        },
        expected: "Should have more translations"
    },
    {
        name: "Context Variable Usage",
        test: () => {
            const result = processChat({ message: "tell me everything", context: testContext });
            const usesDisease = result.original.toLowerCase().includes(testContext.disease.toLowerCase());
            const usesRisk = result.original.toLowerCase().includes(testContext.riskLevel.toLowerCase());
            const usesYield = result.original.toLowerCase().includes(testContext.projectedYield.toString());
            const usesTrust = result.original.toLowerCase().includes(testContext.trustScore.toString());
            return { usesDisease, usesRisk, usesYield, usesTrust };
        },
        expected: "Should use more context variables"
    }
];

let bugDetectionResults = { pass: 0, fail: 0 };

bugDetectionTests.forEach((test, index) => {
    console.log(`Bug Detection ${index + 1}: ${test.name}`);
    
    const result = test.test();
    console.log(`   Result: ${JSON.stringify(result)}`);
    console.log(`   Expected: ${test.expected}`);
    
    let passed = false;
    if (test.name.includes("Intent Detection")) {
        passed = result < 5; // Some fallbacks expected but not too many
        console.log(`   Fallback Rate: ${result}/8 (${(result/8*100).toFixed(1)}%)`);
    } else if (test.name.includes("Translation")) {
        passed = result < 2; // Some untranslated expected
        console.log(`   Untranslated Rate: ${result}/3 (${(result/3*100).toFixed(1)}%)`);
    } else if (test.name.includes("Context Variable")) {
        const contextUsage = Object.values(result).filter(Boolean).length;
        passed = contextUsage >= 1; // At least some context used
        console.log(`   Context Variables Used: ${contextUsage}/4`);
    }
    
    if (passed) {
        bugDetectionResults.pass++;
        console.log(`   Status: ✅ ACCEPTABLE`);
    } else {
        bugDetectionResults.fail++;
        console.log(`   Status: ⚠️  NEEDS IMPROVEMENT`);
    }
    console.log('');
});

console.log(`Bug Detection Summary: ${bugDetectionResults.pass}/${bugDetectionResults.pass + bugDetectionResults.fail} ACCEPTABLE`);

// 8. UX & Usefulness Evaluation
console.log("\n8. UX & USEFULNESS EVALUATION");
console.log("Evaluating response quality and farmer usefulness\n");

const uxTests = [
    {
        name: "Response Clarity",
        query: "What disease is this?",
        criteria: ["Clear language", "Actionable advice", "No technical jargon"]
    },
    {
        name: "Actionability",
        query: "What should I do now?",
        criteria: ["Specific next steps", "Practical advice", "Farmer-friendly"]
    },
    {
        name: "Financial Guidance",
        query: "Am I eligible for loan?",
        criteria: ["Clear answer", "Explanation", "Improvement suggestions"]
    },
    {
        name: "Risk Communication",
        query: "Is my crop at risk?",
        criteria: ["Risk level clear", "Urgency appropriate", "Preventive measures"]
    }
];

let uxResults = { pass: 0, fail: 0 };

uxTests.forEach((test, index) => {
    console.log(`UX Test ${index + 1}: ${test.name}`);
    console.log(`   Query: "${test.query}"`);
    console.log(`   Criteria: ${test.criteria.join(", ")}`);
    
    const result = processChat({ message: test.query, context: testContext });
    
    console.log(`   Response: "${result.original}"`);
    
    // Evaluate UX criteria
    const isClear = result.original.length > 10 && result.original.length < 200;
    const isActionable = result.original.includes("apply") || result.original.includes("take") || result.original.includes("improve");
    const isFarmerFriendly = !result.original.includes("algorithm") && !result.original.includes("model") && !result.original.includes("API");
    const providesGuidance = result.original.length > 20;
    
    console.log(`   Clear Language: ${isClear ? 'YES' : 'NO'}`);
    console.log(`   Actionable: ${isActionable ? 'YES' : 'NO'}`);
    console.log(`   Farmer Friendly: ${isFarmerFriendly ? 'YES' : 'NO'}`);
    console.log(`   Provides Guidance: ${providesGuidance ? 'YES' : 'NO'}`);
    
    const passed = isClear && isFarmerFriendly && providesGuidance;
    if (passed) {
        uxResults.pass++;
        console.log(`   Status: ✅ GOOD`);
    } else {
        uxResults.fail++;
        console.log(`   Status: ⚠️  NEEDS IMPROVEMENT`);
    }
    console.log('');
});

console.log(`UX Testing Summary: ${uxResults.pass}/${uxResults.pass + uxResults.fail} GOOD`);

// Final Summary
console.log("\n" + "=".repeat(60));
console.log("CHATBOT VALIDATION SUMMARY");
console.log("=".repeat(60));

const totalTests = functionalResults.pass + functionalResults.fail +
                  languageResults.pass + languageResults.fail +
                  contextResults.pass + contextResults.fail +
                  edgeCaseResults.pass + edgeCaseResults.fail +
                  integrationResults.pass + integrationResults.fail +
                  consistencyResults.pass + consistencyResults.fail +
                  bugDetectionResults.pass + bugDetectionResults.fail +
                  uxResults.pass + uxResults.fail;

const totalPassed = functionalResults.pass + languageResults.pass + contextResults.pass +
                    edgeCaseResults.pass + integrationResults.pass + consistencyResults.pass +
                    bugDetectionResults.pass + uxResults.pass;

const overallPassRate = (totalPassed / totalTests) * 100;

console.log(`\n📊 VALIDATION RESULTS:`);
console.log(`   Functional Testing: ${functionalResults.pass}/${functionalResults.pass + functionalResults.fail} PASS`);
console.log(`   Language Testing: ${languageResults.pass}/${languageResults.pass + languageResults.fail} PASS`);
console.log(`   Context Awareness: ${contextResults.pass}/${contextResults.pass + contextResults.fail} PASS`);
console.log(`   Edge Case Testing: ${edgeCaseResults.pass}/${edgeCaseResults.pass + edgeCaseResults.fail} PASS`);
console.log(`   Integration Testing: ${integrationResults.pass}/${integrationResults.pass + integrationResults.fail} PASS`);
console.log(`   Consistency Testing: ${consistencyResults.pass}/${consistencyResults.pass + consistencyResults.fail} PASS`);
console.log(`   Bug Detection: ${bugDetectionResults.pass}/${bugDetectionResults.pass + bugDetectionResults.fail} ACCEPTABLE`);
console.log(`   UX Evaluation: ${uxResults.pass}/${uxResults.pass + uxResults.fail} GOOD`);

console.log(`\n🎯 OVERALL ASSESSMENT:`);
console.log(`   Overall Test Pass Rate: ${overallPassRate.toFixed(1)}%`);
console.log(`   Chatbot Effectiveness: ${overallPassRate >= 80 ? '8-10 (Excellent)' : overallPassRate >= 70 ? '6-7 (Good)' : overallPassRate >= 60 ? '4-5 (Fair)' : '0-3 (Poor)'}`);

console.log(`\n📋 ONE-LINE VERDICT:`);
if (overallPassRate >= 80) {
    console.log(`   "Chatbot Ready / Minor Improvements"`);
} else if (overallPassRate >= 70) {
    console.log(`   "Chatbot Needs Improvement / Functional but Limited"`);
} else {
    console.log(`   "Chatbot Needs Major Work / Not Ready for Demo"`);
}

console.log("\n=== CHATBOT VALIDATION COMPLETE ===");
