const supabase = require('../config/supabase');
const cropService = require('./crop.service');
const yieldService = require('./yield.service');
const sustainabilityService = require('./sustainability.service');
const aiService = require('./ai.service');
const weatherService = require('./weather.service');
const { calculateWeatherImpact } = require('./weatherImpact.service');
const logger = require('../utils/logger');
const { calculateRisk } = require('../../../ai/risk-engine/riskCalculator');
const {
    calculateTrustScore: calculateTrustScoreV2,
    getRating: getTrustRating,
    scaleTrustScoreToCreditBand
} = require('../../../ai/trust-engine/trustCalculator');
const { calculateProjectedYield } = require('../../../ai/yield-prediction/yieldCalculator');
const { BASE_YIELD } = require('../../../ai/yield-prediction/baseYieldConfig');

const MISSING_COLUMN_CODES = new Set(['42703', 'PGRST204', 'PGRST205']);
const writeSupabase = supabase.admin || supabase;

const normalizeConfidenceToDecimal = (confidence) => {
    const n = Number(confidence);
    if (!Number.isFinite(n)) return null;
    // if confidence comes as percentage (e.g., 94.7), convert to 0.947
    const decimal = n > 1 ? (n / 100) : n;
    return Number(Math.min(Math.max(decimal, 0), 0.9999).toFixed(4));
};

const deriveAISource = (aiResults) => {
    const pipelineSource = aiResults?.pipeline?.raw_ai?.source;
    const source = aiResults?.location_analysis?.source || pipelineSource || 'unknown';
    if (source.includes('tensorflow')) return 'tensorflow';
    if (source.includes('mock')) return 'enhanced-mock';
    if (source.includes('external')) return 'external-ai';
    return source;
};

const toConfidencePercent = (confidence) => {
    const n = Number(confidence);
    if (!Number.isFinite(n)) return 0;
    return n > 1 ? Number(n.toFixed(1)) : Number((n * 100).toFixed(1));
};

const toRiskLevel = (riskScore) => {
    const n = Number(riskScore);
    if (!Number.isFinite(n)) return 'Low';
    if (n > 0.7) return 'High';
    if (n > 0.4) return 'Medium';
    return 'Low';
};

const toDetailedRiskLevel = (riskScore) => {
    const compact = toRiskLevel(riskScore);
    return compact === 'Low' ? 'Low Risk' : compact === 'Medium' ? 'Medium Risk' : 'High Risk';
};

const toEstimatedLossPercent = (riskScore) => {
    const n = Number(riskScore);
    if (!Number.isFinite(n)) return 0;
    return Math.round(Math.max(0, Math.min(100, n * 50)));
};

const toEligibility = (trustScore) => {
    const n = Number(trustScore);
    if (!Number.isFinite(n)) return false;
    return n > 100 ? n >= 600 : n >= 60;
};

const toRating = (trustScore, providedRating) => {
    if (providedRating) return providedRating;
    const n = Number(trustScore);
    if (!Number.isFinite(n)) return 'Unknown';

    if (n > 100) {
        if (n >= 750) return 'Excellent';
        if (n >= 700) return 'Good';
        if (n >= 650) return 'Fair';
        return 'Poor';
    }

    if (n >= 80) return 'Excellent';
    if (n >= 65) return 'Good';
    if (n >= 50) return 'Fair';
    return 'Poor';
};

const buildSustainabilityBreakdown = (score, existingBreakdown) => {
    if (existingBreakdown && typeof existingBreakdown === 'object') {
        return existingBreakdown;
    }

    const safeScore = Number.isFinite(Number(score)) ? Number(score) : 64;
    const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));

    return {
        water_efficiency: clamp(safeScore - 12),
        fertilizer_optimization: clamp(safeScore - 4),
        crop_diversity: clamp(safeScore + 6),
        soil_health: clamp(safeScore + 2),
    };
};

