/**
 * Database Setup Verification Script
 * Verifies all tables exist and tests complete AI integration
 */

require('dotenv').config({ path: './.env' });
const supabase = require('./server/src/config/supabase');

console.log("=== DATABASE SETUP VERIFICATION ===\n");

async function verifyTables() {
    console.log("🔍 CHECKING TABLE STATUS");
    console.log("=".repeat(40));
    
    const tables = [
        { name: 'farmers', description: 'Farmer registration data' },
        { name: 'crop_reports', description: 'Crop analysis reports' },
        { name: 'credit_scores', description: 'Credit scoring data' },
        { name: 'chat_logs', description: 'Chat conversation logs' }
    ];
    
    const results = {};
    
    for (const table of tables) {
        try {
            console.log(`\nChecking ${table.name} table...`);
            
            const { data, error, count } = await supabase
                .from(table.name)
                .select('*', { count: 'exact', head: true });
                
            if (error) {
                if (error.code === '42P01') {
                    console.log(`❌ Table '${table.name}' does not exist`);
                    console.log(`   ${table.description}`);
                    results[table.name] = { exists: false, error: 'Table does not exist' };
                } else {
                    console.log(`❌ Error accessing '${table.name}': ${error.message}`);
                    results[table.name] = { exists: false, error: error.message };
                }
            } else {
                console.log(`✅ Table '${table.name}' exists (${count} records)`);
                console.log(`   ${table.description}`);
                results[table.name] = { exists: true, count };
            }
        } catch (error) {
            console.log(`❌ Unexpected error checking '${table.name}': ${error.message}`);
            results[table.name] = { exists: false, error: error.message };
        }
    }
    
    return results;
}

async function showTableData() {
    console.log("\n📊 DISPLAYING SAMPLE DATA");
    console.log("=".repeat(40));
    
    try {
        // Show farmers data
        console.log("\n👥 FARMERS:");
        const { data: farmers, error: farmersError } = await supabase
            .from('farmers')
            .select('*')
            .limit(5);
            
        if (farmersError) {
            console.log(`❌ Error: ${farmersError.message}`);
        } else {
            if (farmers.length === 0) {
                console.log("No farmers found");
            } else {
                farmers.forEach(farmer => {
                    console.log(`   - ${farmer.name} (${farmer.location}, ${farmer.language})`);
                });
            }
        }
        
        // Show crop reports data
        console.log("\n🌾 CROP REPORTS:");
        const { data: reports, error: reportsError } = await supabase
            .from('crop_reports')
            .select('*')
            .limit(5);
            
        if (reportsError) {
            console.log(`❌ Error: ${reportsError.message}`);
        } else {
            if (reports.length === 0) {
                console.log("No crop reports found");
            } else {
                reports.forEach(report => {
                    console.log(`   - ${report.crop_type}: ${report.disease || 'Unknown'} (${(report.confidence * 100).toFixed(1)}% confidence)`);
                });
            }
        }
        
        // Show credit scores data
        console.log("\n💰 CREDIT SCORES:");
        const { data: scores, error: scoresError } = await supabase
            .from('credit_scores')
            .select('*')
            .limit(5);
            
        if (scoresError) {
            console.log(`❌ Error: ${scoresError.message}`);
        } else {
            if (scores.length === 0) {
                console.log("No credit scores found");
            } else {
                scores.forEach(score => {
                    console.log(`   - Trust Score: ${score.trust_score}, Grade: ${score.credit_grade}, Loan: ₹${score.loan_amount || 'N/A'}`);
                });
            }
        }
        
        // Show chat logs data
        console.log("\n💬 CHAT LOGS:");
        const { data: chats, error: chatsError } = await supabase
            .from('chat_logs')
            .select('*')
            .limit(5);
            
        if (chatsError) {
            console.log(`❌ Error: ${chatsError.message}`);
        } else {
            if (chats.length === 0) {
                console.log("No chat logs found");
            } else {
                chats.forEach(chat => {
                    console.log(`   - ${chat.message_type}: ${chat.message.substring(0, 50)}...`);
                });
            }
        }
        
    } catch (error) {
        console.log(`❌ Error displaying data: ${error.message}`);
    }
}

