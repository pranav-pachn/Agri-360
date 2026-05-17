const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const supabase = require('../config/supabase');
const logger = require('../utils/logger');

const SYNTHETIC_DATASET_PATH = path.join(__dirname, '../../../data/farm_dataset.csv');
let syntheticDatasetCache = null;
let syntheticDatasetPromise = null;

const toTitleCase = (value = '') => {
    const text = String(value || '').trim().toLowerCase();
    if (!text) return '';
    return text
        .split(/\s+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
};

const parseDistrictStateFromLocation = (location = '') => {
    const parts = String(location || '')
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);

    if (!parts.length) {
        return {
            district: 'Unknown District',
            state: 'Unknown State'
        };
    }

    if (parts.length === 1) {
        return {
            district: toTitleCase(parts[0]),
            state: 'Unknown State'
        };
    }

    return {
        district: toTitleCase(parts[0]),
        state: toTitleCase(parts[1])
    };
};

const safeNumber = (value, fallback = 0) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
};

const loadSyntheticDataset = async () => {
    if (syntheticDatasetCache) {
        return syntheticDatasetCache;
    }

    if (syntheticDatasetPromise) {
        return syntheticDatasetPromise;
    }

    syntheticDatasetPromise = new Promise((resolve, reject) => {
        const rows = [];

        fs.createReadStream(SYNTHETIC_DATASET_PATH)
            .pipe(csv())
            .on('data', (row) => {
                rows.push({
                    district: row.district,
                    crop: row.crop,
                    health: safeNumber(row.health),
                    yield_pred: safeNumber(row.yield_pred),
                    actual_yield: safeNumber(row.actual_yield),
                    risk: safeNumber(row.risk),
                    weather_volatility: safeNumber(row.weather_volatility),
                    market_fluctuation: safeNumber(row.market_fluctuation)
                });
            })
            .on('end', () => {
                syntheticDatasetCache = rows;
                syntheticDatasetPromise = null;
                resolve(rows);
            })
            .on('error', (error) => {
                syntheticDatasetPromise = null;
                reject(error);
            });
    });

    return syntheticDatasetPromise;
};

const calculateMAE = (data = []) => {
    if (!data.length) return 0;

    const error = data.reduce((acc, row) => (
        acc + Math.abs(safeNumber(row.yield_pred) - safeNumber(row.actual_yield))
    ), 0) / data.length;

    return Number(error.toFixed(2));
};

const calculateRiskAccuracy = (data = []) => {
    if (!data.length) return 0;

    let correct = 0;

    data.forEach((row) => {
        const predicted = safeNumber(row.risk) > 0.5 ? 'High' : 'Low';
        const actual = safeNumber(row.actual_yield) < 2.5 ? 'High' : 'Low';

        if (predicted === actual) {
            correct += 1;
        }
    });

    return Number((correct / data.length).toFixed(2));
};

const classifyRiskBand = (risk) => {
    const score = safeNumber(risk);
    if (score > 0.7) return 'High';
    if (score > 0.4) return 'Medium';
    return 'Low';
};

const SYNTHETIC_DISTRICT_STATE_MAP = {
    Guntur: 'Andhra Pradesh',
    Nellore: 'Andhra Pradesh',
    Kurnool: 'Andhra Pradesh',
    Krishna: 'Andhra Pradesh',
    Prakasam: 'Andhra Pradesh',
    Anantapur: 'Andhra Pradesh',
    Chittoor: 'Andhra Pradesh',
    'East Godavari': 'Andhra Pradesh',
    'West Godavari': 'Andhra Pradesh',
    Kadapa: 'Andhra Pradesh'
};

