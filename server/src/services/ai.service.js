const logger = require('../utils/logger');
const enhancedMockAI = require('../../../ai/crop-intelligence/enhanced-mock-service');
const tensorflowService = require('../../../ai/crop-intelligence/tensorflow-service');

class AIService {
    constructor() {
        this.useTensorFlow = process.env.USE_TENSORFLOW === 'true';
        this.tensorflowReady = false;
    }

    async analyzeCropImage(imageUrl, cropType, location) {
        logger.info(`🌾 AI Analysis for ${cropType} in ${location}`);
        
        // Check for real AI integration (future)
        if (process.env.AI_SERVICE_URL && imageUrl) {
            return await this.callRealAI(imageUrl, cropType, location);
        }
        
        // Try TensorFlow if enabled and available
        if (this.useTensorFlow) {
            try {
                const result = await tensorflowService.analyzeCropImage(imageUrl, cropType, location);
                logger.info('✅ TensorFlow analysis completed');
                return result;
            } catch (error) {
                logger.error('❌ TensorFlow analysis failed:', error);
                logger.info('🔄 Falling back to enhanced mock service');
            }
        }
        
        // Use enhanced mock service
        return await enhancedMockAI.analyzeCropImage(imageUrl, cropType, location);
    }
    
    async callRealAI(imageUrl, cropType, location) {
        // Integration with external AI service (future)
        try {
            logger.info(`🤖 Calling real AI service for ${cropType}`);
            const response = await fetch(process.env.AI_SERVICE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.AI_API_KEY}`
                },
                body: JSON.stringify({
                    image_url: imageUrl,
                    crop_type: cropType,
                    location: location
                })
            });
            
            const result = await response.json();
            logger.info('✅ Real AI service response received');
            return this.formatAIResponse(result);
        } catch (error) {
            logger.error('❌ AI Service Error:', error);
            logger.info('🔄 Falling back to enhanced mock service');
            return await enhancedMockAI.analyzeCropImage(imageUrl, cropType, location);
        }
    }
    
    formatAIResponse(aiResult) {
        return {
            diagnosis: aiResult.diagnosis,
            yield_prediction: aiResult.yield,
            sustainability_score: aiResult.sustainability,
            risk_assessment: aiResult.risk,
            recommendations: aiResult.recommendations,
            health_trend: aiResult.health_trend,
            location_analysis: aiResult.location_analysis,
            metadata: aiResult.metadata
        };
    }
    
    // Batch analysis for multiple images
    async analyzeBatch(imageUrls, cropType, location) {
        logger.info(`🔄 Batch analysis for ${imageUrls.length} images`);
        
        if (process.env.AI_SERVICE_URL && imageUrls.length > 0) {
            return await this.callRealAIBatch(imageUrls, cropType, location);
        }
        
        // Try TensorFlow batch if enabled
        if (this.useTensorFlow) {
            try {
                const result = await tensorflowService.analyzeBatch(imageUrls, cropType, location);
                logger.info('✅ TensorFlow batch analysis completed');
                return result;
            } catch (error) {
                logger.error('❌ TensorFlow batch analysis failed:', error);
            }
        }
        
        return await enhancedMockAI.analyzeBatch(imageUrls, cropType, location);
    }
    
    async callRealAIBatch(imageUrls, cropType, location) {
        try {
            const response = await fetch(process.env.AI_SERVICE_URL + '/batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.AI_API_KEY}`
                },
                body: JSON.stringify({
                    image_urls: imageUrls,
                    crop_type: cropType,
                    location: location
                })
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            logger.error('❌ Batch AI Service Error:', error);
            return await enhancedMockAI.analyzeBatch(imageUrls, cropType, location);
        }
    }

    // Initialize TensorFlow if requested
    async initializeTensorFlow() {
        if (this.useTensorFlow) {
            try {
                await tensorflowService.loadModel();
                this.tensorflowReady = true;
                logger.info('✅ TensorFlow service initialized');
            } catch (error) {
                logger.error('❌ TensorFlow initialization failed:', error);
                this.tensorflowReady = false;
            }
        }
    }
}

module.exports = new AIService();
