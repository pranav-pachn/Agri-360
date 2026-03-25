/**
 * TensorFlow.js Service for AgriMitra 360
 * Browser-compatible version that works without native compilation
 */

const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const sharp = require('sharp');
const axios = require('axios');
const { runInference, runTensorflow } = require('./inference');

const FALLBACK_ESTIMATED_LOSS_BY_SEVERITY = {
    None: '< 5%',
    Low: '5–10%',
    Medium: '10–20%',
    High: '25–40%',
    Critical: '40–70%',
    Unknown: '10–20%'
};

class TensorFlowService {
    constructor() {
        this.model = null;
        this.isLoaded = false;
        this.loadAttempts = 0;
        this.maxLoadAttempts = 3;
    }

    /**
     * Load MobileNet model for image classification (Iterative version)
     */
    async loadModel() {
        for (let i = 0; i < this.maxLoadAttempts; i++) {
            try {
                console.log(`🧠 Loading MobileNet model... Attempt ${i + 1}`);
                this.model = await mobilenet.load();
                this.isLoaded = true;
                console.log('✅ MobileNet model loaded successfully');
                return true;
            } catch (error) {
                console.error(`❌ Failed to load MobileNet model (Attempt ${i + 1}):`, error.message);
                console.log("Retrying...");
            }
        }
        
        console.log('⚠️ Falling back to enhanced mock service');
        return false;
    }

