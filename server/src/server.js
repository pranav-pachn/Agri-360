require('dotenv').config({ path: '../.env' });
const app = require('./app');
const aiService = require('./services/ai.service');

const PORT = process.env.PORT || 5000;

// Initialize TensorFlow if enabled
async function initializeServices() {
  try {
    if (process.env.USE_TENSORFLOW === 'true') {
      console.log('🧠 Initializing TensorFlow service...');
      await aiService.initializeTensorFlow();
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