const buildRecommendationsFromAnalysis = (analysis) => {
    if (Array.isArray(analysis?.recommendations) && analysis.recommendations.length > 0) {
        return analysis.recommendations
            .map((item) => {
                if (typeof item === 'string') return item;
                if (item?.action) return item.action;
                if (item?.text) return item.text;
                return null;
            })
            .filter(Boolean);
    }

    const disease = String(analysis?.disease || '').toLowerCase();
    const severity = String(analysis?.severity || '').toLowerCase();

    if (!disease || disease.includes('healthy') || disease.includes('none')) {
        return [
            'Maintain the current irrigation and nutrient schedule to preserve crop health.',
            'Continue weekly field scouting and capture follow-up images to track stability.',
        ];
    }

    if (severity.includes('high') || severity.includes('critical')) {
        return [
            'Apply recommended fungicide treatment immediately and isolate heavily affected plots.',
            'Increase scouting frequency over the next 72 hours to prevent spread.',
            'Log intervention actions to improve next-cycle trust and risk scoring.',
        ];
    }

    return [
        'Begin targeted treatment and monitor symptom progression every 3-5 days.',
        'Optimize fertilizer and irrigation balance to reduce stress-driven disease growth.',
        'Re-run AI analysis after treatment to validate recovery trajectory.',
    ];
};

const buildExplainabilityText = (analysis) => {
    const disease = analysis?.disease || 'Detected Condition';
    const confidence = toConfidencePercent(analysis?.confidence);
    const severity = analysis?.severity || 'Unknown';
    const riskScore = Number(analysis?.risk ?? analysis?.risk_score ?? 0);

    return `Detected ${disease} with ${confidence}% confidence. Severity is ${severity}, and the computed risk score is ${riskScore.toFixed(2)}. Yield and financing projections are generated from this risk profile and sustainability signals to keep farm-health and loan-readiness decisions aligned.`;
};

const normalizeSeverityForStorage = (severity) => {
    const value = String(severity || '').trim().toLowerCase();
    if (!value) return 'Low';
    if (value === 'none' || value === 'healthy') return 'Low';
    if (value === 'medium' || value === 'moderate') return 'Moderate';
    if (value === 'critical') return 'Critical';
    if (value === 'high') return 'High';
    return 'Low';
};

const selectFirstFiniteNumber = (...values) => {
    for (const value of values) {
        const n = Number(value);
        if (Number.isFinite(n)) return n;
    }
    return null;
};

const shouldRetryWithCompatibilityPayload = (error) => {
    const code = String(error?.code || '').trim();
    const message = String(error?.message || '').toLowerCase();
    return MISSING_COLUMN_CODES.has(code)
        || message.includes('column')
        || message.includes('schema cache')
        || message.includes('could not find');
};

const buildAnalysisInsertCandidates = ({
    crop,
    location,
    imageUrl,
    farmerId,
    disease,
    confidence,
    storageSeverity,
    health,
    finalRiskScore,
    adjustedYield,
    sustainability,
    scaledTrustScore,
    finalCreditRating,
}) => {
    const createdAt = new Date().toISOString();
    const normalizedHealth = Number.isFinite(Number(health)) ? Math.round(Number(health)) : null;
    const normalizedRisk = Number(finalRiskScore.toFixed(4));

    const enhancedPayload = {
        farmer_id: farmerId,
        crop_type: crop,
        disease,
        confidence,
        risk_score: normalizedRisk,
        health_score: normalizedHealth,
        yield_prediction: adjustedYield,
        image_url: imageUrl,
        severity: storageSeverity,
        sustainability_index: sustainability,
        created_at: createdAt,
    };

    const legacyPayload = {
        farmer_id: farmerId,
        crop,
        location,
        health: normalizedHealth,
        risk: normalizedRisk,
        yield: adjustedYield,
        trust_score: scaledTrustScore,
        credit_rating: finalCreditRating,
        image_url: imageUrl,
        severity: storageSeverity,
        sustainability_index: sustainability,
        confidence,
        created_at: createdAt,
    };

    const ultraLegacyPayload = {
        farmer_id: farmerId,
        image_url: imageUrl,
        confidence,
        created_at: createdAt,
    };

    return [
        {
            payload: enhancedPayload,
            select: `
                id,
                farmer_id,
                crop_type,
                disease,
                confidence,
                health_score,
                risk_score,
                yield_prediction,
                image_url,
                severity,
                sustainability_index,
                created_at
            `,
        },
        {
            payload: legacyPayload,
            select: `
                id,
                farmer_id,
                crop,
                location,
                health,
                risk,
                yield,
                trust_score,
                credit_rating,
                image_url,
                severity,
                sustainability_index,
                confidence,
                created_at
            `,
        },
        {
            payload: ultraLegacyPayload,
            select: `
                id,
                farmer_id,
                image_url,
                confidence,
                created_at
            `,
        },
    ];
};

