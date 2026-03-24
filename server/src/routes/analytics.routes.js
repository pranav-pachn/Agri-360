const express = require('express');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

// Public analytics endpoints (no authentication required)
router.get('/district/:district', analyticsController.getDistrictAnalytics);
router.get('/state/:state', analyticsController.getStateAnalytics);
router.get('/national', analyticsController.getNationalAnalytics);
router.get('/dashboard', analyticsController.getDashboardAnalytics);

// Protected analytics endpoints (admin authentication required)
router.post('/district/:district/update', analyticsController.updateDistrictAnalytics);
router.post('/state/:state/update', analyticsController.updateStateAnalytics);

module.exports = router;
