const FarmerModel = require('../models/farmer.model');

class AuthController {
  // Get loan applications list with status filter, pagination and search.
  static async getLoanApplications(req, res) {
    try {
      const { status = '', page = 1, pageSize = 10, search = '' } = req.query;
      const data = await FarmerModel.getLoanApplications({ status, page, pageSize, search });

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error('Error in getLoanApplications:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Update a loan application workflow status.
  static async updateLoanApplicationStatus(req, res) {
    try {
      const { applicationId } = req.params;
      const { status } = req.body || {};

      const allowed = ['pending', 'approved', 'rejected'];
      if (!allowed.includes(String(status || '').toLowerCase())) {
        return res.status(400).json({ error: 'status must be one of: pending, approved, rejected' });
      }

      if (!applicationId) {
        return res.status(400).json({ error: 'applicationId is required' });
      }

      const updated = await FarmerModel.updateLoanApplicationStatus(applicationId, status);

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      console.error('Error in updateLoanApplicationStatus:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Get pending loan applications feed
  static async getPendingApplications(req, res) {
    try {
      const { limit } = req.query;
      const applications = await FarmerModel.getPendingApplications(limit);

      res.status(200).json({
        success: true,
        data: applications,
      });
    } catch (error) {
      console.error('Error in getPendingApplications:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Create or sync farmer profile after authentication
  static async createOrSyncFarmerProfile(req, res) {
    try {
      const { userId, email, name, location } = req.body;

      if (!userId || !email) {
        return res.status(400).json({ error: 'userId and email are required' });
      }

      const farmerProfile = await FarmerModel.createOrUpdateFarmer(
        userId,
        email,
        name,
        location
      );

      res.status(200).json({
        success: true,
        data: farmerProfile,
        message: 'Farmer profile created/updated successfully',
      });
    } catch (error) {
      console.error('Error in createOrSyncFarmerProfile:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Get farmer profile
  static async getFarmerProfile(req, res) {
    try {
      const { farmerId } = req.params;

      if (!farmerId) {
        return res.status(400).json({ error: 'farmerId is required' });
      }

      const farmerProfile = await FarmerModel.getFarmerById(farmerId);

      res.status(200).json({
        success: true,
        data: farmerProfile,
      });
    } catch (error) {
      console.error('Error in getFarmerProfile:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Get farmer profile with details
  static async getFarmerProfileWithDetails(req, res) {
    try {
      const { farmerId } = req.params;

      if (!farmerId) {
        return res.status(400).json({ error: 'farmerId is required' });
      }

      const farmerProfile = await FarmerModel.getFarmerWithDetails(farmerId);

      res.status(200).json({
        success: true,
        data: farmerProfile,
      });
    } catch (error) {
      console.error('Error in getFarmerProfileWithDetails:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Update farmer profile
  static async updateFarmerProfile(req, res) {
    try {
      const { farmerId } = req.params;
      const updates = req.body;

      if (!farmerId) {
        return res.status(400).json({ error: 'farmerId is required' });
      }

      const updatedProfile = await FarmerModel.updateFarmer(farmerId, updates);

      res.status(200).json({
        success: true,
        data: updatedProfile,
        message: 'Farmer profile updated successfully',
      });
    } catch (error) {
      console.error('Error in updateFarmerProfile:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;