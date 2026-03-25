/**
 * Chatbot Bug Detection Analysis
 * Deep analysis of issues and improvements needed
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

async function runBugAnalysis() {
    console.log("=== CHATBOT BUG DETECTION ANALYSIS ===\n");

    const testContext = {
        disease: "Early Blight",
        riskLevel: "High Risk",
        projectedYield: 12,
        trustScore: 65
    };

    // 1. Intent Detection Coverage Analysis
    console.log("1. INTENT DETECTION COVERAGE ANALYSIS");
    console.log("Testing keyword coverage gaps\n");

    const keywordTests = [
        // Disease-related keywords that should work
        { category: "Disease", keywords: ["disease", "blight", "fungus", "virus", "bacteria", "infection", "sick", "ill", "symptom"], shouldMatch: true },
        // Disease-related keywords that currently fail
        { category: "Disease", keywords: ["pest", "insect", "mold", "mildew", "rot", "wilt", "spot"], shouldMatch: false },
        // Risk-related keywords
        { category: "Risk", keywords: ["risk", "danger", "threat", "urgent", "warning"], shouldMatch: true },
        // Risk-related keywords that fail
        { category: "Risk", keywords: ["warning", "alert", "caution", "hazard"], shouldMatch: false },
        // Yield-related keywords
        { category: "Yield", keywords: ["yield", "harvest", "production", "output"], shouldMatch: true },
        // Yield-related keywords that fail
        { category: "Yield", keywords: ["crop", "income", "profit", "revenue"], shouldMatch: false },
        // Financial keywords
        { category: "Financial", keywords: ["loan", "credit", "money", "finance"], shouldMatch: true },
        // Financial keywords that fail
        { category: "Financial", keywords: ["bank", "payment", "investment", "subsidy"], shouldMatch: false }
    ];

    let totalKeywords = 0;
    let matchedKeywords = 0;
    let unmatchedKeywords = 0;

    for (const testGroup of keywordTests) {
        console.log(`Testing ${testGroup.category} keywords:`);
        
        for (const keyword of testGroup.keywords) {
            totalKeywords++;
            const result = await runChatTest(keyword, "en", testContext);
            const isGeneric = result.original === "Please upload crop image or ask about disease, yield, or risk.";
            const matched = !isGeneric;
            
            if (matched) {
                matchedKeywords++;
                console.log(`   "${keyword}" ✅ MATCHED`);
            } else {
                unmatchedKeywords++;
                console.log(`   "${keyword}" ❌ NOT MATCHED`);
            }
        }
        console.log('');
    }

    console.log(`Keyword Coverage Summary:`);
    console.log(`   Total Keywords Tested: ${totalKeywords}`);
    console.log(`   Matched: ${matchedKeywords} (${(matchedKeywords/totalKeywords*100).toFixed(1)}%)`);
    console.log(`   Not Matched: ${unmatchedKeywords} (${(unmatchedKeywords/totalKeywords*100).toFixed(1)}%)`);
    console.log('');

    // 2. Translation Coverage Analysis
    console.log("2. TRANSLATION COVERAGE ANALYSIS");
    console.log("Testing translation mapping gaps\n");

    const allPossibleResponses = [
        "Detected disease is Early Blight. Apply recommended treatment immediately.",
        "Current risk level is High Risk. Take preventive measures.",
        "Expected yield is 12 tons/hectare.",
        "You are eligible for a loan.",
        "Improve farm stability to increase loan eligibility.",
        "Yield and risk directly affect your income.",
        "High risk detected. Immediate action is required.",
        "Please upload crop image or ask about disease, yield, or risk."
    ];

    const languages = ["hi", "te"];
    let translationCoverage = {};

    for (const lang of languages) {
        console.log(`Testing ${lang.toUpperCase()} translations:`);
        let translatedCount = 0;
        let untranslatedCount = 0;
        
        for (const response of allPossibleResponses) {
            const result = await runChatTest("test", lang, testContext);
            // Check if any translation exists by comparing with a known translated response
            const hasTranslation = result.reply !== result.original && lang === "hi" ? 
                result.reply.includes("आप") || result.reply.includes("उपज") || result.reply.includes("जोखिम") :
                result.reply !== result.original && lang === "te" ?
                result.reply.includes("మీరు") || result.reply.includes("దిగుబడి") || result.reply.includes("ప్రమాదం") :
                false;
            
            if (hasTranslation) {
                translatedCount++;
                console.log(`   ✅ "${response.substring(0, 30)}..." → Translated`);
            } else {
                untranslatedCount++;
                console.log(`   ❌ "${response.substring(0, 30)}..." → Not translated`);
            }
        }
        
        translationCoverage[lang] = { translated: translatedCount, untranslated: untranslatedCount };
        console.log(`   ${lang.toUpperCase()} Summary: ${translatedCount}/${allPossibleResponses.length} translated (${(translatedCount/allPossibleResponses.length*100).toFixed(1)}%)`);
        console.log('');
    }

    // 3. Context Usage Analysis
    console.log("3. CONTEXT USAGE ANALYSIS");
    console.log("Testing how well context is utilized\n");

    const contextTests = [
        {
            name: "Disease Context Usage",
            context: { disease: "Late Blight", riskLevel: "High Risk", projectedYield: 12, trustScore: 65 },
            query: "What should I do?",
            expectedContextUsage: ["disease", "risk"]
        },
        {
            name: "Yield Context Usage",
            context: { disease: "Early Blight", riskLevel: "Medium Risk", projectedYield: 15, trustScore: 70 },
            query: "What is my yield?",
            expectedContextUsage: ["yield"]
        },
        {
            name: "Trust Score Context Usage",
            context: { disease: "Healthy", riskLevel: "Low Risk", projectedYield: 20, trustScore: 45 },
            query: "Can I get a loan?",
            expectedContextUsage: ["trust"]
        },
        {
            name: "Comprehensive Context Query",
            context: { disease: "Powdery Mildew", riskLevel: "High Risk", projectedYield: 8, trustScore: 55 },
            query: "Tell me about my farm",
            expectedContextUsage: ["disease", "risk", "yield", "trust"]
        }
    ];

    let contextUsageResults = { pass: 0, fail: 0 };

    for (const test of contextTests) {
        console.log(`Context Test: ${test.name}`);
        console.log(`   Context: ${JSON.stringify(test.context)}`);
        console.log(`   Query: "${test.query}"`);
        console.log(`   Expected Context Usage: ${test.expectedContextUsage.join(", ")}`);
        
        const result = await runChatTest(test.query, "en", test.context);
        
        // Check which context variables are used
        const usesDisease = result.original.toLowerCase().includes(test.context.disease.toLowerCase());
        const usesRisk = result.original.toLowerCase().includes(test.context.riskLevel.toLowerCase());
        const usesYield = result.original.toLowerCase().includes(test.context.projectedYield.toString());
        const usesTrust = test.context.trustScore ? 
            (result.original.includes("eligible") || result.original.includes("improve") || result.original.includes("loan")) : false;
        
        const actualContextUsage = [];
        if (usesDisease) actualContextUsage.push("disease");
        if (usesRisk) actualContextUsage.push("risk");
        if (usesYield) actualContextUsage.push("yield");
        if (usesTrust) actualContextUsage.push("trust");
        
        console.log(`   Actual Context Usage: ${actualContextUsage.join(", ")}`);
        console.log(`   Response: "${result.original}"`);
        
        const contextUsageScore = actualContextUsage.length / test.expectedContextUsage.length;
        const passed = contextUsageScore >= 0.5; // At least 50% of expected context used
        
        if (passed) {
            contextUsageResults.pass++;
            console.log(`   Status: ✅ PASS (${(contextUsageScore*100).toFixed(1)}% context usage)`);
        } else {
            contextUsageResults.fail++;
            console.log(`   Status: ❌ FAIL (${(contextUsageScore*100).toFixed(1)}% context usage)`);
        }
        console.log('');
    }

    // 4. Response Quality Analysis
    console.log("4. RESPONSE QUALITY ANALYSIS");
    console.log("Evaluating response helpfulness and actionability\n");

    const qualityTests = [
        {
            query: "What disease is this?",
            context: { disease: "Early Blight", riskLevel: "High Risk", projectedYield: 12, trustScore: 65 },
            expectedQuality: ["specific disease name", "treatment advice", "actionable"]
        },
        {
            query: "Is my crop at risk?",
            context: { disease: "Early Blight", riskLevel: "High Risk", projectedYield: 12, trustScore: 65 },
            expectedQuality: ["risk level", "urgency", "preventive measures"]
        },
        {
            query: "Am I eligible for loan?",
            context: { disease: "Healthy", riskLevel: "Low Risk", projectedYield: 20, trustScore: 85 },
            expectedQuality: ["clear yes/no", "explanation", "next steps"]
        },
        {
            query: "What should I do now?",
            context: { disease: "Early Blight", riskLevel: "High Risk", projectedYield: 12, trustScore: 65 },
            expectedQuality: ["prioritized actions", "specific steps", "urgency"]
        }
    ];

    let qualityResults = { excellent: 0, good: 0, poor: 0 };

    for (const test of qualityTests) {
        console.log(`Quality Test: "${test.query}"`);
        console.log(`   Expected Quality: ${test.expectedQuality.join(", ")}`);
        
        const result = await runChatTest(test.query, "en", test.context);
        
        // Quality metrics
        const isSpecific = result.original.length > 20 && !result.original.includes("N/A");
        const isActionable = result.original.toLowerCase().includes("apply") || 
                           result.original.toLowerCase().includes("take") || 
                           result.original.toLowerCase().includes("improve") ||
                           result.original.toLowerCase().includes("eligible");
        const isClear = result.original.split(" ").length >= 3 && result.original.split(" ").length <= 15;
        const isGeneric = result.original === "Please upload crop image or ask about disease, yield, or risk.";
        
        console.log(`   Response: "${result.original}"`);
        console.log(`   Specific: ${isSpecific ? 'YES' : 'NO'}`);
        console.log(`   Actionable: ${isActionable ? 'YES' : 'NO'}`);
        console.log(`   Clear: ${isClear ? 'YES' : 'NO'}`);
        console.log(`   Generic: ${isGeneric ? 'YES' : 'NO'}`);
        
        let quality;
        if (isSpecific && isActionable && !isGeneric) {
            quality = "excellent";
            qualityResults.excellent++;
        } else if (isClear && !isGeneric) {
            quality = "good";
            qualityResults.good++;
        } else {
            quality = "poor";
            qualityResults.poor++;
        }
        
        console.log(`   Quality Rating: ${quality.toUpperCase()}`);
        console.log('');
    }

    // 5. Critical Issues Summary
    console.log("5. CRITICAL ISSUES SUMMARY");
    console.log("Identifying the most important problems to fix\n");

    const criticalIssues = [];

    // Issue 1: Poor keyword coverage
    if (unmatchedKeywords > totalKeywords * 0.3) {
        criticalIssues.push({
            severity: "HIGH",
            issue: "Poor keyword coverage",
            impact: "Many farmer queries fall through to generic response",
            recommendation: "Expand keyword matching in responseEngine.js"
        });
    }

    // Issue 2: Limited translation coverage
    for (const [lang, coverage] of Object.entries(translationCoverage)) {
        if (coverage.untranslated > coverage.translated) {
            criticalIssues.push({
                severity: "MEDIUM",
                issue: `Limited ${lang.toUpperCase()} translation coverage`,
                impact: "Non-English farmers get English responses",
                recommendation: `Add more translations to translator.js for ${lang.toUpperCase()}`
            });
        }
    }

    // Issue 3: Context awareness gaps
    if (contextUsageResults.fail > contextUsageResults.pass) {
        criticalIssues.push({
            severity: "HIGH",
            issue: "Poor context awareness",
            impact: "Responses don't use available farm data effectively",
            recommendation: "Enhance context usage logic in responseEngine.js"
        });
    }

    // Issue 4: Generic responses
    if (qualityResults.poor > qualityResults.excellent) {
        criticalIssues.push({
            severity: "MEDIUM",
            issue: "Too many generic responses",
            impact: "Farmers don't get helpful, specific advice",
            recommendation: "Add more specific response templates and context integration"
        });
    }

    console.log(`Found ${criticalIssues.length} critical issues:\n`);
    criticalIssues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.severity} SEVERITY: ${issue.issue}`);
        console.log(`   Impact: ${issue.impact}`);
        console.log(`   Recommendation: ${issue.recommendation}`);
        console.log('');
    });

    // Final Assessment
    console.log("6. FINAL ASSESSMENT");
    console.log("Overall chatbot health and readiness\n");

    const totalQualityTests = qualityResults.excellent + qualityResults.good + qualityResults.poor;
    const qualityScore = (qualityResults.excellent * 3 + qualityResults.good * 2 + qualityResults.poor * 1) / (totalQualityTests * 3);
    const keywordScore = matchedKeywords / totalKeywords;
    const translationScore = Object.values(translationCoverage).reduce((acc, cov) => acc + (cov.translated / (cov.translated + cov.untranslated)), 0) / languages.length;
    const contextScore = contextUsageResults.pass / (contextUsageResults.pass + contextUsageResults.fail);

    const overallScore = (qualityScore + keywordScore + translationScore + contextScore) / 4;

    console.log(`Component Scores:`);
    console.log(`   Response Quality: ${(qualityScore * 100).toFixed(1)}%`);
    console.log(`   Keyword Coverage: ${(keywordScore * 100).toFixed(1)}%`);
    console.log(`   Translation Coverage: ${(translationScore * 100).toFixed(1)}%`);
    console.log(`   Context Awareness: ${(contextScore * 100).toFixed(1)}%`);
    console.log('');
    console.log(`Overall Chatbot Score: ${(overallScore * 100).toFixed(1)}%`);

    console.log(`\n🎯 READINESS ASSESSMENT:`);
    if (overallScore >= 0.8) {
        console.log(`   Status: READY FOR DEMO (with minor improvements)`);
        console.log(`   Focus: Enhance keyword coverage and context usage`);
    } else if (overallScore >= 0.6) {
        console.log(`   Status: NEEDS IMPROVEMENTS BEFORE DEMO`);
        console.log(`   Focus: Fix critical issues identified above`);
    } else {
        console.log(`   Status: NOT READY FOR DEMO`);
        console.log(`   Focus: Major redesign needed`);
    }

    console.log("\n=== CHATBOT BUG ANALYSIS COMPLETE ===");
}

// Run the analysis
runBugAnalysis().catch(error => {
    console.error("Analysis failed:", error);
    process.exit(1);
});
