const analysisService = require('../services/analysisService');
const storageService = require('../services/storage.service');
const logger = require('../utils/logger');

// Enhanced file validation function
const isValidImageFile = (file) => {
    if (!file) return false;
    
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    return file.buffer.length <= maxSize && allowedTypes.includes(file.mimetype);
};

const analyzeCrop = async (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                error: 'Invalid request payload'
            });
        }

        const { crop, location, fertilizerUsage, farmerId } = req.body;
        
        // Enhanced validation
        if (!crop || !location) {
            return res.status(400).json({ 
                error: 'Missing required fields: crop and location' 
            });
        }
        
        // Simple validation: ensure crop is a non‑empty string
        if (!crop || typeof crop !== 'string' || crop.trim().length === 0) {
            return res.status(400).json({
                error: 'Invalid crop type. Must be a non‑empty string.'
            });
        }
        
        // Validate location
        if (location.trim().length < 2) {
            return res.status(400).json({ 
                error: 'Invalid location. Must be at least 2 characters long' 
            });
        }
        
        let imageUrl = null;
        if (req.file) {
            // Enhanced file validation
            if (!isValidImageFile(req.file)) {
                return res.status(400).json({
                    error: 'Invalid file. Must be JPEG, PNG, or WebP under 5MB'
                });
            }
            
            logger.info(`Uploading image for ${crop} analysis...`);
            imageUrl = await storageService.uploadCropImage(
                req.file.buffer, 
                req.file.originalname, 
                req.file.mimetype
            );
            logger.info(`Image uploaded successfully: ${imageUrl}`);
        } else {
            logger.info('No image provided, proceeding with text-only analysis.');
        }
        
        logger.info(`Analyzing crop: ${crop} in location: ${location} with fertilizer: ${fertilizerUsage || 'medium'}`);
        const result = await analysisService.generateAnalysis(crop, location, imageUrl, fertilizerUsage, farmerId || null);
        
        return res.status(201).json({
            success: true,
            message: 'Analysis completed successfully',
            data: result
        });
    } catch (error) {
        logger.error('Analysis error:', error);
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
