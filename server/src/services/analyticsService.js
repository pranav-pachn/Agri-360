const supabase = require('../config/supabase');
const logger = require('../utils/logger');

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

// Aggregate analytics data for dashboard
const getDashboardAnalytics = async () => {
    try {
        logger.info('Fetching dashboard analytics summary');
        
        const { data: districts, error: districtsError } = await supabase
            .from('analytics')
            .select('district, avg_risk_score, total_reports, healthy_reports')
            .eq('level', 'district');
        
        const { data: states, error: statesError } = await supabase
            .from('analytics')
            .select('state, avg_risk_score, avg_trust_score, total_reports, healthy_reports, last_updated')
            .eq('level', 'state');
        
        const { data: national, error: nationalError } = await supabase
            .from('analytics')
            .select('avg_risk_score, total_reports, healthy_reports, avg_trust_score')
            .eq('level', 'national')
            .single();
        
        if (districtsError || statesError || nationalError) {
            throw new Error('Failed to fetch dashboard analytics');
        }
        
        const dashboardData = {
            districts: districts || [],
            states: states || [],
            national: national,
            summary: {
                total_districts: districts?.length || 0,
                total_states: states?.length || 0,
                national_avg_risk: national?.avg_risk_score || 0,
                national_avg_trust: national?.avg_trust_score || 0
            }
        };
        
        logger.info('Dashboard analytics retrieved successfully');
        return dashboardData;
    } catch (error) {
        logger.error('Dashboard analytics error:', error);
        throw error;
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
            throw new Error(`Failed to fetch district list: ${error.message}`);
        }

        return data || [];
    } catch (error) {
        logger.error('District list analytics error:', error);
        throw error;
    }
};

const recomputeAnalyticsFromReports = async () => {
    try {
        logger.info('Recomputing analytics from crop reports');

        const [{ data: reports, error: reportsError }, { data: farmers, error: farmersError }, { data: credits, error: creditsError }] = await Promise.all([
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

        if (reportsError || farmersError || creditsError) {
            throw new Error('Failed to load source data for analytics recompute');
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
    getDistrictAnalytics,
    getStateAnalytics,
    getNationalAnalytics,
    updateDistrictAnalytics,
    updateStateAnalytics,
    getDashboardAnalytics,
    listDistrictAnalytics,
    recomputeAnalyticsFromReports
};
