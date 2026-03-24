// API Endpoints Test Script
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAPIEndpoints() {
  console.log('🚀 Testing API Endpoints...\n');
  
  try {
    // Test 1: Health Check
    console.log('1. Testing health check endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    
    if (healthResponse.status === 200 && healthResponse.data.status === 'ok') {
      console.log('✅ Health check passed');
      console.log('📄 Response:', healthResponse.data);
    } else {
      console.log('❌ Health check failed');
      return false;
    }
    
    // Test 2: Create Analysis
    console.log('\n2. Testing crop analysis endpoint...');
    const analysisData = {
      crop: 'Rice',
      location: 'Andhra Pradesh'
    };
    
    const createResponse = await axios.post(`${BASE_URL}/api/analyze`, analysisData);
    
    if (createResponse.status === 201) {
      console.log('✅ Analysis creation successful');
      console.log('📊 Analysis result:', createResponse.data);
      const analysisId = createResponse.data.id;
      
      // Test 3: Get All Analyses
      console.log('\n3. Testing get all analyses endpoint...');
      const allAnalysesResponse = await axios.get(`${BASE_URL}/api/analysis`);
      
      if (allAnalysesResponse.status === 200) {
        console.log('✅ Get all analyses successful');
        console.log('📈 Total analyses:', allAnalysesResponse.data.length);
      } else {
        console.log('❌ Get all analyses failed');
        return false;
      }
      
      // Test 4: Get Specific Analysis
      console.log('\n4. Testing get specific analysis endpoint...');
      const specificAnalysisResponse = await axios.get(`${BASE_URL}/api/analysis/${analysisId}`);
      
      if (specificAnalysisResponse.status === 200) {
        console.log('✅ Get specific analysis successful');
        console.log('📋 Analysis data:', specificAnalysisResponse.data);
      } else {
        console.log('❌ Get specific analysis failed');
        return false;
      }
      
      // Test 5: Get Trust Score
      console.log('\n5. Testing trust score endpoint...');
      const trustScoreResponse = await axios.get(`${BASE_URL}/api/trust-score/${analysisId}`);
      
      if (trustScoreResponse.status === 200) {
        console.log('✅ Trust score endpoint successful');
        console.log('💰 Trust score:', trustScoreResponse.data.trust_score);
      } else {
        console.log('❌ Trust score endpoint failed');
        return false;
      }
      
      // Test 6: Get Explainability
      console.log('\n6. Testing explainability endpoint...');
      const explainabilityResponse = await axios.get(`${BASE_URL}/api/trust-score/${analysisId}/explain`);
      
      if (explainabilityResponse.status === 200) {
        console.log('✅ Explainability endpoint successful');
        console.log('🔍 Explainability data:', explainabilityResponse.data);
      } else {
        console.log('❌ Explainability endpoint failed');
        return false;
      }
      
      // Test 7: Error Handling
      console.log('\n7. Testing error handling...');
      try {
        await axios.post(`${BASE_URL}/api/analyze`, { crop: '' });
        console.log('❌ Error handling test failed - should have returned 400');
        return false;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.log('✅ Error handling working correctly');
          console.log('🚫 Error response:', error.response.data);
        } else {
          console.log('❌ Error handling test failed:', error.message);
          return false;
        }
      }
      
    } else {
      console.log('❌ Analysis creation failed');
      console.log('📄 Response:', createResponse.data);
      return false;
    }
    
    console.log('\n🎉 All API tests passed!');
    return true;
    
  } catch (error) {
    console.log('❌ API test failed:', error.message);
    if (error.response) {
      console.log('📄 Error response:', error.response.data);
      console.log('🔢 Status:', error.response.status);
    }
    return false;
  }
}

// Check if server is running
async function checkServerStatus() {
  try {
    await axios.get(`${BASE_URL}/health`);
    return true;
  } catch (error) {
    console.log('❌ Server is not running on', BASE_URL);
    console.log('💡 Please start the server with: cd server && npm run dev');
    return false;
  }
}

// Run the tests
async function runTests() {
  console.log('🧪 AgriMitra 360 - API Testing Suite\n');
  
  const serverRunning = await checkServerStatus();
  if (!serverRunning) {
    process.exit(1);
  }
  
  const success = await testAPIEndpoints();
  process.exit(success ? 0 : 1);
}

runTests();
