const supabase = require('../config/supabase');

class FarmerModel {
  // Create or get farmer profile
  static async createOrUpdateFarmer(userId, email, name, location = null) {
    try {
      // Check if farmer already exists
      const { data: existingFarmer, error: selectError } = await supabase
        .from('farmers')
        .select('*')
        .eq('id', userId)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        // PGRST116 means no rows found, which is fine
        throw selectError;
      }

      if (existingFarmer) {
        // Update existing farmer
        const { data, error } = await supabase
          .from('farmers')
          .update({
            name: name || existingFarmer.name,
            location: location || existingFarmer.location,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new farmer
        const { data, error } = await supabase
          .from('farmers')
          .insert({
            id: userId,
            name: name || email.split('@')[0], // Use email prefix as default name
            location: location || 'Not specified',
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error creating/updating farmer:', error);
      throw error;
    }
  }

  // Get farmer profile by ID
  static async getFarmerById(farmerId) {
    try {
      const { data, error } = await supabase
        .from('farmers')
        .select('*')
        .eq('id', farmerId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching farmer:', error);
      throw error;
    }
  }

  // Update farmer profile
  static async updateFarmer(farmerId, updates) {
    try {
      const { data, error } = await supabase
        .from('farmers')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', farmerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating farmer:', error);
      throw error;
    }
  }

  // Get farmer with related data (reports, scores, etc.)
  static async getFarmerWithDetails(farmerId) {
    try {
      const { data: farmer, error: farmerError } = await supabase
        .from('farmers')
        .select('*')
        .eq('id', farmerId)
        .single();

      if (farmerError) throw farmerError;

      // Get recent crop reports
      const { data: reports } = await supabase
        .from('crop_reports')
        .select('*')
        .eq('farmer_id', farmerId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Get credit scores
      const { data: creditScores } = await supabase
        .from('credit_scores')
        .select('*')
        .eq('farmer_id', farmerId)
        .order('updated_at', { ascending: false })
        .limit(1);

      return {
        ...farmer,
        recent_reports: reports || [],
        credit_score: creditScores?.[0] || null,
      };
    } catch (error) {
      console.error('Error fetching farmer with details:', error);
      throw error;
    }
  }
}

module.exports = FarmerModel;