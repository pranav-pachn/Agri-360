const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const upload = require('../middlewares/upload.middleware');

// POST /api/analyze
router.post('/analyze', upload.single('image'), analysisController.analyzeCrop);

// GET /api/analysis
router.get('/analysis', analysisController.getAllAnalyses);

// GET /api/analysis/:id
router.get('/analysis/:id', analysisController.getTrustScore);

// GET /api/trust-score/:id (Keeping for backwards compatibility with roadmap / existing logic)
router.get('/trust-score/:id', analysisController.getTrustScore);

// GET /api/trust-score/:id/explain
router.get('/trust-score/:id/explain', analysisController.getExplainability);

module.exports = router;
