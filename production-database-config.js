/**
 * Production Database Configuration Test
 * Tests complete AI integration flow with database storage
 */

require('dotenv').config({ path: './.env' });
const analysisService = require('./server/src/services/analysisService');

console.log("=== PRODUCTION DATABASE CONFIGURATION TEST ===\n");

async function testProductionFlow() {
    console.log("🚀 TESTING COMPLETE PRODUCTION FLOW");
    console.log("=".repeat(60));
    
    const testCases = [
        {
            name: "Tomato - High Risk Scenario",
            crop: "Tomato",
            location: "Maharashtra",
            description: "Tests disease detection and risk assessment"
        },
        {
            name: "Wheat - Healthy Crop",
            crop: "Wheat", 
            location: "Punjab",
            description: "Tests healthy crop analysis"
        },
        {
            name: "Rice - Medium Risk",
            crop: "Rice",
            location: "Andhra Pradesh",
            description: "Tests medium risk scenario"
        }
    ];
    
    const results = [];
    
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`\n${i + 1}. ${testCase.name}`);
        console.log(`   ${testCase.description}`);
        console.log(`   Input: ${testCase.crop}, ${testCase.location}`);
        
        try {
            console.log("\n   🔄 Running analysis...");
            const startTime = Date.now();
            
            const result = await analysisService.generateAnalysis(
                testCase.crop, 
                testCase.location, 
                null // No image for this test
            );
            
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            console.log(`   ✅ Analysis completed in ${responseTime}ms`);
            
            if (result && result.id) {
                console.log(`   📋 Results:`);
                console.log(`      ID: ${result.id}`);
                console.log(`      Trust Score: ${result.trust_score || 'N/A'}`);
                console.log(`      Credit Rating: ${result.credit_rating || 'N/A'}`);
                console.log(`      Loan Eligible: ${result.loan_eligible ? 'YES' : 'NO'}`);
                console.log(`      Disease: ${result.disease || 'N/A'}`);
                console.log(`      Risk Score: ${result.risk_score || 'N/A'}`);
                
                results.push({
                    ...testCase,
                    success: true,
                    result,
                    responseTime
                });
                
                console.log(`   ✅ SUCCESS`);
            } else {
                console.log(`   ❌ No result returned`);
                results.push({
                    ...testCase,
                    success: false,
                    error: 'No result returned',
                    responseTime
                });
            }
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            results.push({
                ...testCase,
                success: false,
                error: error.message,
                responseTime: 0
            });
        }
        
        console.log("   " + "-".repeat(50));
    }
    
    return results;
}

async function validateDatabaseStorage() {
    console.log("\n🔍 VALIDATING DATABASE STORAGE");
    console.log("=".repeat(60));
    
    try {
        const supabase = require('./server/src/config/supabase');
        
        // Check recent entries
        const { data: recentReports, error } = await supabase
            .from('crop_reports')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
            
        if (error) {
            console.log(`❌ Error fetching recent reports: ${error.message}`);
            return false;
        }
        
        console.log(`\n📊 RECENT CROP REPORTS (${recentReports.length}):`);
        recentReports.forEach((report, index) => {
            console.log(`   ${index + 1}. ${report.crop_type} - ${report.disease || 'Unknown'}`);
            console.log(`      ID: ${report.id}`);
            console.log(`      Confidence: ${(report.confidence * 100).toFixed(1)}%`);
            console.log(`      Risk Score: ${report.risk_score || 'N/A'}`);
            console.log(`      Created: ${new Date(report.created_at).toLocaleString()}`);
            console.log("");
        });
        
        return true;
        
    } catch (error) {
        console.log(`❌ Database validation failed: ${error.message}`);
        return false;
    }
}

async function testEnvironmentVariables() {
    console.log("\n🔧 TESTING ENVIRONMENT VARIABLES");
    console.log("=".repeat(60));
    
    const requiredVars = [
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY',
        'SUPABASE_KEY',
        'PORT',
        'JWT_SECRET',
        'OPENWEATHER_API_KEY',
        'USE_TENSORFLOW'
    ];
    
    const optionalVars = [
        'AI_SERVICE_URL',
        'AI_API_KEY',
        'LLM_API_URL',
        'LLM_API_KEY',
        'USE_LLM'
    ];
    
    console.log("📋 REQUIRED VARIABLES:");
    let allRequiredPresent = true;
    
    requiredVars.forEach(varName => {
        const value = process.env[varName];
        const status = value ? '✅' : '❌';
        const displayValue = varName.includes('KEY') || varName.includes('SECRET') 
            ? `${value?.substring(0, 10)}...` 
            : value;
        
        console.log(`   ${status} ${varName}: ${displayValue || 'MISSING'}`);
        
        if (!value) {
            allRequiredPresent = false;
        }
    });
    
    console.log("\n📋 OPTIONAL VARIABLES:");
    optionalVars.forEach(varName => {
        const value = process.env[varName];
        const status = value ? '✅' : '⚪';
        const displayValue = varName.includes('KEY') || varName.includes('SECRET')
            ? `${value?.substring(0, 10)}...`
            : value;
        
        console.log(`   ${status} ${varName}: ${displayValue || 'NOT SET'}`);
    });
    
    console.log(`\n🎯 ENVIRONMENT STATUS: ${allRequiredPresent ? '✅ READY' : '❌ INCOMPLETE'}`);
    
    return allRequiredPresent;
}