    /**
     * Download and process image into a tensor (Pure JS version, no native bindings needed)
     */
    async loadImageAsTensor(imageUrl) {
        console.log(`📥 Downloading image: ${imageUrl}`);
        try {
            // First, get the raw image buffer
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data);

            // Process with sharp: resize to 224x224 and extract RAW RGB pixel data
            const { data, info } = await sharp(imageBuffer)
                .resize(224, 224)
                .removeAlpha() // Ensure 3 channels (RGB), drop alpha
                .raw()
                .toBuffer({ resolveWithObject: true });

            // Create a 3D tensor using pure tfjs from the raw Uint8Array
            const tensor = tf.tensor3d(new Uint8Array(data), [224, 224, 3], 'int32')
                .expandDims(0)
                .toFloat();
            
            return tensor;
        } catch (error) {
            console.error('❌ Failed to load or process image for tensor:', error.message);
            throw error;
        }
    }

    /**
     * Analyze crop image using TensorFlow.js
     */
    async analyzeCropImage(imageUrl, cropType, location) {
        console.log(`🌾 TensorFlow Analysis for ${cropType} in ${location}`);
        
        // Ensure model is loaded
        if (!this.isLoaded) {
            const modelLoaded = await this.loadModel();
            if (!modelLoaded) {
                // Fallback to enhanced mock service
                const enhancedMockAI = require('./enhanced-mock-service');
                return await enhancedMockAI.analyzeCropImage(imageUrl, cropType, location);
            }
        }

        let imageTensor = null;

        try {
            console.log('📸 Processing real image with TensorFlow & sharp...');
            
            if (!imageUrl) {
                throw new Error("No image URL provided");
            }

            // Convert actual image to tensor
            imageTensor = await this.loadImageAsTensor(imageUrl);
            
            // Get predictions from MobileNet
            const predictions = await this.model.classify(imageTensor);
            console.log('🔍 TensorFlow predictions:', predictions);
            
            // Convert TensorFlow predictions to agricultural analysis
            const agriculturalAnalysis = this.convertPredictionsToAnalysis(
                predictions, 
                cropType, 
                location
            );
            
            return agriculturalAnalysis;
            
        } catch (error) {
            console.error('❌ TensorFlow analysis error:', error);

            // Fallback to enhanced mock service
            const enhancedMockAI = require('./enhanced-mock-service');
            return await enhancedMockAI.analyzeCropImage(imageUrl, cropType, location);
        } finally {
            // Clean up tensor memory guaranteed
            if (imageTensor) {
                imageTensor.dispose();
                console.log('🧹 Tensor memory cleaned up');
            }
        }
    }

    /**
     * Convert TensorFlow predictions to agricultural analysis using the AI Inference Engine
     */
    convertPredictionsToAnalysis(predictions, cropType, location) {
        console.log('🧠 Running AI Inference Engine on raw TensorFlow predictions...');

        // Step 1: Raw AI
        const rawAI = runTensorflow(predictions);
        
        // Step 2 + 3: Agricultural AI + Decision AI
        const inferred = runInference(predictions, cropType, location);

        console.log(`✅ Inference result: ${inferred.disease} (${(inferred.confidence * 100).toFixed(1)}%) — ${inferred.severity} severity`);

        const actualCrop = inferred.crop;
        const normalizedSeverity = inferred.severity || 'Unknown';
        const estimatedLoss = inferred.estimatedLoss || FALLBACK_ESTIMATED_LOSS_BY_SEVERITY[normalizedSeverity] || FALLBACK_ESTIMATED_LOSS_BY_SEVERITY.Unknown;
        
        return {
            diagnosis: {
                disease: inferred.disease,
                confidence: Number(inferred.confidence.toFixed(4)),
                severity: inferred.severity,
                health_score: inferred.health_score,
                tensorflow_prediction: rawAI.label || inferred.raw_label,
                tensorflow_confidence: Number((rawAI.probability || inferred.raw_probability || 0).toFixed(4)),
                advice: inferred.advice,
                treatment: inferred.treatment
            },
            yield_prediction: {
                predicted_yield: this.calculateYieldFromHealth(inferred.health_score, actualCrop),
                unit: 'tons/hectare',
                confidence: Number(inferred.confidence.toFixed(4))
            },
            sustainability_score: this.calculateSustainability(inferred.health_score, location),
            risk_assessment: this.calculateRisk(inferred.health_score),
            recommendations: [
                {
                    type: inferred.severity === 'None' ? 'Preventive' : 'Treatment',
                    action: inferred.advice,
                    urgency: inferred.severity === 'Critical' ? 'Immediate' : inferred.severity === 'None' ? 'Low' : 'High',
                    treatment: inferred.treatment,
                    detected_by: 'TensorFlow + AI Inference Engine',
                    raw_label: inferred.raw_label,
                    alternatives: inferred.alternatives
                }
            ],
            health_trend: this.generateHealthTrend(inferred.health_score),
            location_analysis: {
                location: location,
                tensorflow_detected: rawAI.label || inferred.raw_label,
                agricultural_interpretation: inferred.disease,
                source: inferred.source
            },
            decision_intelligence: {
                severity: normalizedSeverity,
                risk_factor: inferred.riskFactor || null,
                primary_threat: inferred.primaryThreat || null,
                estimated_loss: estimatedLoss,
                urgency: inferred.urgency || null,
                crop_advisory: inferred.cropAdvisory || null,
                recommended_action: inferred.recommendedAction || inferred.advice
            },
            pipeline: inferred.pipeline,
            metadata: {
                analysis_timestamp: new Date().toISOString(),
                crop_type: actualCrop,
                ai_version: 'TensorFlow.js + AI Inference Engine v1.0',
                processing_time_ms: 0,
                model_used: 'MobileNetV2',
                fallback_used: false,
                ai_source: "tensorflow",
                pipeline_flow: 'Raw AI -> Agricultural AI -> Decision AI'
            }
        };
    }



    /**
     * Calculate yield based on health score and crop type
     */
    calculateYieldFromHealth(healthScore, cropType) {
        const cropBaseYields = {
            'Tomato': 18.5,
            'Wheat': 22.3,
            'Rice': 20.1,
            'Corn': 25.8,
            'Potato': 19.2,
            'Cotton': 16.8
        };

        const baseYield = cropBaseYields[cropType] || 20.0;
        const healthFactor = healthScore / 100;
        const deterministicVariation = 0.95 + (healthScore / 2000); // 0.95 to 1.0 based on health

        return parseFloat((baseYield * healthFactor * deterministicVariation).toFixed(1));
    }

    /**
     * Calculate sustainability score
     */
    calculateSustainability(healthScore, location) {
        if (!location) return Math.min(100, healthScore);
        const locationBonus = location.toLowerCase().includes('punjab') ? 5 : 
                            location.toLowerCase().includes('gujarat') ? 3 : 0;
        
        return Math.max(0, Math.min(100, healthScore + locationBonus));
    }

    /**
     * Calculate risk assessment
     */
    calculateRisk(healthScore) {
        return parseFloat(((100 - healthScore) / 100 * 0.8).toFixed(2));
    }

    /**
     * Generate health trend data
     */
    generateHealthTrend(currentHealth) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        return months.map((month, index) => ({
            date: `2024-${String(index + 1).padStart(2, '0')}`,
            score: Math.max(0, Math.min(100, currentHealth + (currentHealth > 80 ? 2 : currentHealth > 60 ? 0 : -3) - (index * 2))),
            label: month,
            prediction: index > 3 ? 'Projected' : 'Actual'
        }));
    }



    /**
     * Batch analysis with TensorFlow
     */
    async analyzeBatch(imageUrls, cropType, location) {
        console.log(`🔄 TensorFlow batch analysis for ${imageUrls.length} images`);
        
        const results = await Promise.all(
            imageUrls.map(url => this.analyzeCropImage(url, cropType, location))
        );
        
        return {
            batch_id: `tf_batch_${Date.now()}`,
            total_analyzed: results.length,
            results,
            summary: this.generateBatchSummary(results),
            tensorflow_used: this.isLoaded
        };
    }

    /**
     * Generate batch summary
     */
    generateBatchSummary(results) {
        const avgHealth = results.reduce((sum, r) => sum + r.diagnosis.health_score, 0) / results.length;
        const avgYield = results.reduce((sum, r) => sum + r.yield_prediction.predicted_yield, 0) / results.length;
        
        return {
            average_health_score: parseFloat(avgHealth.toFixed(1)),
            average_yield_prediction: parseFloat(avgYield.toFixed(1)),
            tensorflow_confidence_avg: results.reduce((sum, r) => sum + (r.diagnosis.tensorflow_confidence || 0), 0) / results.length,
            recommendations_count: results.reduce((sum, r) => sum + r.recommendations.length, 0)
        };
    }
}

module.exports = new TensorFlowService();