const buildSyntheticAnalyticsSnapshot = async () => {
    const rows = await loadSyntheticDataset();
    const districtBuckets = new Map();

    rows.forEach((row) => {
        const district = String(row.district || '').trim() || 'Unknown District';
        const state = SYNTHETIC_DISTRICT_STATE_MAP[district] || 'Andhra Pradesh';
        const key = `${district}::${state}`;

        if (!districtBuckets.has(key)) {
            districtBuckets.set(key, {
                district,
                state,
                total_reports: 0,
                healthy_reports: 0,
                disease_reports: 0,
                risk_sum: 0,
                health_sum: 0,
                trust_sum: 0,
                cropCounts: new Map()
            });
        }

        const bucket = districtBuckets.get(key);
        const risk = safeNumber(row.risk);
        const health = safeNumber(row.health);
        const trustEstimate = Math.max(300, Math.min(900, Math.round(900 - (risk * 400) + (health * 2))));

        bucket.total_reports += 1;
        bucket.risk_sum += risk;
        bucket.health_sum += health;
        bucket.trust_sum += trustEstimate;

        if (health >= 75) {
            bucket.healthy_reports += 1;
        } else {
            bucket.disease_reports += 1;
        }

        const crop = String(row.crop || 'Mixed').trim() || 'Mixed';
        bucket.cropCounts.set(crop, (bucket.cropCounts.get(crop) || 0) + 1);
    });

    const districtRows = Array.from(districtBuckets.values()).map((bucket) => {
        const dominantCrop = Array.from(bucket.cropCounts.entries())
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Mixed';

        return {
            district: bucket.district,
            state: bucket.state,
            crop: dominantCrop,
            avg_risk_score: Number((bucket.risk_sum / Math.max(1, bucket.total_reports)).toFixed(4)),
            total_reports: bucket.total_reports,
            healthy_reports: bucket.healthy_reports,
            disease_reports: bucket.disease_reports,
            avg_trust_score: Number((bucket.trust_sum / Math.max(1, bucket.total_reports)).toFixed(2)),
            avg_health_score: Number((bucket.health_sum / Math.max(1, bucket.total_reports)).toFixed(2)),
            last_updated: new Date().toISOString(),
            source: 'synthetic-dataset'
        };
    }).sort((a, b) => b.total_reports - a.total_reports);

    const stateBuckets = new Map();

    districtRows.forEach((row) => {
        if (!stateBuckets.has(row.state)) {
            stateBuckets.set(row.state, {
                state: row.state,
                total_reports: 0,
                healthy_reports: 0,
                risk_weighted_sum: 0,
                trust_weighted_sum: 0
            });
        }

        const bucket = stateBuckets.get(row.state);
        bucket.total_reports += safeNumber(row.total_reports);
        bucket.healthy_reports += safeNumber(row.healthy_reports);
        bucket.risk_weighted_sum += safeNumber(row.avg_risk_score) * safeNumber(row.total_reports);
        bucket.trust_weighted_sum += safeNumber(row.avg_trust_score) * safeNumber(row.total_reports);
    });

    const stateRows = Array.from(stateBuckets.values()).map((bucket) => ({
        state: bucket.state,
        avg_risk_score: Number((bucket.risk_weighted_sum / Math.max(1, bucket.total_reports)).toFixed(4)),
        avg_trust_score: Number((bucket.trust_weighted_sum / Math.max(1, bucket.total_reports)).toFixed(2)),
        total_reports: bucket.total_reports,
        healthy_reports: bucket.healthy_reports,
        last_updated: new Date().toISOString(),
        source: 'synthetic-dataset'
    }));

    const nationalTotalReports = districtRows.reduce((sum, row) => sum + safeNumber(row.total_reports), 0);
    const national = {
        avg_risk_score: Number((districtRows.reduce((sum, row) => sum + (safeNumber(row.avg_risk_score) * safeNumber(row.total_reports)), 0) / Math.max(1, nationalTotalReports)).toFixed(4)),
        total_reports: nationalTotalReports,
        healthy_reports: districtRows.reduce((sum, row) => sum + safeNumber(row.healthy_reports), 0),
        avg_trust_score: Number((districtRows.reduce((sum, row) => sum + (safeNumber(row.avg_trust_score) * safeNumber(row.total_reports)), 0) / Math.max(1, nationalTotalReports)).toFixed(2)),
        source: 'synthetic-dataset'
    };

    return {
        districts: districtRows,
        states: stateRows,
        national,
        summary: {
            total_districts: districtRows.length,
            total_states: stateRows.length,
            national_avg_risk: national.avg_risk_score,
            national_avg_trust: national.avg_trust_score
        }
    };
};

