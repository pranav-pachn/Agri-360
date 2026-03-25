require('dotenv').config({ path: '../.env' });
const app = require('./app');
const aiService = require('./services/ai.service');
const tensorflowService = require('../../ai/crop-intelligence/tensorflow-service');

const PORT = process.env.PORT || 5000;

// Initialize TensorFlow service directly
async function initializeServices() {
  try {
    console.log('🧠 Pre-loading MobileNet model into memory (Cold Start Prevention)...');
    await tensorflowService.loadModel();
    
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
