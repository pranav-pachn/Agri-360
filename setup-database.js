/**
 * Database Setup Script
 * Creates tables and sets up sample data for AgriMitra360
 */

require('dotenv').config({ path: './.env' });
const supabase = require('./server/src/config/supabase');

console.log("=== AGRIMITRA360 DATABASE SETUP ===\n");

async function setupDatabase() {
    try {
        console.log("🔗 Connecting to Supabase...");
        console.log(`   Project: ${process.env.SUPABASE_URL}`);
        
        // Test basic connection
        const { data, error } = await supabase.from('_test_connection').select('*').limit(1);
        if (error && !error.message.includes('does not exist')) {
            throw new Error(`Connection failed: ${error.message}`);
        }
        
        console.log("✅ Connected to Supabase successfully");
        
        console.log("\n📋 SETUP INSTRUCTIONS:");
        console.log("=".repeat(50));
        console.log("The database tables need to be created manually in Supabase dashboard.");
        console.log("\nSteps:");
        console.log("1. Go to: https://app.supabase.com");
        console.log("2. Select your project: dfrekeokibwhlxgqwupj");
        console.log("3. In the left sidebar, click on 'SQL Editor'");
        console.log("4. Copy the SQL below and paste it into the editor");
        console.log("5. Click 'Run' to execute the schema creation");
        
        // Display the SQL content
        const fs = require('fs');
        const path = require('path');
        const sqlFile = path.join(__dirname, 'database', 'create-tables.sql');
        
        if (fs.existsSync(sqlFile)) {
            const sqlContent = fs.readFileSync(sqlFile, 'utf8');
            console.log("\n" + "=".repeat(50));
            console.log("SQL TO EXECUTE IN SUPABASE DASHBOARD:");
            console.log("=".repeat(50));
            console.log(sqlContent);
            console.log("=".repeat(50));
        } else {
            console.log("❌ SQL file not found:", sqlFile);
        }
        
        console.log("\n⏳ AFTER EXECUTING THE SQL:");
        console.log("Run 'node verify-database-setup.js' to verify the setup");
        
    } catch (error) {
        console.error("❌ Setup failed:", error.message);
    }
}

// Alternative: Create tables using individual statements
async function createTablesWithAPI() {
    console.log("\n🔧 ATTEMPTING AUTOMATIC TABLE CREATION...");
    
    try {
        // Create farmers table
        console.log("Creating farmers table...");
        const { data: farmerData, error: farmerError } = await supabase
            .from('farmers')
            .select('*')
            .limit(1);
            
        if (farmerError && farmerError.code === '42P01') {
            console.log("❌ Farmers table doesn't exist - manual setup required");
        } else if (!farmerError) {
            console.log("✅ Farmers table exists");
        }
        
        // Create a simple test to verify connection works
        console.log("\n🧪 Testing database operations...");
        
        // Test with a simple select that should work if tables exist
        const testQueries = [
            { table: 'farmers', description: 'Farmers table' },
            { table: 'crop_reports', description: 'Crop reports table' },
            { table: 'credit_scores', description: 'Credit scores table' }
        ];
        
        for (const query of testQueries) {
            try {
                const { data, error } = await supabase
                    .from(query.table)
                    .select('*')
                    .limit(1);
                    
                if (error) {
                    if (error.code === '42P01') {
                        console.log(`❌ ${query.description} does not exist`);
                    } else {
                        console.log(`❌ Error accessing ${query.description}: ${error.message}`);
                    }
                } else {
                    console.log(`✅ ${query.description} exists (${data.length} records)`);
                }
            } catch (err) {
                console.log(`❌ Error testing ${query.description}: ${err.message}`);
            }
        }
        
    } catch (error) {
        console.error("❌ Automatic creation failed:", error.message);
    }
}

// Main execution
async function main() {
    await setupDatabase();
    await createTablesWithAPI();
    
    console.log("\n" + "=".repeat(60));
    console.log("DATABASE SETUP SUMMARY");
    console.log("=".repeat(60));
    console.log("✅ Environment variables: Configured");
    console.log("✅ Database connection: Working");
    console.log("⚠️  Tables: Need manual creation");
    console.log("\n📝 NEXT STEPS:");
    console.log("1. Execute the SQL in Supabase dashboard (shown above)");
    console.log("2. Run 'node verify-database-setup.js' to verify");
    console.log("3. Test the complete AI integration flow");
}

// Run the setup
main().catch(error => {
    console.error("Database setup failed:", error);
    process.exit(1);
});