const checkAnalyticsTableStatus = async () => {
    try {
        const { error, status } = await supabase
            .from('analytics')
            .select('id')
            .limit(1);

        if (error) {
            if (error.code === 'PGRST205') {
                return {
                    reachable: true,
                    analyticsTableReady: false,
                    status,
                    reason: 'missing_analytics_table',
                    message: "The 'analytics' table is missing from the connected Supabase project."
                };
            }

            return {
                reachable: false,
                analyticsTableReady: false,
                status,
                reason: 'analytics_query_failed',
                message: error.message
            };
        }

        return {
            reachable: true,
            analyticsTableReady: true,
            status,
            reason: 'ok',
            message: 'Analytics table is available.'
        };
    } catch (error) {
        return {
            reachable: false,
            analyticsTableReady: false,
            status: 0,
            reason: 'network_or_auth_error',
            message: error.message
        };
    }
};

const getSyntheticAnalyticsSummary = async () => {
    try {
        const data = await loadSyntheticDataset();
        const mae = calculateMAE(data);
        const riskAccuracy = calculateRiskAccuracy(data);
        const uniqueDistricts = new Set(data.map((row) => row.district).filter(Boolean));
        const uniqueCrops = new Set(data.map((row) => row.crop).filter(Boolean));
        const averageHealth = data.length
            ? Number((data.reduce((sum, row) => sum + safeNumber(row.health), 0) / data.length).toFixed(1))
            : 0;
        const riskDistribution = data.reduce((acc, row) => {
            const band = classifyRiskBand(row.risk);
            acc[band] += 1;
            return acc;
        }, { High: 0, Medium: 0, Low: 0 });
        const comparisonSeries = data.slice(0, 12).map((row, index) => ({
            label: `${row.district.slice(0, 3).toUpperCase()}-${index + 1}`,
            district: row.district,
            crop: row.crop,
            predicted: safeNumber(row.yield_pred),
            actual: safeNumber(row.actual_yield)
        }));
        const samplePredictions = data.slice(0, 8).map((row) => ({
            district: row.district,
            crop: row.crop,
            predicted: safeNumber(row.yield_pred),
            actual: safeNumber(row.actual_yield),
            risk: safeNumber(row.risk),
            riskBand: classifyRiskBand(row.risk),
            weatherVolatility: safeNumber(row.weather_volatility),
            marketFluctuation: safeNumber(row.market_fluctuation)
        }));
        const explainabilitySample = [...data]
            .sort((a, b) => safeNumber(b.risk) - safeNumber(a.risk))[0];
        const explainability = explainabilitySample
            ? `High risk due to ${safeNumber(explainabilitySample.weather_volatility).toFixed(2)} weather volatility and ${safeNumber(explainabilitySample.market_fluctuation).toFixed(2)} market fluctuation observed in similar historical records.`
            : 'Risk is estimated from crop health, yield behavior, weather volatility, and market movement.';

        return {
            totalRecords: data.length,
            districtsCovered: uniqueDistricts.size,
            cropsCovered: uniqueCrops.size,
            mae,
            maeLabel: `Mean Absolute Error (MAE): ${mae.toFixed(2)} tons/hectare`,
            riskAccuracy,
            riskAccuracyPercent: Number((riskAccuracy * 100).toFixed(0)),
            averageHealth,
            dataSource: 'Synthetic dataset modeled on real agricultural patterns (crop yield, health, and risk factors).',
            riskDistribution,
            comparisonSeries,
            samplePredictions,
            explainability,
            sample: data.slice(0, 5)
        };
    } catch (error) {
        logger.error('Synthetic analytics summary error:', error);
        throw error;
    }
};

// Analytics Service Functions
const getDistrictAnalytics = async (district) => {
    try {
        logger.info(`Fetching district analytics for: ${district}`);
        
        const { data, error } = await supabase
            .from('analytics')
            .select('*')
            .eq('level', 'district')
            .eq('district', district)
            .single();
        
        if (error) {
            logger.error('Analytics service error:', error);
            throw new Error(`Failed to fetch district analytics: ${error.message}`);
        }
        
        logger.info(`District analytics retrieved successfully for ${district}`);
        return data;
    } catch (error) {
        logger.error('Analytics service exception:', error);
        throw error;
    }
};

