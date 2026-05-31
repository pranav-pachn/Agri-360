const express = require('express');
const router = express.Router();
const mlopsController = require('../controllers/mlops.controller');

router.get('/model-versions', mlopsController.getModelVersions);
router.post('/model-versions', mlopsController.addModelVersion);
router.post('/prediction-feedback', mlopsController.submitPredictionFeedback);
router.get('/monitoring', mlopsController.getMonitoringStats);

module.exports = router;
