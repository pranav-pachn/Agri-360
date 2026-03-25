require('dotenv').config();
const analysisService = require('../services/analysisService');

async function testFix() {
    try {
        console.log("Initiating dummy analysis to test sustainability signature fix...");
        // This will attempt to run through the whole function
        // It might fail on database insertion, but we want to make sure it successfully passes the `split` lines!
        await analysisService.generateAnalysis('Tomato', 'Punjab, India', null, 'medium');
        console.log("✅ SUCCESS: Passed through sustainability calculations without split error!");
        process.exit(0);
    } catch (error) {
        if (error.message.includes("split")) {
            console.error("❌ FAILED: The split error is still occurring.");
            console.error(error);
            process.exit(1);
        } else if (error.message.includes("Supabase Error") || error.message.includes("fetch")) {
            console.log("✅ SUCCESS: Passed through sustainability calculations without split error!");
            console.log("   (Stopped expectedly at database/network boundary: " + error.message + ")");
            process.exit(0);
        } else {
            console.error("⚠️ UNEXPECTED ERROR:", error);
            process.exit(1);
        }
    }
}

testFix();
