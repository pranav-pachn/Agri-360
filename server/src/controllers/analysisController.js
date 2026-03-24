const analysisService = require('../services/analysisService');
const logger = require('../utils/logger');

const analyzeCrop = async (req, res, next) => {
  try {
    const { crop, location } = req.body;

    // STEP 6: Simple Validation
    if (!crop || !location) {
      return res.status(400).json({ error: 'Missing fields: crop and location are required' });
    }

    logger.info(`Analyzing crop: ${crop} in location: ${location}`);
    const result = await analysisService.generateAnalysis(crop, location);
    
    // STEP 9: Optimize API Response is handled by the service structure natively for the presentation layer 
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getTrustScore = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Missing field: id parameter is required' });
    }

    logger.info(`Fetching trust score for ID: ${id}`);
    const result = await analysisService.getAnalysisById(id);
    
    if (!result) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllAnalyses = async (req, res, next) => {
  try {
    logger.info('Fetching all analyses');
    const results = await analysisService.getAllAnalyses();
    return res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const getExplainability = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Missing field: id parameter is required' });
    }

    logger.info(`Fetching explainability for ID: ${id}`);
    const result = await analysisService.getExplainability(id);
    
    if (!result) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeCrop,
  getTrustScore,
  getAllAnalyses,
  getExplainability
};
