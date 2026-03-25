/**
 * Final Chatbot Validation Suite - Production Level
 * Comprehensive testing of updated AgriMitra360 chatbot system
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

async function runFinalValidation() {
    console.log("=== FINAL CHATBOT VALIDATION - PRODUCTION LEVEL ===\n");

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

    // 1. Real Farmer Query Simulation
    console.log("1. REAL FARMER QUERY SIMULATION");
    console.log("Testing authentic farmer-style queries\n");

    const farmerQueries = [
        {
            query: "What happened to my crop?",
            expectedIntent: "disease/risk",
            description: "General crop concern"
        },
        {
            query: "Why are leaves turning yellow?",
            expectedIntent: "disease",
            description: "Symptom description"
        },
        {
            query: "Is my crop safe?",
            expectedIntent: "risk",
            description: "Safety concern"
        },
        {
            query: "How much yield will I get?",
            expectedIntent: "yield",
            description: "Yield expectation"
        },
        {
            query: "Can I get loan?",
            expectedIntent: "loan",
            description: "Financial inquiry"
        },
        {
            query: "What should I do now?",
            expectedIntent: "help",
            description: "Action guidance"
        }
    ];

    let farmerResults = { pass: 0, fail: 0 };

    for (let i = 0; i < farmerQueries.length; i++) {
        const test = farmerQueries[i];
        console.log(`${i + 1}. "${test.query}" (${test.description})`);
        console.log(`   Expected Intent: ${test.expectedIntent}`);
        
        const result = await runChatTest(test.query, "en", testContext);
        
        console.log(`   Response: "${result.original}"`);
        console.log(`   Uses Context: ${result.original.toLowerCase().includes(testContext.disease.toLowerCase()) || result.original.toLowerCase().includes(testContext.riskLevel.toLowerCase()) || result.original.includes(testContext.projectedYield.toString()) ? 'YES' : 'NO'}`);
        console.log(`   Actionable: ${result.original.toLowerCase().includes('apply') || result.original.toLowerCase().includes('spray') || result.original.toLowerCase().includes('monitor') || result.original.toLowerCase().includes('immediate') ? 'YES' : 'NO'}`);
        console.log(`   Farmer-Friendly: ${result.original.split(' ').length <= 15 && !result.original.includes('algorithm') ? 'YES' : 'NO'}`);
        
        const isHelpful = result.original !== "Please upload crop image or ask about disease, yield, risk, or loan eligibility.";
        const passed = isHelpful && result.original.length > 10;
        
        if (passed) {
            farmerResults.pass++;
            console.log(`   Status: ✅ PASS`);
        } else {
            farmerResults.fail++;
            console.log(`   Status: ❌ FAIL`);
        }
        console.log('');
    }

    console.log(`Farmer Query Simulation: ${farmerResults.pass}/${farmerResults.pass + farmerResults.fail} PASS`);

    // 2. Context Awareness Testing
    console.log("\n2. CONTEXT AWARENESS TESTING");
    console.log("Testing dynamic response adaptation\n");

    const contextScenarios = [
        {
            name: "Case A: High Risk",
            context: { disease: "Early Blight", riskLevel: "High Risk", projectedYield: 12, trustScore: 65 },
            query: "What should I do?",
            expectedBehavior: "Urgent action required"
        },
        {
            name: "Case B: Low Risk",
            context: { disease: "Healthy", riskLevel: "Low Risk", projectedYield: 20, trustScore: 85 },
            query: "What should I do?",
            expectedBehavior: "General guidance"
        },
        {
            name: "Case C: No Disease",
            context: { disease: null, riskLevel: "Medium Risk", projectedYield: 15, trustScore: 70 },
            query: "How is my crop?",
            expectedBehavior: "Risk-focused response"
        },
        {
            name: "Case D: Low Trust Score",
            context: { disease: "Mildew", riskLevel: "Low Risk", projectedYield: 18, trustScore: 45 },
            query: "Can I get loan?",
            expectedBehavior: "Loan denied with improvement advice"
        }
    ];

    let contextResults = { pass: 0, fail: 0 };

    for (let i = 0; i < contextScenarios.length; i++) {
        const scenario = contextScenarios[i];
        console.log(`Context Test ${i + 1}: ${scenario.name}`);
        console.log(`   Context: ${JSON.stringify(scenario.context)}`);
        console.log(`   Query: "${scenario.query}"`);
        console.log(`   Expected: ${scenario.expectedBehavior}`);
        
        const result = await runChatTest(scenario.query, "en", scenario.context);
        
        console.log(`   Response: "${result.original}"`);
        
        // Evaluate context adaptation
        const hasUrgency = result.original.toLowerCase().includes("immediate") || result.original.toLowerCase().includes("urgent") || result.original.toLowerCase().includes("⚠️");
        const usesRisk = result.original.toLowerCase().includes(scenario.context.riskLevel?.toLowerCase() || "");
        const usesDisease = result.original.toLowerCase().includes(scenario.context.disease?.toLowerCase() || "");
        const usesTrust = result.original.toLowerCase().includes("eligible") || result.original.toLowerCase().includes("improve");
        
        console.log(`   Has Urgency: ${hasUrgency ? 'YES' : 'NO'}`);
        console.log(`   Uses Risk: ${usesRisk ? 'YES' : 'NO'}`);
        console.log(`   Uses Disease: ${usesDisease ? 'YES' : 'NO'}`);
        console.log(`   Uses Trust: ${usesTrust ? 'YES' : 'NO'}`);
        
        let passed = false;
        if (scenario.name.includes("High Risk") && hasUrgency) passed = true;
        else if (scenario.name.includes("Low Risk") && !hasUrgency) passed = true;
        else if (scenario.name.includes("No Disease") && usesRisk) passed = true;
        else if (scenario.name.includes("Low Trust") && usesTrust) passed = true;
        
        if (passed) {
            contextResults.pass++;
            console.log(`   Status: ✅ PASS`);
        } else {
            contextResults.fail++;
            console.log(`   Status: ❌ FAIL`);
        }
        console.log('');
    }

    console.log(`Context Awareness Testing: ${contextResults.pass}/${contextResults.pass + contextResults.fail} PASS`);

    // 3. Multilingual Validation
    console.log("\n3. MULTILINGUAL VALIDATION");
    console.log("Testing translation accuracy and coverage\n");

    const multilingualTests = [
        {
            query: "What disease is this?",
            context: { disease: "Early Blight", riskLevel: "High Risk", projectedYield: 12, trustScore: 65 },
            testTranslation: true
        },
        {
            query: "High risk detected. Immediate action required.",
            context: { disease: "Early Blight", riskLevel: "High Risk", projectedYield: 12, trustScore: 65 },
            testTranslation: true
        },
        {
            query: "Am I eligible for loan?",
            context: { disease: "Healthy", riskLevel: "Low Risk", projectedYield: 20, trustScore: 85 },
            testTranslation: true
        },
        {
            query: "What should I do now?",
            context: { disease: "Early Blight", riskLevel: "High Risk", projectedYield: 12, trustScore: 65 },
            testTranslation: true
        }
    ];

    const languages = [
        { code: "en", name: "English" },
        { code: "hi", name: "Hindi" },
        { code: "te", name: "Telugu" },
        { code: "fr", name: "French (unsupported)" }
    ];

    let multilingualResults = { pass: 0, fail: 0 };

    for (const lang of languages) {
        console.log(`Testing ${lang.name} (${lang.code}):`);
        
        for (let i = 0; i < multilingualTests.length; i++) {
            const test = multilingualTests[i];
            const result = await runChatTest(test.query, lang.code, test.context);
            
            console.log(`   Query ${i + 1}: "${test.query}"`);
            console.log(`   Original: "${result.original}"`);
            console.log(`   Translated: "${result.reply}"`);
            
            const isTranslated = lang.code === "en" ? 
                result.reply === result.original : 
                result.reply !== result.original;
            
            const hasValidTranslation = lang.code === "hi" ? 
                result.reply.includes("आप") || result.reply.includes("रोग") || result.reply.includes("उपज") || result.reply.includes("जोखिम") :
                lang.code === "te" ?
                result.reply.includes("మీరు") || result.reply.includes("వ్యాధి") || result.reply.includes("దిగుబడి") || result.reply.includes("ప్రమాదం") :
                true;
            
            console.log(`   Translation Applied: ${isTranslated ? 'YES' : 'NO'}`);
            console.log(`   Valid Translation: ${hasValidTranslation ? 'YES' : 'NO'}`);
            
            const passed = lang.code === "en" ? true : (lang.code === "fr" ? result.reply === result.original : hasValidTranslation);
            if (passed) {
                multilingualResults.pass++;
            } else {
                multilingualResults.fail++;
            }
            console.log(`   Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
            console.log('');
        }
    }

    console.log(`Multilingual Validation: ${multilingualResults.pass}/${multilingualResults.pass + multilingualResults.fail} PASS`);

    // 4. Multi-Intent Query Testing
    console.log("\n4. MULTI-INTENT QUERY TESTING");
    console.log("Testing combined intent handling\n");

    const multiIntentTests = [
        {
            query: "What is my yield and loan eligibility?",
            expectedIntents: ["yield", "loan"],
            description: "Yield + Financial"
        },
        {
            query: "Is my crop at risk and what should I do?",
            expectedIntents: ["risk", "help"],
            description: "Risk + Action"
        },
        {
            query: "How to treat disease and improve yield?",
            expectedIntents: ["disease", "yield"],
            description: "Disease + Yield"
        },
        {
            query: "What disease is this and is it dangerous?",
            expectedIntents: ["disease", "risk"],
            description: "Disease + Risk"
        }
    ];

    let multiIntentResults = { pass: 0, fail: 0 };

    for (let i = 0; i < multiIntentTests.length; i++) {
        const test = multiIntentTests[i];
        console.log(`Multi-Intent Test ${i + 1}: ${test.description}`);
        console.log(`   Query: "${test.query}"`);
        console.log(`   Expected Intents: ${test.expectedIntents.join(", ")}`);
        
        const result = await runChatTest(test.query, "en", testContext);
        
        console.log(`   Response: "${result.original}"`);
        
        // Check if multiple intents are handled
        const hasYield = result.original.toLowerCase().includes("yield") || result.original.toLowerCase().includes("tons");
        const hasLoan = result.original.toLowerCase().includes("loan") || result.original.toLowerCase().includes("eligible");
        const hasDisease = result.original.toLowerCase().includes("disease") || result.original.toLowerCase().includes("blight");
        const hasRisk = result.original.toLowerCase().includes("risk") || result.original.toLowerCase().includes("danger");
        const hasHelp = result.original.toLowerCase().includes("should") || result.original.toLowerCase().includes("do");
        
        const actualIntents = [];
        if (hasYield) actualIntents.push("yield");
        if (hasLoan) actualIntents.push("loan");
        if (hasDisease) actualIntents.push("disease");
        if (hasRisk) actualIntents.push("risk");
        if (hasHelp) actualIntents.push("help");
        
        console.log(`   Detected Intents: ${actualIntents.join(", ")}`);
        console.log(`   Handles Multiple: ${actualIntents.length >= 2 ? 'YES' : 'NO'}`);
        console.log(`   Coherent Response: ${result.original.length > 20 && result.original.includes(".") ? 'YES' : 'NO'}`);
        
        const passed = actualIntents.length >= 2 && result.original.length > 20;
        if (passed) {
            multiIntentResults.pass++;
            console.log(`   Status: ✅ PASS`);
        } else {
            multiIntentResults.fail++;
            console.log(`   Status: ❌ FAIL`);
        }
        console.log('');
    }

    console.log(`Multi-Intent Testing: ${multiIntentResults.pass}/${multiIntentResults.pass + multiIntentResults.fail} PASS`);

    // 5. Edge Case Testing
    console.log("\n5. EDGE CASE TESTING");
    console.log("Testing robustness and error handling\n");

    const edgeCases = [
        { name: "Empty Message", query: "" },
        { name: "Whitespace Only", query: "   " },
        { name: "Very Long Message", query: "a".repeat(1000) },
        { name: "Irrelevant - Hello", query: "hello" },
        { name: "Irrelevant - How are you", query: "how are you" },
        { name: "Unknown Keywords", query: "quantum farming blockchain AI" },
        { name: "Special Characters", query: "What @#$% is wrong with my crop?" },
        { name: "Numbers Only", query: "12345" },
        { name: "Mixed Languages", query: "mera crop kya hai?" },
        { name: "All Caps", query: "HELP MY CROP IS DYING" }
    ];

    let edgeCaseResults = { pass: 0, fail: 0 };

    for (let i = 0; i < edgeCases.length; i++) {
        const test = edgeCases[i];
        console.log(`Edge Case ${i + 1}: ${test.name}`);
        console.log(`   Query: "${test.query.substring(0, 50)}${test.query.length > 50 ? '...' : ''}"`);
        
        const result = await runChatTest(test.query, "en", testContext);
        
        console.log(`   Response: "${result.original}"`);
        console.log(`   Has Response: ${result.original && result.original.length > 0 ? 'YES' : 'NO'}`);
        console.log(`   No Errors: ${!result.original.includes("error") && !result.original.includes("undefined") ? 'YES' : 'NO'}`);
        console.log(`   Graceful Fallback: ${result.original.includes("upload") || result.original.includes("ask about") ? 'YES' : 'NO'}`);
        
        const passed = result.original && result.original.length > 0 && !result.original.includes("error") && !result.original.includes("undefined");
        if (passed) {
            edgeCaseResults.pass++;
            console.log(`   Status: ✅ PASS`);
        } else {
            edgeCaseResults.fail++;
            console.log(`   Status: ❌ FAIL`);
        }
        console.log('');
    }

    console.log(`Edge Case Testing: ${edgeCaseResults.pass}/${edgeCaseResults.pass + edgeCaseResults.fail} PASS`);

    // 6. Keyword Coverage Validation
    console.log("\n6. KEYWORD COVERAGE VALIDATION");
    console.log("Testing expanded keyword system\n");

    const keywordTests = [
        // Disease keywords
        { category: "Disease", keywords: ["disease", "infection", "blight", "fungus", "spot", "leaf problem", "sick", "rot", "mildew"] },
        // Risk keywords  
        { category: "Risk", keywords: ["risk", "danger", "threat", "safe", "problem", "warning", "hazard"] },
        // Yield keywords
        { category: "Yield", keywords: ["yield", "production", "harvest", "output", "crop"] },
        // Financial keywords
        { category: "Financial", keywords: ["loan", "credit", "money", "finance", "eligible", "bank"] },
        // Help keywords
        { category: "Help", keywords: ["help", "what should i do", "advice", "guide"] },
        // Income keywords
        { category: "Income", keywords: ["profit", "income", "earnings"] }
    ];

    let keywordResults = { total: 0, matched: 0, unmatched: 0 };

    for (const testGroup of keywordTests) {
        console.log(`Testing ${testGroup.category} keywords:`);
        
        for (const keyword of testGroup.keywords) {
            keywordResults.total++;
            const result = await runChatTest(keyword, "en", testContext);
            const isGeneric = result.original === "Please upload crop image or ask about disease, yield, risk, or loan eligibility.";
            const matched = !isGeneric;
            
            if (matched) {
                keywordResults.matched++;
                console.log(`   "${keyword}" ✅ MATCHED`);
            } else {
                keywordResults.unmatched++;
                console.log(`   "${keyword}" ❌ NOT MATCHED`);
            }
        }
        console.log('');
    }

    console.log(`Keyword Coverage Summary:`);
    console.log(`   Total Keywords: ${keywordResults.total}`);
    console.log(`   Matched: ${keywordResults.matched} (${(keywordResults.matched/keywordResults.total*100).toFixed(1)}%)`);
    console.log(`   Not Matched: ${keywordResults.unmatched} (${(keywordResults.unmatched/keywordResults.total*100).toFixed(1)}%)`);
    console.log('');

    // 7. Response Quality Evaluation
    console.log("7. RESPONSE QUALITY EVALUATION");
    console.log("Assessing advice actionability and farmer-friendliness\n");

    const qualityTests = [
        {
            query: "What disease is this?",
            context: { disease: "Early Blight", riskLevel: "High Risk", projectedYield: 12, trustScore: 65 },
            criteria: ["specific", "actionable", "simple", "safe"]
        },
        {
            query: "Is my crop safe?",
            context: { disease: "Early Blight", riskLevel: "High Risk", projectedYield: 12, trustScore: 65 },
            criteria: ["clear", "urgent", "guidance", "risk-aware"]
        },
        {
            query: "How much yield will I get?",
            context: { disease: "Healthy", riskLevel: "Low Risk", projectedYield: 20, trustScore: 85 },
            criteria: ["specific", "numeric", "helpful", "realistic"]
        },
        {
            query: "Can I get loan?",
            context: { disease: "Healthy", riskLevel: "Low Risk", projectedYield: 20, trustScore: 45 },
            criteria: ["clear", "explanatory", "constructive", "guidance"]
        }
    ];

    let qualityResults = { excellent: 0, good: 0, poor: 0 };

    for (let i = 0; i < qualityTests.length; i++) {
        const test = qualityTests[i];
        console.log(`Quality Test ${i + 1}: "${test.query}"`);
        console.log(`   Criteria: ${test.criteria.join(", ")}`);
        
        const result = await runChatTest(test.query, "en", test.context);
        
        console.log(`   Response: "${result.original}"`);
        
        // Quality metrics
        const isSpecific = result.original.length > 15 && !result.original.includes("N/A");
        const isActionable = result.original.toLowerCase().includes("apply") || result.original.toLowerCase().includes("spray") || result.original.toLowerCase().includes("monitor") || result.original.toLowerCase().includes("improve") || result.original.toLowerCase().includes("eligible");
        const isSimple = result.original.split(" ").length <= 15 && !result.original.includes("algorithm") && !result.original.includes("model");
        const isClear = result.original.includes(".") && result.original.length > 10;
        const isSafe = !result.original.includes("dangerous") && !result.original.includes("harmful");
        
        console.log(`   Specific: ${isSpecific ? 'YES' : 'NO'}`);
        console.log(`   Actionable: ${isActionable ? 'YES' : 'NO'}`);
        console.log(`   Simple: ${isSimple ? 'YES' : 'NO'}`);
        console.log(`   Clear: ${isClear ? 'YES' : 'NO'}`);
        console.log(`   Safe: ${isSafe ? 'YES' : 'NO'}`);
        
        const qualityScore = [isSpecific, isActionable, isSimple, isClear, isSafe].filter(Boolean).length;
        let quality;
        if (qualityScore >= 4) {
            quality = "excellent";
            qualityResults.excellent++;
        } else if (qualityScore >= 2) {
            quality = "good";
            qualityResults.good++;
        } else {
            quality = "poor";
            qualityResults.poor++;
        }
        
        console.log(`   Quality Rating: ${quality.toUpperCase()} (${qualityScore}/5)`);
        console.log('');
    }

    // 8. Consistency & Reliability Testing
    console.log("8. CONSISTENCY & RELIABILITY TESTING");
    console.log("Testing deterministic behavior\n");

    const consistencyTests = [
        { query: "What happened to my crop?", iterations: 5 },
        { query: "Is my crop safe?", iterations: 5 },
        { query: "Can I get loan?", iterations: 5 },
        { query: "What should I do now?", iterations: 5 }
    ];

    let consistencyResults = { pass: 0, fail: 0 };

    for (let i = 0; i < consistencyTests.length; i++) {
        const test = consistencyTests[i];
        console.log(`Consistency Test ${i + 1}: "${test.query}" (${test.iterations} iterations)`);
        
        const responses = [];
        let allSame = true;
        
        for (let j = 0; j < test.iterations; j++) {
            const result = await runChatTest(test.query, "en", testContext);
            responses.push(result.original);
            
            if (j > 0 && responses[j] !== responses[0]) {
                allSame = false;
            }
        }
        
        console.log(`   First Response: "${responses[0]}"`);
        console.log(`   All Identical: ${allSame ? 'YES' : 'NO'}`);
        console.log(`   Unique Responses: ${[...new Set(responses)].length}`);
        
        const hasNoHallucination = responses.every(r => !r.includes("undefined") && !r.includes("error") && !r.includes("random"));
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
    }

    console.log(`Consistency Testing: ${consistencyResults.pass}/${consistencyResults.pass + consistencyResults.fail} PASS`);

    // Final Assessment
    console.log("\n" + "=".repeat(60));
    console.log("FINAL CHATBOT VALIDATION SUMMARY");
    console.log("=".repeat(60));

    const totalTests = farmerResults.pass + farmerResults.fail +
                      contextResults.pass + contextResults.fail +
                      multilingualResults.pass + multilingualResults.fail +
                      multiIntentResults.pass + multiIntentResults.fail +
                      edgeCaseResults.pass + edgeCaseResults.fail +
                      consistencyResults.pass + consistencyResults.fail;

    const totalPassed = farmerResults.pass + contextResults.pass + multilingualResults.pass +
                        multiIntentResults.pass + edgeCaseResults.pass + consistencyResults.pass;

    const overallPassRate = (totalPassed / totalTests) * 100;

    console.log(`\n📊 VALIDATION RESULTS:`);
    console.log(`   Farmer Query Simulation: ${farmerResults.pass}/${farmerResults.pass + farmerResults.fail} PASS`);
    console.log(`   Context Awareness: ${contextResults.pass}/${contextResults.pass + contextResults.fail} PASS`);
    console.log(`   Multilingual Support: ${multilingualResults.pass}/${multilingualResults.pass + multilingualResults.fail} PASS`);
    console.log(`   Multi-Intent Handling: ${multiIntentResults.pass}/${multiIntentResults.pass + multiIntentResults.fail} PASS`);
    console.log(`   Edge Case Handling: ${edgeCaseResults.pass}/${edgeCaseResults.pass + edgeCaseResults.fail} PASS`);
    console.log(`   Keyword Coverage: ${keywordResults.matched}/${keywordResults.total} (${(keywordResults.matched/keywordResults.total*100).toFixed(1)}%)`);
    console.log(`   Response Quality: ${qualityResults.excellent} excellent, ${qualityResults.good} good, ${qualityResults.poor} poor`);
    console.log(`   Consistency: ${consistencyResults.pass}/${consistencyResults.pass + consistencyResults.fail} PASS`);

    console.log(`\n🎯 OVERALL ASSESSMENT:`);
    console.log(`   Overall Test Pass Rate: ${overallPassRate.toFixed(1)}%`);
    console.log(`   Keyword Coverage: ${(keywordResults.matched/keywordResults.total*100).toFixed(1)}%`);
    
    const qualityScore = (qualityResults.excellent * 3 + qualityResults.good * 2 + qualityResults.poor * 1) / (qualityResults.excellent + qualityResults.good + qualityResults.poor) || 0;
    console.log(`   Response Quality Score: ${qualityScore.toFixed(1)}/3`);

    const finalScore = (overallPassRate + (keywordResults.matched/keywordResults.total*100) + (qualityScore * 33.33)) / 3;
    console.log(`   Final Chatbot Score: ${finalScore.toFixed(1)}/100`);

    console.log(`\n📋 FINAL VERDICT:`);
    if (finalScore >= 85) {
        console.log(`   "Demo Ready"`);
    } else if (finalScore >= 70) {
        console.log(`   "Needs Final Fixes"`);
    } else {
        console.log(`   "Not Ready for Demo"`);
    }

    console.log("\n=== FINAL CHATBOT VALIDATION COMPLETE ===");
}

// Run the final validation
runFinalValidation().catch(error => {
    console.error("Final validation failed:", error);
    process.exit(1);
});