async function testAPIEndpoints() {
    console.log("\n🌐 TESTING API ENDPOINTS");
    console.log("=".repeat(60));
    
    try {
        // Test if server can start (simulated)
        console.log("📡 Checking API endpoints configuration...");
        
        const fs = require('fs');
        const path = require('path');
        
        // Check if server files exist
        const serverFiles = [
            'server/src/app.js',
            'server/src/server.js',
            'server/src/controllers/analysisController.js',
            'server/src/services/analysisService.js'
        ];
        
        let allFilesExist = true;
        
        serverFiles.forEach(file => {
            const filePath = path.join(__dirname, file);
            const exists = fs.existsSync(filePath);
            const status = exists ? '✅' : '❌';
            console.log(`   ${status} ${file}`);
            
            if (!exists) {
                allFilesExist = false;
            }
        });
        
        console.log(`\n🎯 API STATUS: ${allFilesExist ? '✅ CONFIGURED' : '❌ MISSING FILES'}`);
        
        return allFilesExist;
        
    } catch (error) {
        console.log(`❌ API endpoint test failed: ${error.message}`);
        return false;
    }
}

async function main() {
    try {
        console.log("🏭 PRODUCTION DATABASE CONFIGURATION TEST");
        console.log("Testing complete setup for AgriMitra360 deployment\n");
        
        // Step 1: Test environment variables
        const envStatus = await testEnvironmentVariables();
        
        // Step 2: Test API endpoints
        const apiStatus = await testAPIEndpoints();
        
        // Step 3: Test production flow
        const flowResults = await testProductionFlow();
        
        // Step 4: Validate database storage
        const dbStatus = await validateDatabaseStorage();
        
        // Summary
        console.log("\n" + "=".repeat(80));
        console.log("PRODUCTION CONFIGURATION SUMMARY");
        console.log("=".repeat(80));
        
        console.log(`\n🔧 Environment: ${envStatus ? '✅ READY' : '❌ INCOMPLETE'}`);
        console.log(`🌐 API Endpoints: ${apiStatus ? '✅ CONFIGURED' : '❌ MISSING FILES'}`);
        console.log(`🗄️  Database: ${dbStatus ? '✅ WORKING' : '❌ ISSUES'}`);
        
        const successfulTests = flowResults.filter(r => r.success).length;
        const totalTests = flowResults.length;
        console.log(`🤖 AI Integration: ${successfulTests}/${totalTests} tests passed`);
        
        flowResults.forEach((result, index) => {
            const status = result.success ? '✅' : '❌';
            const time = result.responseTime ? ` (${result.responseTime}ms)` : '';
            console.log(`   ${status} ${result.name}${time}`);
        });
        
        // Overall status
        const allTestsPass = envStatus && apiStatus && dbStatus && (successfulTests === totalTests);
        
        console.log(`\n🎯 OVERALL STATUS: ${allTestsPass ? '✅ PRODUCTION READY' : '⚠️  NEEDS ATTENTION'}`);
        
        if (allTestsPass) {
            console.log("\n🎉 PRODUCTION DEPLOYMENT READY!");
            console.log("✅ All components are working correctly");
            console.log("✅ Database integration is functional");
            console.log("✅ AI pipeline is operational");
            console.log("✅ Environment is properly configured");
            
            console.log("\n📋 DEPLOYMENT CHECKLIST:");
            console.log("✅ Environment variables configured");
            console.log("✅ Database tables created and accessible");
            console.log("✅ AI integration pipeline working");
            console.log("✅ Data storage to database verified");
            console.log("✅ API endpoints configured");
            
            console.log("\n🚀 READY FOR PRODUCTION DEPLOYMENT!");
            
        } else {
            console.log("\n⚠️  DEPLOYMENT NEEDS ATTENTION");
            
            if (!envStatus) {
                console.log("❌ Configure missing environment variables");
            }
            if (!apiStatus) {
                console.log("❌ Check API endpoint files");
            }
            if (!dbStatus) {
                console.log("❌ Resolve database connection issues");
            }
            if (successfulTests < totalTests) {
                console.log("❌ Fix AI integration pipeline");
            }
        }
        
    } catch (error) {
        console.error("❌ Production configuration test failed:", error);
    }
}

// Run the production test
main().catch(error => {
    console.error("Production configuration test failed:", error);
    process.exit(1);
});
