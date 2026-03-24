const analyticsService = require('../services/analyticsService');
const logger = require('../utils/logger');

const getDistrictAnalytics = async (req, res, next) => {
    try {
        const { district } = req.params;
        
        if (!district) {
            return res.status(400).json({ 
                error: 'Missing parameter: district is required' 
            });
        }
        
        logger.info(`Fetching district analytics for: ${district}`);
        const analytics = await analyticsService.getDistrictAnalytics(district);
        return res.status(200).json(analytics);
    } catch (error) {
        logger.error('District analytics error:', error);
        next(error);
    }
};

const getStateAnalytics = async (req, res, next) => {
    try {
        const { state } = req.params;
        
        if (!state) {
            return res.status(400).json({ 
                error: 'Missing parameter: state is required' 
            });
        }
        
        logger.info(`Fetching state analytics for: ${state}`);
        const analytics = await analyticsService.getStateAnalytics(state);
        return res.status(200).json(analytics);
    } catch (error) {
        logger.error('State analytics error:', error);
        next(error);
    }
};

const getNationalAnalytics = async (req, res, next) => {
    try {
        logger.info('Fetching national analytics');
        const analytics = await analyticsService.getNationalAnalytics();
        return res.status(200).json(analytics);
    } catch (error) {
        logger.error('National analytics error:', error);
        next(error);
    }
};

const getDashboardAnalytics = async (req, res, next) => {
    try {
        logger.info('Fetching dashboard analytics summary');
        const dashboardData = await analyticsService.getDashboardAnalytics();
        return res.status(200).json(dashboardData);
    } catch (error) {
        logger.error('Dashboard analytics error:', error);
        next(error);
    }
};

const updateDistrictAnalytics = async (req, res, next) => {
    try {
        const { district } = req.params;
        const { avg_risk_score, total_reports, healthy_reports, avg_trust_score, avg_health_score } = req.body;
        
        if (!district) {
            return res.status(400).json({ 
                error: 'Missing parameter: district is required' 
            });
        }
        
        if (avg_risk_score === undefined) {
            return res.status(400).json({ 
                error: 'Missing required field: avg_risk_score' 
            });
        }
        
        logger.info(`Updating district analytics for: ${district}`);
        const success = await analyticsService.updateDistrictAnalytics(district, {
            avg_risk_score,
            total_reports,
            healthy_reports,
            avg_trust_score,
            avg_health_score
        });
        
        return res.status(200).json({ success, message: 'District analytics updated successfully' });
    } catch (error) {
        logger.error('District analytics update error:', error);
        next(error);
    }
};

const updateStateAnalytics = async (req, res, next) => {
    try {
        const { state } = req.params;
        const { avg_risk_score, total_reports, healthy_reports, avg_trust_score, avg_health_score } = req.body;
        
        if (!state) {
            return res.status(400).json({ 
                error: 'Missing parameter: state is required' 
            });
        }
        
        if (avg_risk_score === undefined) {
            return res.status(400).json({ 
                error: 'Missing required field: avg_risk_score' 
            });
        }
        
        logger.info(`Updating state analytics for: ${state}`);
        const success = await analyticsService.updateStateAnalytics(state, {
            avg_risk_score,
            total_reports,
            healthy_reports,
            avg_trust_score,
            avg_health_score
        });
        
        return res.status(200).json({ success, message: 'State analytics updated successfully' });
    } catch (error) {
        logger.error('State analytics update error:', error);
        next(error);
    }
};

module.exports = {
    getDistrictAnalytics,
    getStateAnalytics,
    getNationalAnalytics,
    getDashboardAnalytics,
    updateDistrictAnalytics,
    updateStateAnalytics
};