const insertAnalysisRecord = async (candidates = []) => {
    let lastError = null;

    for (let index = 0; index < candidates.length; index += 1) {
        const candidate = candidates[index];
        const insertResult = await supabase
            .from('crop_reports')
            .insert([candidate.payload])
            .select(candidate.select)
            .single();

        if (!insertResult.error) {
            return insertResult.data;
        }

        lastError = insertResult.error;
        if (!shouldRetryWithCompatibilityPayload(insertResult.error) || index === candidates.length - 1) {
            throw new Error(`Supabase Error: ${insertResult.error.message}`);
        }

        logger.warn(`Retrying crop_reports insert with compatibility payload: ${insertResult.error.message}`);
    }

    throw new Error(`Supabase Error: ${lastError?.message || 'Unknown insert failure'}`);
};

const buildCreditUpsertCandidates = ({ farmerId, scaledTrustScore, finalCreditRating, finalRiskScore, loanEligible }) => ([
    {
        payload: {
            farmer_id: farmerId,
            rating: finalCreditRating,
            score: scaledTrustScore,
            created_at: new Date().toISOString(),
        },
    },
    {
        payload: {
            farmer_id: farmerId,
            rating: finalCreditRating,
            score: scaledTrustScore,
            risk_category: String(toRiskLevel(finalRiskScore) || 'low').toLowerCase(),
            loan_eligibility: loanEligible,
            created_at: new Date().toISOString(),
        },
    },
    {
        payload: {
            farmer_id: farmerId,
            trust_score: scaledTrustScore,
            credit_grade: finalCreditRating,
            rating: finalCreditRating,
            score: scaledTrustScore,
            created_at: new Date().toISOString(),
        },
    },
]);

const upsertCreditSnapshot = async (candidates = []) => {
    let lastError = null;

    for (let index = 0; index < candidates.length; index += 1) {
        const candidate = candidates[index];
        const result = await supabase
            .from('credit_scores')
            .upsert(candidate.payload, { onConflict: 'farmer_id' });

        if (!result.error) {
            return;
        }

        lastError = result.error;
        if (!shouldRetryWithCompatibilityPayload(result.error) || index === candidates.length - 1) {
            throw new Error(`Supabase Error: ${result.error.message}`);
        }

        logger.warn(`Retrying credit_scores upsert with compatibility payload: ${result.error.message}`);
    }

    throw new Error(`Supabase Error: ${lastError?.message || 'Unknown credit upsert failure'}`);
};

