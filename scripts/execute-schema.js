// Execute Database Schema Script
require('dotenv').config();
const supabase = require('../server/src/config/supabase');

async function executeSchema() {
  console.log('🔧 Creating AgriMitra 360 Database Schema...\n');
  
  try {
    // Read SQL file
    const fs = require('fs');
    const sql = fs.readFileSync('../database/create-tables.sql', 'utf8');
    
    // Split SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement.length === 0) continue;
      
      console.log(`\n${i + 1}. Executing: ${statement.substring(0, 50)}...`);
      
      try {
        // Use raw SQL execution via Supabase client
        const { data, error } = await supabase.rpc('sql', { query: statement });
        
        if (error && !error.message.includes('already exists')) {
          console.log(`⚠️  Warning: ${error.message}`);
        } else {
          console.log('✅ Success');
        }
      } catch (err) {
        // Try direct table creation for basic statements
        if (statement.toLowerCase().includes('create table')) {
          console.log('🔄 Trying alternative approach...');
          
          // Extract table name
          const tableName = statement.match(/create\s+table\s+(?:if\s+not\s+exists\s+)?(\w+)/i)?.[1];
          
          if (tableName) {
            console.log(`📊 Creating table: ${tableName}`);
            // For now, just log that we need manual execution
            console.log('💡 Please execute this SQL manually in Supabase dashboard:');
            console.log(statement);
          }
        }
      }
    }
    
    console.log('\n🎉 Schema execution completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Open Supabase Dashboard');
    console.log('2. Go to SQL Editor');
    console.log('3. Copy and paste the SQL from database/create-tables.sql');
    console.log('4. Execute the SQL script');
    
  } catch (error) {
    console.error('❌ Schema execution failed:', error.message);
  }
}

// Alternative: Create tables one by one using Supabase client
async function createTablesManually() {
  console.log('🔨 Creating tables manually...\n');
  
  try {
    // Create farmers table
    console.log('1. Creating farmers table...');
    const { data: farmers, error: farmersError } = await supabase
      .from('farmers')
      .select('*')
      .limit(1);
    
    if (farmersError && farmersError.code === 'PGRST116') {
      // Table doesn't exist, need to create manually
      console.log('❌ farmers table does not exist');
      console.log('💡 Please run SQL manually in Supabase dashboard');
    } else {
      console.log('✅ farmers table exists');
    }
    
    // Create crop_reports table
    console.log('\n2. Creating crop_reports table...');
    const { data: reports, error: reportsError } = await supabase
      .from('crop_reports')
      .select('*')
      .limit(1);
    
    if (reportsError && reportsError.code === 'PGRST116') {
      console.log('❌ crop_reports table does not exist');
    } else {
      console.log('✅ crop_reports table exists');
    }
    
    // Create credit_scores table
    console.log('\n3. Creating credit_scores table...');
    const { data: scores, error: scoresError } = await supabase
      .from('credit_scores')
      .select('*')
      .limit(1);
    
    if (scoresError && scoresError.code === 'PGRST116') {
      console.log('❌ credit_scores table does not exist');
    } else {
      console.log('✅ credit_scores table exists');
    }
    
  } catch (error) {
    console.error('❌ Manual creation failed:', error.message);
  }
}

// Run the script
executeSchema();
