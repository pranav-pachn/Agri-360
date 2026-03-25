const FarmerModel = require('../models/farmer.model');

class AuthController {
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