const buildResultPayload = (analysis, options = {}) => {
    const trustScore = selectFirstFiniteNumber(
        analysis?.trust_score,
        analysis?.score,
        options?.creditScore?.trust_score,
        options?.creditScore?.score,
        0
    );
    const riskScore = selectFirstFiniteNumber(analysis?.risk, analysis?.risk_score, 0);
    const projectedYield = selectFirstFiniteNumber(analysis?.yield, analysis?.yield_prediction, 0);
    const sustainabilityScore = Number(analysis?.sustainability_index ?? 64);
    const recommendations = buildRecommendationsFromAnalysis(analysis);
    const explainabilityText = buildExplainabilityText(analysis);
    const resolvedLocation = analysis?.location || options?.location || options?.prediction?.location || null;
    const resolvedRating = analysis?.credit_rating || options?.creditScore?.credit_grade || options?.creditScore?.rating;

    return {
        id: analysis?.id,
        image: analysis?.image_url || null,
        disease: analysis?.disease || 'Detected Condition',
        confidence: toConfidencePercent(analysis?.confidence),
        severity: analysis?.severity || 'Unknown',
        riskLevel: toRiskLevel(riskScore),
        riskScore,
        projectedYield: `${Number.isFinite(projectedYield) ? projectedYield : '?'} tons/ha`,
        estimatedLoss: toEstimatedLossPercent(riskScore),
        trustScore: Number.isFinite(Number(trustScore)) ? Number(trustScore) : 0,
        eligibility: toEligibility(trustScore) ? 'Eligible' : 'Not Eligible',
        rating: toRating(trustScore, resolvedRating),
        sustainabilityScore: Number.isFinite(sustainabilityScore) ? sustainabilityScore : 64,
        sustainabilityBreakdown: buildSustainabilityBreakdown(sustainabilityScore, analysis?.sustainability_breakdown),
        recommendations,
        explainabilityText,
        dataMode: {
            source: options.sourceMode || 'backend-reconstructed',
            fallbackUsed: Boolean(options.fallbackUsed),
        },
        raw: {
            crop: analysis?.crop || analysis?.crop_type || null,
            location: resolvedLocation,
            timestamp: analysis?.created_at || null,
        },
    };
};

/**
 * Generate analysis for a crop and store it
 */