const getStateAnalytics = async (state) => {
    try {
        logger.info(`Fetching state analytics for: ${state}`);
        
        const { data, error } = await supabase
            .from('analytics')
            .select('*')
            .eq('level', 'state')
            .eq('state', state)
            .single();
        
        if (error) {
            logger.error('Analytics service error:', error);
            throw new Error(`Failed to fetch state analytics: ${error.message}`);
        }
        
        logger.info(`State analytics retrieved successfully for ${state}`);
        return data;
    } catch (error) {
        logger.error('Analytics service exception:', error);
        throw error;
    }
};

const getNationalAnalytics = async () => {
    try {
        logger.info('Fetching national analytics');
        
        const { data, error } = await supabase
            .from('analytics')
            .select('*')
            .eq('level', 'national')
            .single();
        
        if (error) {
            logger.error('Analytics service error:', error);
            throw new Error(`Failed to fetch national analytics: ${error.message}`);
        }
        
        logger.info('National analytics retrieved successfully');
        return data;
    } catch (error) {
        logger.error('Analytics service exception:', error);
        throw error;
    }
};

const updateDistrictAnalytics = async (district, updateData) => {
    try {
        logger.info(`Updating district analytics for: ${district}`);
        
        const updatePayload = {
            ...updateData,
            last_updated: new Date().toISOString(),
            avg_risk_score: updateData.avg_risk_score || 0,
            total_reports: updateData.total_reports || 0,
            healthy_reports: updateData.healthy_reports || 0,
            avg_trust_score: updateData.avg_trust_score || 0,
            avg_health_score: updateData.avg_health_score || 0
        };
        
        const { error } = await supabase
            .from('analytics')
            .update(updatePayload)
            .eq('level', 'district')
            .eq('district', district);
        
        if (error) {
            logger.error('Analytics update error:', error);
            throw new Error(`Failed to update district analytics: ${error.message}`);
        }
        
        logger.info(`District analytics updated successfully for ${district}`);
        return !error;
    } catch (error) {
        logger.error('Analytics service exception:', error);
        throw error;
    }
};

const updateStateAnalytics = async (state, updateData) => {
    try {
        logger.info(`Updating state analytics for: ${state}`);
        
        const updatePayload = {
            ...updateData,
            last_updated: new Date().toISOString(),
            avg_risk_score: updateData.avg_risk_score || 0,
            total_reports: updateData.total_reports || 0,
            healthy_reports: updateData.healthy_reports || 0,
            avg_trust_score: updateData.avg_trust_score || 0,
            avg_health_score: updateData.avg_health_score || 0
        };
        
        const { error } = await supabase
            .from('analytics')
            .update(updatePayload)
            .eq('level', 'state')
            .eq('state', state);
        
        if (error) {
            logger.error('Analytics update error:', error);
            throw new Error(`Failed to update state analytics: ${error.message}`);
        }
        
        logger.info(`State analytics updated successfully for ${state}`);
        return !error;
    } catch (error) {
        logger.error('Analytics service exception:', error);
        throw error;
    }
};

const buildEmptyDashboardAnalytics = () => ({
    districts: [],
    states: [],
    national: {
        avg_risk_score: 0,
        total_reports: 0,
        healthy_reports: 0,
        avg_trust_score: 0
    },
    summary: {
        total_districts: 0,
        total_states: 0,
        national_avg_risk: 0,
        national_avg_trust: 0
    }
});

