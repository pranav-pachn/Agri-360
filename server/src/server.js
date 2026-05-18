require('dotenv').config({ path: '.env' });
const app = require('./app');
const aiService = require('./services/ai.service');
const analyticsService = require('./services/analyticsService');
const tensorflowService = require('../../ai/crop-intelligence/tensorflow-service');

const PORT = process.env.PORT || 5000;

// Initialize TensorFlow service directly
async function initializeServices() {
  try {
    console.log('🧠 Pre-loading MobileNet model into memory (Cold Start Prevention)...');
    await tensorflowService.loadModel();

    const analyticsStatus = await analyticsService.checkAnalyticsTableStatus();
    if (analyticsStatus.analyticsTableReady) {
      console.log('📊 Analytics schema check: analytics table is available.');
    } else if (analyticsStatus.reachable) {
      console.warn('⚠️ Analytics schema check: analytics table is missing in Supabase.');
      console.warn('   Run: database/migrations/007_bootstrap_analytics_from_farm_analysis.sql');
    } else {
      console.warn(`⚠️ Analytics schema check could not verify Supabase analytics table: ${analyticsStatus.message}`);
    }
    
    // Sync wrapper
    if (process.env.USE_TENSORFLOW === 'true') {
      aiService.tensorflowReady = true;
    }
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`🌾 AI Service: ${process.env.USE_TENSORFLOW === 'true' ? 'TensorFlow + Mock' : 'Enhanced Mock'}`);
    });
  } catch (error) {
    console.error('❌ Service initialization failed:', error);
    process.exit(1);
  }
}

initializeServices();
