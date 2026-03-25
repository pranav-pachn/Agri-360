/**
 * Enhanced Mock AI Service for AgriMitra 360
 * This replaces TensorFlow dependency with intelligent rule-based analysis
 * Perfect for hackathon demonstration and production MVP
 */

class EnhancedMockAIService {
    constructor() {
        this.cropProfiles = {
            'Tomato': { 
                baseHealth: 75, 
                diseases: ['Early Blight', 'Leaf Spot', 'Powdery Mildew', 'Blossom End Rot'],
                avgYield: 18.5,
                sustainabilityBase: 70,
                colorIndicators: { healthy: '#4CAF50', warning: '#FF9800', danger: '#F44336' }
            },
            'Wheat': { 
                baseHealth: 82, 
                diseases: ['Rust', 'Powdery Mildew', 'Septoria', 'Fusarium'],
                avgYield: 22.3,
                sustainabilityBase: 78,
                colorIndicators: { healthy: '#8BC34A', warning: '#FFC107', danger: '#FF5722' }
            },
            'Rice': { 
                baseHealth: 78, 
                diseases: ['Blast', 'Bacterial Leaf Blight', 'Sheath Blight', 'Tungro'],
                avgYield: 20.1,
                sustainabilityBase: 72,
                colorIndicators: { healthy: '#009688', warning: '#FF9800', danger: '#D32F2F' }
            },
            'Corn': { 
                baseHealth: 88, 
                diseases: ['Northern Corn Leaf Blight', 'Gray Leaf Spot', 'Common Rust', 'Ear Rot'],
                avgYield: 25.8,
                sustainabilityBase: 80,
                colorIndicators: { healthy: '#4CAF50', warning: '#FFC107', danger: '#F44336' }
            },
            'Potato': { 
                baseHealth: 80, 
                diseases: ['Late Blight', 'Early Blight', 'Black Scurf', 'Potato Virus Y'],
                avgYield: 19.2,
                sustainabilityBase: 75,
                colorIndicators: { healthy: '#8BC34A', warning: '#FF9800', danger: '#D32F2F' }
            },
            'Cotton': { 
                baseHealth: 76, 
                diseases: ['Boll Rot', 'Verticillium Wilt', 'Aphids', 'Whitefly'],
                avgYield: 16.8,
                sustainabilityBase: 68,
                colorIndicators: { healthy: '#4CAF50', warning: '#FF9800', danger: '#F44336' }
            }
        };

        this.locationFactors = {
            'Punjab': { factor: 0.1, climate: 'Irrigated', soil: 'Alluvial' },
            'Gujarat': { factor: 0.05, climate: 'Semi-arid', soil: 'Black cotton' },
            'Maharashtra': { factor: -0.05, climate: 'Variable', soil: 'Red laterite' },
            'Rajasthan': { factor: -0.1, climate: 'Arid', soil: 'Sandy' },
            'Uttar Pradesh': { factor: 0.08, climate: 'Humid', soil: 'Alluvial' },
            'Madhya Pradesh': { factor: 0.02, climate: 'Moderate', soil: 'Black cotton' },
            'Karnataka': { factor: 0.06, climate: 'Tropical', soil: 'Red loamy' }
        };
    }

    /**
     * Enhanced crop analysis without TensorFlow dependencies
     */
    async analyzeCropImage(imageUrl, cropType, location) {
        console.log(`🌾 Enhanced AI Analysis for ${cropType} in ${location}`);
        
        const profile = this.cropProfiles[cropType] || this.cropProfiles['Tomato'];
        const locationData = this.getLocationData(location);
        
        // Generate intelligent analysis
        const healthScore = this.calculateHealthScore(profile, locationData);
        const disease = this.detectDisease(profile, healthScore);
        const yieldPrediction = this.predictYield(profile, healthScore, locationData);
        const sustainability = this.calculateSustainability(profile, locationData);
        const risk = this.assessRisk(healthScore, locationData);
        
        return {
            diagnosis: {
                disease: disease.name,
                confidence: disease.confidence,
                severity: disease.severity,
                health_score: healthScore,
                color_indicator: profile.colorIndicators[this.getHealthLevel(healthScore)]
            },
            yield_prediction: {
                predicted_yield: yieldPrediction,
                unit: 'tons/hectare',
                confidence: this.calculateConfidence(healthScore, locationData.factor)
            },
            sustainability_score: sustainability,
            risk_assessment: risk,
            recommendations: this.generateRecommendations(disease, cropType, healthScore),
            health_trend: this.generateHealthTrend(healthScore),
            location_analysis: {
                location: location,
                climate: locationData.climate,
                soil: locationData.soil,
                suitability: this.calculateSuitability(cropType, locationData)
            },
            metadata: {
                analysis_timestamp: new Date().toISOString(),
                crop_type: cropType,
                ai_version: 'Enhanced Mock v2.0',
                processing_time_ms: 10,
                fallback_used: true,
                ai_source: "mock"
            }
        };
    }