async function testAIIntegration() {
    console.log("\n🤖 TESTING AI INTEGRATION");
    console.log("=".repeat(40));
    
    try {
        const analysisService = require('./server/src/services/analysisService');
        
        console.log("Testing complete AI analysis flow...");
        console.log("Input: Tomato, Maharashtra");
        
        const result = await analysisService.generateAnalysis("Tomato", "Maharashtra", null);
        
        if (result && result.id) {
            console.log("✅ AI Integration Test Successful");
            console.log(`   Analysis ID: ${result.id}`);
            console.log(`   Crop: ${result.crop}`);
            console.log(`   Location: ${result.location}`);
            console.log(`   Trust Score: ${result.trust_score}`);
            console.log(`   Credit Rating: ${result.credit_rating}`);
            console.log(`   Loan Eligible: ${result.loan_eligible ? 'YES' : 'NO'}`);
            
            // Check if it was saved to database
            console.log("\n🔍 VERIFYING DATABASE SAVE:");
            const { data: savedData, error: savedError } = await supabase
                .from('crop_reports')
                .select('*')
                .eq('id', result.id)
                .single();
                
            if (savedError) {
                console.log(`❌ Error verifying save: ${savedError.message}`);
            } else {
                console.log("✅ Analysis successfully saved to database");
                console.log(`   Disease: ${savedData.disease}`);
                console.log(`   Confidence: ${(savedData.confidence * 100).toFixed(1)}%`);
                console.log(`   Risk Score: ${savedData.risk_score}`);
            }
            
            return true;
        } else {
            console.log("❌ AI Integration Test Failed");
            console.log("No result returned from analysis service");
            return false;
        }
        
    } catch (error) {
        console.log(`❌ AI Integration Test Failed: ${error.message}`);
        return false;
    }
}

async function main() {
    try {
        console.log("🔗 Environment Variables:");
        console.log(`   SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅' : '❌'}`);
        console.log(`   SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY ? '✅' : '❌'}`);
        
        // Step 1: Verify tables
        const tableResults = await verifyTables();
        
        // Step 2: Show sample data
        await showTableData();
        
        // Step 3: Test AI integration
        const integrationResult = await testAIIntegration();
        
        // Summary
        console.log("\n" + "=".repeat(60));
        console.log("VERIFICATION SUMMARY");
        console.log("=".repeat(60));
        
        const existingTables = Object.values(tableResults).filter(r => r.exists).length;
        const totalTables = Object.keys(tableResults).length;
        
        console.log(`\n📊 Database Tables: ${existingTables}/${totalTables} exist`);
        Object.entries(tableResults).forEach(([name, result]) => {
            const status = result.exists ? '✅' : '❌';
            const count = result.count ? ` (${result.count} records)` : '';
            console.log(`   ${status} ${name}${count}`);
        });
        
        console.log(`\n🤖 AI Integration: ${integrationResult ? '✅ Working' : '❌ Failed'}`);
        
        if (existingTables === totalTables && integrationResult) {
            console.log("\n🎉 DATABASE SETUP COMPLETE");
            console.log("✅ All tables exist");
            console.log("✅ AI integration working");
            console.log("✅ Ready for production deployment");
        } else {
            console.log("\n⚠️  SETUP INCOMPLETE");
            if (existingTables < totalTables) {
                console.log("❌ Some tables are missing");
                console.log("📝 Run the SQL in Supabase dashboard to create missing tables");
            }
            if (!integrationResult) {
                console.log("❌ AI integration needs troubleshooting");
            }
        }
        
    } catch (error) {
        console.error("❌ Verification failed:", error);
    }
}

// Run verification
main().catch(error => {
    console.error("Database verification failed:", error);
    process.exit(1);
});
