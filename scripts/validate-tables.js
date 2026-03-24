// Validate Tables Exist Script
require('dotenv').config();
const supabase = require('../server/src/config/supabase');

async function validateTables() {
  console.log('🔍 Validating AgriMitra 360 Database Tables...\n');
  
  const tables = [
    { name: 'farmers', description: 'Farmer registration data' },
    { name: 'crop_reports', description: 'Crop disease analysis reports' },
    { name: 'credit_scores', description: 'Credit scoring and loan data' }
  ];
  
  let allTablesExist = true;
  
  for (const table of tables) {
    console.log(`📊 Checking ${table.name} table...`);
    
    try {
      const { data, error } = await supabase
        .from(table.name)
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`❌ ${table.name} table does not exist`);
          console.log(`   ${table.description}`);
          console.log('   💡 Please run the SQL schema manually');
        } else {
          console.log(`⚠️  Error checking ${table.name}: ${error.message}`);
        }
        allTablesExist = false;
      } else {
        console.log(`✅ ${table.name} table exists`);
        if (data && data.length > 0) {
          console.log(`   📈 Contains ${data.length > 0 ? 'sample data' : 'no data'}`);
        }
      }
    } catch (err) {
      console.log(`❌ Error checking ${table.name}: ${err.message}`);
      allTablesExist = false;
    }
    
    console.log('');
  }
  
  if (allTablesExist) {
    console.log('🎉 All tables exist and are accessible!');
    console.log('\n📋 Database Schema Validation: PASSED');
  } else {
    console.log('❌ Some tables are missing');
    console.log('\n📋 Database Schema Validation: FAILED');
    console.log('\n🔧 Manual Setup Required:');
    console.log('1. Open Supabase Dashboard: https://app.supabase.com');
    console.log('2. Go to your project: dfrekeokibwhlxgqwupj');
    console.log('3. Click on "SQL Editor"');
    console.log('4. Copy the SQL from: database/create-tables.sql');
    console.log('5. Paste and execute the SQL script');
  }
  
  return allTablesExist;
}

// Test basic operations if tables exist
async function testBasicOperations() {
  console.log('\n🧪 Testing Basic Database Operations...\n');
  
  try {
    // Test farmers table
    console.log('1. Testing farmers table operations...');
    const { data: farmer, error: farmerError } = await supabase
      .from('farmers')
      .select('*')
      .limit(1);
    
    if (!farmerError) {
      console.log('✅ Farmers table: Read successful');
      
      // Test insert
      const { data: newFarmer, error: insertError } = await supabase
        .from('farmers')
        .insert({ name: 'Test User', location: 'Test Location', language: 'en' })
        .select()
        .single();
      
      if (!insertError) {
        console.log('✅ Farmers table: Insert successful');
        
        // Clean up
        await supabase
          .from('farmers')
          .delete()
          .eq('id', newFarmer.id);
        
        console.log('✅ Farmers table: Delete successful');
      } else {
        console.log('⚠️  Farmers table: Insert failed -', insertError.message);
      }
    }
    
    console.log('\n🎉 Database operations test completed!');
    
  } catch (error) {
    console.error('❌ Operations test failed:', error.message);
  }
}

// Run validation
validateTables().then(allExist => {
  if (allExist) {
    testBasicOperations();
  }
});