    calculateHealthScore(profile, locationData) {
        const baseHealth = profile.baseHealth;
        const locationFactor = locationData.factor * 10; // Convert to health points
        const deterministicVariation = (baseHealth > 80 ? 5 : baseHealth > 60 ? 0 : -5); // Deterministic based on health
        
        return Math.max(0, Math.min(100, baseHealth + locationFactor + deterministicVariation));
    }

    detectDisease(profile, healthScore) {
        const isHealthy = healthScore > 75;
        
        if (isHealthy) {
            return {
                name: 'None Detected',
                confidence: Number((0.97 + (healthScore > 85 ? 0.02 : 0)).toFixed(4)),
                severity: 'None',
                treatment_priority: 'Low'
            };
        }
        
        const diseaseIndex = Math.floor((100 - healthScore) / 25) % profile.diseases.length;
        const disease = profile.diseases[diseaseIndex];
        const severity = healthScore > 60 ? 'Mild' : healthScore > 40 ? 'Moderate' : 'Severe';
        
        return {
            name: disease,
            confidence: Number((0.85 + (100 - healthScore) / 200).toFixed(4)),
            severity,
            treatment_priority: severity === 'Severe' ? 'Immediate' : severity === 'Moderate' ? 'High' : 'Medium'
        };
    }

    predictYield(profile, healthScore, locationData) {
        const baseYield = profile.avgYield;
        const healthFactor = healthScore / 100;
        const locationFactor = 1 + locationData.factor;
        const deterministicVariation = 0.95 + (healthScore / 1000); // 0.95 to 1.05 based on health
        
        const predictedYield = baseYield * healthFactor * locationFactor * deterministicVariation;
        return parseFloat(predictedYield.toFixed(1));
    }

    calculateSustainability(profile, locationData) {
        // Use enhanced sustainability service for data-driven scoring
        const sustainabilityService = require('../../server/src/services/sustainability.service');
        const result = sustainabilityService.calculateSustainability(
            Object.keys(this.cropProfiles).find(key => this.cropProfiles[key].baseHealth === profile.baseHealth) || 'Tomato',
            locationData.location || 'Unknown'
        );
        
        return result.score || 70; // Fallback to base sustainability
    }

    assessRisk(healthScore, locationData) {
        const healthRisk = (100 - healthScore) / 100;
        const locationRisk = Math.abs(locationData.factor);
        const deterministicRisk = (100 - healthScore) / 500; // Deterministic risk based on health
        
        return parseFloat((healthRisk + locationRisk + deterministicRisk).toFixed(2));
    }

    generateRecommendations(disease, cropType, healthScore) {
        if (disease.name === 'None Detected') {
            return [
                {
                    type: 'Preventive',
                    action: 'Continue current nutrient schedule',
                    urgency: 'Low',
                    product: 'NPK 20-20-20 fertilizer',
                    dosage: '50kg/hectare',
                    frequency: 'Monthly during growing season'
                }
            ];
        }

        // Disease-specific recommendations
        const diseaseTreatments = {
            'Early Blight': [
                {
                    type: 'Fungicide',
                    product: 'Mancozeb 75% WP',
                    dosage: '2.5g/L water',
                    frequency: 'Every 7 days for 3 weeks',
                    urgency: 'High',
                    cost_estimate: '₹500/hectare'
                },
                {
                    type: 'Cultural Practice',
                    action: 'Improve field drainage and remove infected leaves',
                    urgency: 'Immediate',
                    cost_estimate: 'Labor cost only'
                }
            ],
            'Leaf Spot': [
                {
                    type: 'Fungicide',
                    product: 'Copper Oxychloride 50% WP',
                    dosage: '3g/L water',
                    frequency: 'Every 10 days',
                    urgency: 'High',
                    cost_estimate: '₹600/hectare'
                }
            ],
            'Rust': [
                {
                    type: 'Fungicide',
                    product: 'Tebuconazole 25% EC',
                    dosage: '1ml/L water',
                    frequency: 'Every 14 days',
                    urgency: 'High',
                    cost_estimate: '₹800/hectare'
                }
            ]
        };

        return diseaseTreatments[disease.name] || [
            {
                type: 'General Treatment',
                action: 'Apply broad-spectrum fungicide',
                urgency: 'High',
                product: 'Broad-spectrum fungicide',
                dosage: 'As per label instructions',
                cost_estimate: '₹700/hectare'
            }
        ];
    }

