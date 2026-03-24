// Database Connection Test Script
require('dotenv').config({ path: '../.env' });
const supabase = require('../server/src/config/supabase');

async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection...\n');
  
  try {
    // Test 1: Basic Connection
    console.log('1. Testing basic Supabase connection...');
    const { data, error } = await supabase.from('farm_analysis').select('count').single();
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      return false;
    }
    console.log('✅ Database connection successful');
    
    // Test 2: Table Schema Validation
    console.log('\n2. Validating table schema...');
    const { data: sampleData, error: sampleError } = await supabase
      .from('farm_analysis')
      .select('*')
      .limit(1);
    
    if (sampleError) {
      console.log('❌ Schema validation failed:', sampleError.message);
      return false;
    }
    
    if (sampleData && sampleData.length > 0) {
      const columns = Object.keys(sampleData[0]);
      const expectedColumns = ['id', 'crop', 'location', 'health', 'risk', 'yield', 'trust_score', 'created_at'];
      
      const missingColumns = expectedColumns.filter(col => !columns.includes(col));
      const extraColumns = columns.filter(col => !expectedColumns.includes(col));
      
      if (missingColumns.length > 0) {
        console.log('❌ Missing columns:', missingColumns);
        return false;
      }
      
      if (extraColumns.length > 0) {
        console.log('⚠️  Extra columns found:', extraColumns);
      }
      
      console.log('✅ Schema validation passed');
      console.log('📋 Current columns:', columns);
    } else {
      console.log('ℹ️  Table is empty, but schema exists');
    }
    
    // Test 3: Basic CRUD Operations
    console.log('\n3. Testing CRUD operations...');
    
    // Test Insert
    const testRecord = {
      crop: 'Test Rice',
      location: 'Test Location',
      health: 85,
      risk: 0.35,
      yield: 7.5,
      trust_score: 750
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('farm_analysis')
      .insert([testRecord])
      .select()
      .single();
    
    if (insertError) {
      console.log('❌ Insert operation failed:', insertError.message);
      return false;
    }
    console.log('✅ Insert operation successful');
    
    // Test Select
    const { data: selectData, error: selectError } = await supabase
      .from('farm_analysis')
      .select('*')
      .eq('id', insertData.id)
      .single();
    
    if (selectError) {
      console.log('❌ Select operation failed:', selectError.message);
      return false;
    }
    console.log('✅ Select operation successful');
    
    // Test Update
    const { data: updateData, error: updateError } = await supabase
      .from('farm_analysis')
      .update({ health: 90 })
      .eq('id', insertData.id)
      .select()
      .single();
    
    if (updateError) {
      console.log('❌ Update operation failed:', updateError.message);
      return false;
    }
    console.log('✅ Update operation successful');
    
    // Test Delete
    const { error: deleteError } = await supabase
      .from('farm_analysis')
      .delete()
      .eq('id', insertData.id);
    
    if (deleteError) {
      console.log('❌ Delete operation failed:', deleteError.message);
      return false;
    }
    console.log('✅ Delete operation successful');
    
    console.log('\n🎉 All database tests passed!');
    return true;
    
  } catch (error) {
    console.log('❌ Database test failed:', error.message);
    return false;
  }
}

// Run the test
testDatabaseConnection().then(success => {
  process.exit(success ? 0 : 1);
});