const generateAnalysis = async (crop, location, imageUrl = null, fertilizerLevel = 'medium', farmerId = null, inferenceContext = {}) => {
    // 1. Enhanced AI integration
    const aiResults = await aiService.analyzeCropImage(imageUrl, crop, location, inferenceContext);
    const severity = aiResults.diagnosis?.severity || 'Unknown';
    const storageSeverity = normalizeSeverityForStorage(severity);

    const decisionIntelligence = aiResults.decision_intelligence || {
        risk_factor: null,
        primary_threat: null,
        estimated_loss: null,
        urgency: null,
        crop_advisory: null,
        recommended_action: aiResults.diagnosis?.advice || null
    };

    const weatherSnapshot = await weatherService.getWeatherSnapshotByLocation(location);
    const weatherLabel = weatherSnapshot.normalizedCondition || aiResults?.location_analysis?.weather || 'normal';
    const weatherImpact = calculateWeatherImpact(weatherSnapshot);

    const baseRiskComputation = calculateRisk({
        confidence: aiResults?.diagnosis?.confidence,
        severity,
        weather: weatherLabel
    });
    const finalRiskScore = Math.max(
        0,
        Math.min(1, Number((baseRiskComputation.riskScore + weatherImpact.deltaScore).toFixed(4)))
    );
    const finalRiskLevel = toDetailedRiskLevel(finalRiskScore);
    const risk = finalRiskScore;

    const isHighRisk = finalRiskScore > 0.7;

    // 2. Risk -> Yield impact
    // Projected Yield = Base × (1 - Risk × 0.5)
    const cropKey = String(crop || '').toLowerCase();
    const baseYield = BASE_YIELD[cropKey] || 15;
    const yieldResult = calculateProjectedYield({
        baseYield,
        riskScore: finalRiskScore,
        crop
    });
    const adjustedYield = yieldResult.projectedYield;
    const lossPercentage = Number((yieldResult.yieldLossPercent / 100).toFixed(4));
    const riskYieldFactor = Number((1 - lossPercentage).toFixed(4));

    // 3. Yield -> Credit score impact
    const yieldCreditMultiplier = yieldResult.yieldLossPercent > 30 ? 0.75 : 1.0;
    const riskSeverityMultiplier = finalRiskScore > 0.7 ? 0.85 : 1.0;

    const inferredEstimatedLoss = isHighRisk ? '30–50%' : `${(lossPercentage * 100).toFixed(1)}%`;
    const normalizedYield = yieldService.normalizeYieldScore(adjustedYield, 10);

    // 4. Trust score computation (0-100 formula)
    const sustainabilityData = sustainabilityService.calculateSustainability(crop, location);
    const sustainability = sustainabilityData?.score || 70;
    
    const trustInputs = {
        yieldStability: Number((100 - yieldResult.yieldLossPercent).toFixed(2)),
        riskTrend: Number((100 - (finalRiskScore * 100)).toFixed(2)),
        sustainability,
        consistency: 75
    };
    const trustEngineResult = calculateTrustScoreV2(trustInputs);

    const trustScoreBeforeAdjustments = trustEngineResult.trustScore;
    const finalTrustScore = Math.max(
        0,
        Math.min(100, Math.round(trustScoreBeforeAdjustments * yieldCreditMultiplier * riskSeverityMultiplier))
    );
    const scaledTrustScore = scaleTrustScoreToCreditBand(finalTrustScore);
    const finalCreditRating = getTrustRating(finalTrustScore);
    const loanEligible = finalTrustScore >= 60;

    const recommendations = (aiResults.recommendations || []).map((rec) => {
        if (!isHighRisk) return rec;
        const urgentSuffix = ' | Immediate action required within 48 hours';
        const updatedAction = rec.action && !rec.action.includes(urgentSuffix)
            ? `${rec.action}${urgentSuffix}`
            : rec.action || `Immediate action required within 48 hours`;

        return {
            ...rec,
            action: updatedAction,
            urgency: rec.urgency === 'Immediate' ? rec.urgency : 'Immediate'
        };
    });

    const recommendedActionWithRisk = isHighRisk
        ? `${decisionIntelligence.recommended_action || aiResults.diagnosis?.advice || 'Immediate intervention needed'} | Immediate action required within 48 hours`
        : (decisionIntelligence.recommended_action || aiResults.diagnosis?.advice || null);

    const chainStages = [
        'Image',
        'TensorFlow',
        'Crop Mapping',
        'Agri Enhancement',
        'Yield Prediction',
        'Credit Score'
    ];

    const pipeline = {
        ...(aiResults.pipeline || {}),
        chain: chainStages,
        yield_engine: {
            formula: 'projectedYield = baseYield * (1 - riskScore * 0.5)',
            base_yield: baseYield,
            risk_score: finalRiskScore,
            loss_percentage: lossPercentage,
            risk_yield_factor: riskYieldFactor,
            adjusted_yield: adjustedYield,
            weather_impact_percent: weatherImpact.deltaPercent
        },
        credit_engine: {
            severity,
            trust_formula: '(0.3*yieldStability) + (0.25*riskTrend) + (0.2*sustainability) + (0.25*consistency)',
            trust_inputs: trustInputs,
            yield_credit_multiplier: yieldCreditMultiplier,
            risk_severity_multiplier: riskSeverityMultiplier,
            trust_score_before_adjustments: trustScoreBeforeAdjustments,
            trust_score_after_adjustments: finalTrustScore,
            scaled_trust_score: scaledTrustScore
        }
    };

    // 4. Extract values for storage and response
    const health = aiResults.diagnosis.health_score;

    // 5. Enhanced analysis result with new database fields
    const analysisResult = {
        crop,
        location,
        imageUrl,
        farmerId,
        disease: aiResults.diagnosis?.disease || null,
        confidence: normalizeConfidenceToDecimal(aiResults.diagnosis?.confidence),
        storageSeverity,
        health,
        finalRiskScore,
        adjustedYield,
        sustainability,
        scaledTrustScore,
        finalCreditRating,
    };
    
    // 6. Store in crop_reports with compatibility for both deployed schemas.
    const insertedAnalysis = await insertAnalysisRecord(buildAnalysisInsertCandidates(analysisResult));

    // 7. Store AI metadata for reliability tracking (judge-facing telemetry)
    const aiMetadata = {
        crop_report_id: insertedAnalysis.id,
        crop_type: crop,
        disease: aiResults.diagnosis?.disease || null,
        confidence: normalizeConfidenceToDecimal(aiResults.diagnosis?.confidence),
        severity: storageSeverity,
        ai_source: deriveAISource(aiResults),
        fallback_used: Boolean(aiResults?.metadata?.fallback_used),
        raw_label: aiResults?.diagnosis?.tensorflow_prediction || aiResults?.pipeline?.raw_ai?.label || null,
        raw_probability: normalizeConfidenceToDecimal(
            aiResults?.diagnosis?.tensorflow_confidence ?? aiResults?.pipeline?.raw_ai?.probability
        ),
        location
    };

    let predictionId = null;
    try {
        const predictionInsert = await writeSupabase
            .from('predictions')
            .insert([aiMetadata])
            .select('id')
            .single();

        if (predictionInsert.error) {
            logger.warn('AI metadata insert failed (continuing analysis response):', predictionInsert.error.message);
        } else {
            predictionId = predictionInsert.data?.id || null;
        }
    } catch (metadataError) {
        logger.warn('AI metadata insert threw error (continuing analysis response):', metadataError.message);
    }

    // 8. Keep latest trust/credit snapshot aligned with new analysis results.
    if (farmerId) {
        try {
            await upsertCreditSnapshot(buildCreditUpsertCandidates({
                farmerId,
                scaledTrustScore,
                finalCreditRating,
                finalRiskScore,
                loanEligible,
            }));
        } catch (creditError) {
            logger.warn('Credit score upsert threw error (continuing analysis response):', creditError.message);
        }
    }

    // 9. Enhanced response format for frontend compatibility
    return {
        id: insertedAnalysis.id,
        prediction_id: predictionId,
        crop: insertedAnalysis.crop_type || insertedAnalysis.crop || crop,
        disease: aiResults.diagnosis.disease,
        confidence: normalizeConfidenceToDecimal(aiResults.diagnosis.confidence),
        severity,
        risk: {
            score: finalRiskScore,
            level: finalRiskLevel,
            weatherFactor: baseRiskComputation.weatherFactor,
            weatherImpact: weatherImpact.deltaPercent,
            reason: weatherImpact.reason,
            weatherReason: weatherImpact.reason
        },
        trust: {
            score: finalTrustScore,
            rating: finalCreditRating,
            loanEligible
        },
        yield: {
            baseYield: yieldResult.baseYield,
            projectedYield: yieldResult.projectedYield,
            lossPercent: yieldResult.yieldLossPercent
        },
        location,
        timestamp: insertedAnalysis.created_at,
        score: finalTrustScore,
        scaled_trust_score: scaledTrustScore,
        credit_rating: finalCreditRating,
        explainabilityText: aiResults?.explanation?.summary || null,
        image_url: insertedAnalysis.image_url,
        diagnosis: {
            disease: aiResults.diagnosis.disease,
            confidence: aiResults.diagnosis.confidence,
            severity,
            health_score: health,
            action_label: aiResults.diagnosis.action_label || decisionIntelligence.action_label || null
        },
        yield_prediction: {
            predicted_yield: adjustedYield,
            base_yield: baseYield,
            adjusted_yield: adjustedYield,
            formula: 'projectedYield = baseYield * (1 - riskScore * 0.5)',
            risk_score: finalRiskScore,
            impact_factor: yieldResult.impactFactor,
            risk_yield_factor: riskYieldFactor,
            loss_percentage: yieldResult.yieldLossPercent,
            estimated_loss: inferredEstimatedLoss,
            unit: 'tons/hectare',
            confidence: aiResults.yield_prediction.confidence
        },
        sustainability_index: aiResults.sustainability_score || sustainability,
        breakdown: trustEngineResult.weighted,
        trust_impact: {
            severity,
            trust_formula: '(0.3*yieldStability) + (0.25*riskTrend) + (0.2*sustainability) + (0.25*consistency)',
            trust_inputs: trustInputs,
            yield_credit_multiplier: yieldCreditMultiplier,
            risk_severity_multiplier: riskSeverityMultiplier,
            trust_score_before_adjustments: trustScoreBeforeAdjustments,
            trust_score_after_adjustments: finalTrustScore,
            scaled_trust_score: scaledTrustScore
        },
        risk_assessment: {
            score: finalRiskScore,
            level: finalRiskLevel,
            weather_factor: baseRiskComputation.weatherFactor,
            severity_weight: baseRiskComputation.severityWeight,
            weather: weatherLabel,
            weather_impact: weatherImpact
        },
        risk_impacts: {
            estimated_loss_band: inferredEstimatedLoss,
            yield_loss_percentage: yieldResult.yieldLossPercent,
            credit_multiplier: yieldCreditMultiplier,
            urgent_action_flag: isHighRisk
        },
        weather: weatherSnapshot,
        recommendations,
        health_trend: aiResults.health_trend,
        decision_intelligence: {
            ...decisionIntelligence,
            estimated_loss: inferredEstimatedLoss,
            severity,
            recommended_action: recommendedActionWithRisk
        },
        ai_metadata: {
            ai_source: aiMetadata.ai_source,
            fallback_used: aiMetadata.fallback_used,
            raw_label: aiMetadata.raw_label,
            raw_probability: aiMetadata.raw_probability
        },
        dataMode: {
            source: aiMetadata.ai_source,
            fallbackUsed: aiMetadata.fallback_used,
        },
        pipeline
    };
};