    generateHealthTrend(currentHealth) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        return months.map((month, index) => {
            const trendFactor = 1 - (index * 0.05); // Gradual decline if untreated
            const deterministicVariation = (currentHealth > 80 ? 2 : currentHealth > 60 ? 0 : -3);
            const score = Math.max(0, Math.min(100, 
                currentHealth * trendFactor + deterministicVariation));
            
            return {
                date: `2024-${String(index + 1).padStart(2, '0')}`,
                score: Math.round(score),
                label: month,
                prediction: index > 3 ? 'Projected' : 'Actual'
            };
        });
    }

    getLocationData(location) {
        // Extract state from location (simplified)
        const state = location.split(',').pop()?.trim() || location;
        return this.locationFactors[state] || { 
            factor: 0, 
            climate: 'Unknown', 
            soil: 'Unknown' 
        };
    }

    calculateSuitability(cropType, locationData) {
        const suitabilityScores = {
            'Tomato': { 'Tropical': 0.9, 'Semi-arid': 0.6, 'Arid': 0.3, 'Humid': 0.8, 'Moderate': 0.7 },
            'Wheat': { 'Tropical': 0.5, 'Semi-arid': 0.8, 'Arid': 0.4, 'Humid': 0.7, 'Moderate': 0.9 },
            'Rice': { 'Tropical': 0.95, 'Semi-arid': 0.4, 'Arid': 0.2, 'Humid': 0.9, 'Moderate': 0.6 },
            'Corn': { 'Tropical': 0.7, 'Semi-arid': 0.8, 'Arid': 0.5, 'Humid': 0.8, 'Moderate': 0.9 },
            'Potato': { 'Tropical': 0.6, 'Semi-arid': 0.7, 'Arid': 0.3, 'Humid': 0.8, 'Moderate': 0.8 },
            'Cotton': { 'Tropical': 0.8, 'Semi-arid': 0.9, 'Arid': 0.6, 'Humid': 0.7, 'Moderate': 0.8 }
        };

        const cropSuitability = suitabilityScores[cropType] || {};
        const climate = locationData.climate;
        
        return cropSuitability[climate] || 0.5;
    }

    calculateConfidence(healthScore, locationFactor) {
        let baseConfidence = 0.85;
        
        // Higher confidence for healthy crops
        if (healthScore > 80) baseConfidence += 0.1;
        
        // Adjust for location data availability
        if (locationFactor !== 0) baseConfidence += 0.05;
        
        // Deterministic adjustment based on health score
        const deterministicAdjustment = (healthScore - 50) / 1000;
        
        return Math.min(0.99, baseConfidence + deterministicAdjustment);
    }

    getHealthLevel(healthScore) {
        if (healthScore > 80) return 'healthy';
        if (healthScore > 60) return 'warning';
        return 'danger';
    }

    simulateProcessing(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Batch analysis for multiple images
    async analyzeBatch(imageUrls, cropType, location) {
        console.log(`🔄 Batch analysis for ${imageUrls.length} images`);
        
        const results = await Promise.all(
            imageUrls.map(url => this.analyzeCropImage(url, cropType, location))
        );
        
        return {
            batch_id: `batch_${Date.now()}`,
            total_analyzed: results.length,
            results,
            summary: this.generateBatchSummary(results)
        };
    }

    generateBatchSummary(results) {
        const avgHealth = results.reduce((sum, r) => sum + r.diagnosis.health_score, 0) / results.length;
        const avgYield = results.reduce((sum, r) => sum + r.yield_prediction.predicted_yield, 0) / results.length;
        const avgSustainability = results.reduce((sum, r) => sum + r.sustainability_score, 0) / results.length;
        
        return {
            average_health_score: parseFloat(avgHealth.toFixed(1)),
            average_yield_prediction: parseFloat(avgYield.toFixed(1)),
            average_sustainability_score: parseFloat(avgSustainability.toFixed(1)),
            overall_risk_level: avgHealth > 75 ? 'Low' : avgHealth > 50 ? 'Medium' : 'High',
            recommendations_count: results.reduce((sum, r) => sum + r.recommendations.length, 0)
        };
    }
}

module.exports = new EnhancedMockAIService();