// Aggregate analytics data for dashboard
const getDashboardAnalytics = async () => {
    try {
        logger.info('Fetching dashboard analytics summary');

        const [{ data: districts, error: districtsError }, { data: states, error: statesError }, { data: national, error: nationalError }] = await Promise.all([
            supabase
                .from('analytics')
                .select('district, avg_risk_score, total_reports, healthy_reports')
                .eq('level', 'district'),
            supabase
                .from('analytics')
                .select('state, avg_risk_score, avg_trust_score, total_reports, healthy_reports, last_updated')
                .eq('level', 'state'),
            supabase
                .from('analytics')
                .select('avg_risk_score, total_reports, healthy_reports, avg_trust_score')
                .eq('level', 'national')
                .maybeSingle()
        ]);

        if (districtsError) {
            logger.warn('Dashboard district analytics unavailable, using empty list:', districtsError);
        }

        if (statesError) {
            logger.warn('Dashboard state analytics unavailable, using empty list:', statesError);
        }

        if (nationalError) {
            logger.warn('Dashboard national analytics unavailable, using empty summary:', nationalError);
        }

        if (districtsError || statesError || nationalError) {
            logger.info('Falling back to synthetic analytics snapshot for dashboard');
            return await buildSyntheticAnalyticsSnapshot();
        }

        const safeDistricts = Array.isArray(districts) ? districts : [];
        const safeStates = Array.isArray(states) ? states : [];
        const safeNational = national || buildEmptyDashboardAnalytics().national;

        const dashboardData = {
            districts: safeDistricts,
            states: safeStates,
            national: safeNational,
            summary: {
                total_districts: safeDistricts.length,
                total_states: safeStates.length,
                national_avg_risk: safeNational?.avg_risk_score || 0,
                national_avg_trust: safeNational?.avg_trust_score || 0
            }
        };

        logger.info('Dashboard analytics retrieved successfully');
        return dashboardData;
    } catch (error) {
        logger.error('Dashboard analytics error:', error);
        return buildEmptyDashboardAnalytics();
    }
};

const listDistrictAnalytics = async ({ state = '' } = {}) => {
    try {
        logger.info('Fetching district analytics list');

        let query = supabase
            .from('analytics')
            .select('district, state, avg_risk_score, total_reports, healthy_reports, disease_reports, avg_trust_score, avg_health_score, last_updated')
            .eq('level', 'district')
            .order('total_reports', { ascending: false });

        if (String(state || '').trim()) {
            query = query.eq('state', String(state).trim());
        }

        const { data, error } = await query;

        if (error) {
            logger.warn('District list unavailable from Supabase, using synthetic fallback:', error);
            const synthetic = await buildSyntheticAnalyticsSnapshot();
            const filtered = String(state || '').trim()
                ? synthetic.districts.filter((row) => row.state === String(state).trim())
                : synthetic.districts;
            return filtered;
        }

        return data || [];
    } catch (error) {
        logger.warn('District list analytics error, attempting synthetic fallback:', error);
        const synthetic = await buildSyntheticAnalyticsSnapshot();
        const filtered = String(state || '').trim()
            ? synthetic.districts.filter((row) => row.state === String(state).trim())
            : synthetic.districts;
        return filtered;
    }
};

