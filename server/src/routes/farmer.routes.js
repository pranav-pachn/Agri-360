const express = require('express');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();

// Create or sync farmer profile after authentication
router.post('/', AuthController.createOrSyncFarmerProfile);

// Get farmer profile by ID
router.get('/:farmerId', AuthController.getFarmerProfile);

// Get farmer profile with details (includes crop reports, credit scores)
router.get('/:farmerId/details', AuthController.getFarmerProfileWithDetails);

// Update farmer profile
router.put('/:farmerId', AuthController.updateFarmerProfile);

module.exports = router;
