const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

// POST /api/analyze
router.post('/analyze', analysisController.analyzeCrop);

// GET /api/trust-score/:id
router.get('/trust-score/:id', analysisController.getTrustScore);

module.exports = router;