const recomputeAnalyticsFromReports = async () => {
    try {
        logger.info('Recomputing analytics from crop reports');

        // Use Promise.allSettled to handle individual query failures gracefully
        const results = await Promise.allSettled([
            supabase
                .from('crop_reports')
                .select('farmer_id, risk_score, health_score, disease')
                .not('farmer_id', 'is', null),
            supabase
                .from('farmers')
                .select('id, location'),
            supabase
                .from('credit_scores')
                .select('farmer_id, trust_score')
        ]);

        // Extract data and errors from settled promises
        let reports = [];
        let farmers = [];
        let credits = [];
        let hasError = false;

        if (results[0].status === 'fulfilled' && results[0].value.data) {
            reports = results[0].value.data;
        } else if (results[0].status === 'rejected') {
            logger.warn('Failed to fetch crop_reports:', results[0].reason);
            hasError = true;
        } else if (results[0].value.error) {
            logger.warn('Crop reports query error:', results[0].value.error);
            hasError = true;
        }

        if (results[1].status === 'fulfilled' && results[1].value.data) {
            farmers = results[1].value.data;
        } else if (results[1].status === 'rejected') {
            logger.warn('Failed to fetch farmers:', results[1].reason);
            hasError = true;
        } else if (results[1].value.error) {
            logger.warn('Farmers query error:', results[1].value.error);
            hasError = true;
        }

        if (results[2].status === 'fulfilled' && results[2].value.data) {
            credits = results[2].value.data;
        } else if (results[2].status === 'rejected') {
            logger.warn('Failed to fetch credit_scores:', results[2].reason);
            hasError = true;
        } else if (results[2].value.error) {
            logger.warn('Credit scores query error:', results[2].value.error);
            hasError = true;
        }

        if (hasError && !reports.length && !farmers.length) {
            throw new Error('Failed to load source data for analytics recompute - all queries failed');
        }

        if (!reports.length) {
            logger.warn('No crop reports found - using empty analytics');
            return {
                districts_updated: 0,
                states_updated: 0,
                national_reports: 0,
                last_updated: new Date().toISOString()
            };
        }

        const farmerLocation = new Map((farmers || []).map((row) => [row.id, row.location || '']));
        const farmerTrust = new Map((credits || []).map((row) => [row.farmer_id, safeNumber(row.trust_score)]));

        const districtBuckets = new Map();

        for (const report of reports || []) {
            const location = farmerLocation.get(report.farmer_id) || '';
            const { district, state } = parseDistrictStateFromLocation(location);
            const key = `${district}::${state}`;
            const diseaseText = String(report?.disease || '').toLowerCase();
            const isHealthy = diseaseText === 'healthy' || diseaseText.includes('healthy');

            if (!districtBuckets.has(key)) {
                districtBuckets.set(key, {
                    district,
                    state,
                    total_reports: 0,
                    healthy_reports: 0,
                    disease_reports: 0,
                    risk_sum: 0,
                    risk_count: 0,
                    health_sum: 0,
                    health_count: 0,
                    trust_sum: 0,
                    trust_count: 0,
                    trust_farmer_ids: new Set()
                });
            }

            const bucket = districtBuckets.get(key);
            bucket.total_reports += 1;
            if (isHealthy) {
                bucket.healthy_reports += 1;
            } else {
                bucket.disease_reports += 1;
            }

            const riskScore = Number(report?.risk_score);
            if (Number.isFinite(riskScore)) {
                bucket.risk_sum += riskScore;
                bucket.risk_count += 1;
            }

            const healthScore = Number(report?.health_score);
            if (Number.isFinite(healthScore)) {
                bucket.health_sum += healthScore;
                bucket.health_count += 1;
            }

            if (report?.farmer_id && !bucket.trust_farmer_ids.has(report.farmer_id) && farmerTrust.has(report.farmer_id)) {
                bucket.trust_farmer_ids.add(report.farmer_id);
                bucket.trust_sum += safeNumber(farmerTrust.get(report.farmer_id));
                bucket.trust_count += 1;
            }
        }

        const timestamp = new Date().toISOString();
        const districtRows = Array.from(districtBuckets.values()).map((bucket) => ({
            level: 'district',
            district: bucket.district,
            state: bucket.state,
            avg_risk_score: Number((bucket.risk_count ? bucket.risk_sum / bucket.risk_count : 0).toFixed(4)),
            total_reports: bucket.total_reports,
            healthy_reports: bucket.healthy_reports,
            disease_reports: bucket.disease_reports,
            avg_trust_score: Number((bucket.trust_count ? bucket.trust_sum / bucket.trust_count : 0).toFixed(2)),
            avg_health_score: Number((bucket.health_count ? bucket.health_sum / bucket.health_count : 0).toFixed(2)),
            last_updated: timestamp,
            is_archived: false
        }));

        const stateBuckets = new Map();
        for (const row of districtRows) {
            const key = row.state || 'Unknown State';
            if (!stateBuckets.has(key)) {
                stateBuckets.set(key, {
                    state: key,
                    total_reports: 0,
                    healthy_reports: 0,
                    disease_reports: 0,
                    risk_weighted_sum: 0,
                    health_weighted_sum: 0,
                    trust_weighted_sum: 0
                });
            }

            const stateBucket = stateBuckets.get(key);
            const weight = Math.max(1, safeNumber(row.total_reports));
            stateBucket.total_reports += safeNumber(row.total_reports);
            stateBucket.healthy_reports += safeNumber(row.healthy_reports);
            stateBucket.disease_reports += safeNumber(row.disease_reports);
            stateBucket.risk_weighted_sum += safeNumber(row.avg_risk_score) * weight;
            stateBucket.health_weighted_sum += safeNumber(row.avg_health_score) * weight;
            stateBucket.trust_weighted_sum += safeNumber(row.avg_trust_score) * weight;
        }

        const stateRows = Array.from(stateBuckets.values()).map((bucket) => ({
            level: 'state',
            district: null,
            state: bucket.state,
            avg_risk_score: Number((bucket.total_reports ? bucket.risk_weighted_sum / bucket.total_reports : 0).toFixed(4)),
            total_reports: bucket.total_reports,
            healthy_reports: bucket.healthy_reports,
            disease_reports: bucket.disease_reports,
            avg_trust_score: Number((bucket.total_reports ? bucket.trust_weighted_sum / bucket.total_reports : 0).toFixed(2)),
            avg_health_score: Number((bucket.total_reports ? bucket.health_weighted_sum / bucket.total_reports : 0).toFixed(2)),
            last_updated: timestamp,
            is_archived: false
        }));

        const nationalTotal = stateRows.reduce((sum, row) => sum + safeNumber(row.total_reports), 0);
        const nationalRow = {
            level: 'national',
            district: null,
            state: null,
            avg_risk_score: Number((nationalTotal
                ? stateRows.reduce((sum, row) => sum + safeNumber(row.avg_risk_score) * safeNumber(row.total_reports), 0) / nationalTotal
                : 0
            ).toFixed(4)),
            total_reports: nationalTotal,
            healthy_reports: stateRows.reduce((sum, row) => sum + safeNumber(row.healthy_reports), 0),
            disease_reports: stateRows.reduce((sum, row) => sum + safeNumber(row.disease_reports), 0),
            avg_trust_score: Number((nationalTotal
                ? stateRows.reduce((sum, row) => sum + safeNumber(row.avg_trust_score) * safeNumber(row.total_reports), 0) / nationalTotal
                : 0
            ).toFixed(2)),
            avg_health_score: Number((nationalTotal
                ? stateRows.reduce((sum, row) => sum + safeNumber(row.avg_health_score) * safeNumber(row.total_reports), 0) / nationalTotal
                : 0
            ).toFixed(2)),
            last_updated: timestamp,
            is_archived: false
        };

        await supabase.from('analytics').delete().eq('level', 'district');
        await supabase.from('analytics').delete().eq('level', 'state');

        if (districtRows.length) {
            const { error: districtInsertError } = await supabase.from('analytics').insert(districtRows);
            if (districtInsertError) {
                throw new Error(`Failed to store district analytics: ${districtInsertError.message}`);
            }
        }

        if (stateRows.length) {
            const { error: stateInsertError } = await supabase.from('analytics').insert(stateRows);
            if (stateInsertError) {
                throw new Error(`Failed to store state analytics: ${stateInsertError.message}`);
            }
        }

        const { data: existingNational } = await supabase
            .from('analytics')
            .select('id')
            .eq('level', 'national')
            .limit(1)
            .maybeSingle();

        if (existingNational?.id) {
            const { error: nationalUpdateError } = await supabase
                .from('analytics')
                .update(nationalRow)
                .eq('id', existingNational.id);

            if (nationalUpdateError) {
                throw new Error(`Failed to update national analytics: ${nationalUpdateError.message}`);
            }
        } else {
            const { error: nationalInsertError } = await supabase
                .from('analytics')
                .insert([nationalRow]);

            if (nationalInsertError) {
                throw new Error(`Failed to insert national analytics: ${nationalInsertError.message}`);
            }
        }

        logger.info(`Recompute completed. District rows: ${districtRows.length}, State rows: ${stateRows.length}`);

        return {
            districts_updated: districtRows.length,
            states_updated: stateRows.length,
            national_reports: nationalRow.total_reports,
            last_updated: timestamp
        };
    } catch (error) {
        logger.error('Recompute analytics error:', error);
        throw error;
    }
};

module.exports = {
    checkAnalyticsTableStatus,
    getDistrictAnalytics,
    getStateAnalytics,
    getNationalAnalytics,
    updateDistrictAnalytics,
    updateStateAnalytics,
    getSyntheticAnalyticsSummary,
    loadSyntheticDataset,
    calculateMAE,
    calculateRiskAccuracy,
    getDashboardAnalytics,
    listDistrictAnalytics,
    recomputeAnalyticsFromReports
};
