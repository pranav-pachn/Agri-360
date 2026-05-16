// Execute migration to add analytics table
require('dotenv').config({ path: '.env' });
const fs = require('fs');
const path = require('path');

// Load Supabase config from server directory
const supabaseConfig = require(path.join(__dirname, '../server/src/config/supabase'));
const supabase = supabaseConfig;

async function executeMigration() {
  try {
    console.log('🔄 Executing migration: 001_add_analytics_table.sql\n');
    
    // Read migration SQL
    const migrationSql = fs.readFileSync('database/migrations/001_add_analytics_table.sql', 'utf8');
    
    // Split SQL into individual statements (by semicolon)
    const statements = migrationSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);
    
    let successCount = 0;
    let skipCount = 0;
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      
      try {
        console.log(`⏳ [${i + 1}/${statements.length}] Executing: ${statement.substring(0, 60)}${statement.length > 60 ? '...' : ''}`);
        
        // Use Supabase admin API to execute raw SQL
        const { data, error } = await supabase.rpc('sql', { query: statement });
        
        if (error) {
          if (error.message.includes('already exists')) {
            console.log(`✓ SkipPED (already exists)\n`);
            skipCount++;
          } else {
            console.log(`✗ FAILED: ${error.message}\n`);
          }
        } else {
          console.log(`✅ SUCCESS\n`);
          successCount++;
        }
      } catch (err) {
        console.log(`✗ ERROR: ${err.message}\n`);
      }
    }
    
    console.log('\n✅ Migration Complete!');
    console.log(`   ✓ ${successCount} statements executed successfully`);
    console.log(`   ↷ ${skipCount} statements skipped (already exist)`);
    console.log('\n🎉 Analytics table should now be available!');
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

executeMigration();
