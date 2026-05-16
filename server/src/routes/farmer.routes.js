const express = require('express');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();

// Loan applications list with pagination/filtering/search
router.get('/loan-applications', AuthController.getLoanApplications);

// Loan application status workflow update
router.patch('/loan-applications/:applicationId/status', AuthController.updateLoanApplicationStatus);

// Pending applications feed for loan officer dashboard
router.get('/pending-applications', AuthController.getPendingApplications);

// Create or sync farmer profile after authentication
router.post('/', AuthController.createOrSyncFarmerProfile);

// Get farmer profile by ID
router.get('/:farmerId', AuthController.getFarmerProfile);

// Get farmer profile with details (includes crop reports, credit scores)
router.get('/:farmerId/details', AuthController.getFarmerProfileWithDetails);

// Update farmer profile
router.put('/:farmerId', AuthController.updateFarmerProfile);

module.exports = router;
