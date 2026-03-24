const supabase = require('../config/supabase');
const logger = require('../utils/logger');

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
            .select('state, avg_trust_score, total_reports, healthy_reports')
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

module.exports = {
    getDistrictAnalytics,
    getStateAnalytics,
    getNationalAnalytics,
    updateDistrictAnalytics,
    updateStateAnalytics,
    getDashboardAnalytics
};
