const analysisService = require('../services/analysisService');

const analyzeCrop = async (req, res) => {
  try {
    const { crop, location } = req.body;

    if (!crop || !location) {
      return res.status(400).json({ error: 'crop and location are required inputs' });
    }

    const result = await analysisService.generateAnalysis(crop, location);
    return res.status(201).json(result);
  } catch (error) {
    console.error('Error in analyzeCrop controller:', error);
    return res.status(500).json({ error: error.message || 'Internal server error while analyzing' });
  }
};

const getTrustScore = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'id parameter is required' });
    }

    const result = await analysisService.getAnalysisById(id);
    
    if (!result) {
      return res.status(404).json({ error: 'Analysis not found for the given ID' });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in getTrustScore controller:', error);
    return res.status(500).json({ error: error.message || 'Internal server error while fetching trust score' });
  }
};

module.exports = {
  analyzeCrop,
  getTrustScore
};