/**
 * Fetch a stored analysis by ID
 */
const getAnalysisRowById = async (id) => {
    const { data: analysisData, error: fetchError } = await supabase
        .from('crop_reports')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError) {
        if (fetchError.code === 'PGRST116') return null; // Not found
        throw new Error(`Supabase Error: ${fetchError.message}`);
    }

    return analysisData;
};

const getAnalysisById = async (id) => {
    const analysis = await getAnalysisRowById(id);
    if (!analysis) return null;

    let sourceMode = 'backend-reconstructed';
    let fallbackUsed = false;
    let predictionData = null;
    let creditScore = null;
    let resolvedLocation = analysis?.location || null;

    try {
        const { data } = await supabase
            .from('predictions')
            .select('ai_source, fallback_used, location')
            .eq('crop_report_id', id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        predictionData = data;
        if (predictionData?.ai_source) {
            sourceMode = predictionData.ai_source;
        }
        fallbackUsed = Boolean(predictionData?.fallback_used);
        resolvedLocation = resolvedLocation || predictionData?.location || null;
    } catch (error) {
        logger.warn('Could not resolve prediction metadata for analysis payload:', error.message);
    }

    if (analysis?.farmer_id) {
        try {
            const { data } = await supabase
                .from('credit_scores')
                .select('*')
                .eq('farmer_id', analysis.farmer_id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            creditScore = data || null;
        } catch (error) {
            logger.warn('Could not resolve credit score metadata for analysis payload:', error.message);
        }

        if (!resolvedLocation) {
            try {
                const { data } = await supabase
                    .from('farmers')
                    .select('location')
                    .eq('id', analysis.farmer_id)
                    .maybeSingle();

                resolvedLocation = data?.location || null;
            } catch (error) {
                logger.warn('Could not resolve farmer location for analysis payload:', error.message);
            }
        }
    }

    return buildResultPayload(analysis, {
        sourceMode,
        fallbackUsed,
        prediction: predictionData,
        creditScore,
        location: resolvedLocation,
    });
};

/**
 * Fetch all stored analyses
 */
const getAllAnalyses = async () => {
    const { data: analysesData, error: fetchAllError } = await supabase
        .from('crop_reports')
        .select('*')
        .order('created_at', { ascending: false });

    if (fetchAllError) {
        throw new Error(`Supabase Error: ${fetchAllError.message}`);
    }

    return analysesData;
};

/**
 * Explainability Analysis
 */
const getExplainability = async (id) => {
    const payload = await getAnalysisById(id);
    if (!payload) return null;

    return {
        id: payload.id,
        explainabilityText: payload.explainabilityText,
        recommendations: payload.recommendations,
        riskLevel: payload.riskLevel,
        riskScore: payload.riskScore,
        confidence: payload.confidence,
        disease: payload.disease,
        severity: payload.severity,
    };
};

module.exports = {
  generateAnalysis,
  getAnalysisById,
  getAllAnalyses,
  getExplainability
};
