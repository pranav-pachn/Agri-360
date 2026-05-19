const supabase = require('../config/supabase');

class FarmerModel {
  static isMissingLoanApplicationsTable(error = null) {
    const code = String(error?.code || '').trim();
    const message = String(error?.message || '').toLowerCase();
    return code === 'PGRST205' || (message.includes('loan_applications') && message.includes('schema cache')) || (message.includes('loan_applications') && message.includes('does not exist'));
  }

  static normalizeApplicationStatus(value = '') {
    const candidate = String(value || '').toLowerCase();
    if (candidate === 'approved') return 'approved';
    if (candidate === 'rejected') return 'rejected';
    return 'pending';
  }

  static toTrustScore(scoreRecord = null) {
    if (!scoreRecord || typeof scoreRecord !== 'object') return 0;
    const candidates = [scoreRecord.trust_score, scoreRecord.score];
    for (const value of candidates) {
      const num = Number(value);
      if (Number.isFinite(num)) return num;
    }
    return 0;
  }

  static toRiskCategory(scoreRecord = null, trustScore = 0) {
    const raw = String(scoreRecord?.risk_category || '').toLowerCase();
    if (raw === 'low' || raw === 'medium' || raw === 'high') return raw;
    if (trustScore >= 700) return 'low';
    if (trustScore >= 550) return 'medium';
    return 'high';
  }

  // Seed pending loan applications from recent crop reports when table exists but has no rows.
  static async bootstrapLoanApplications(maxSeed = 200) {
    const safeSeed = Math.max(1, Math.min(Number(maxSeed) || 200, 500));

    const { data: existingRows, error: existingError } = await supabase
      .from('loan_applications')
      .select('id')
      .limit(1);

    if (existingError) throw existingError;
    if ((existingRows || []).length > 0) return;

    const { data: reports, error: reportsError } = await supabase
      .from('crop_reports')
      .select('id,farmer_id,created_at')
      .not('farmer_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(safeSeed);

    if (reportsError) throw reportsError;

    if (!(reports || []).length) return;

    const seedRows = reports.map((report) => ({
      farmer_id: report.farmer_id,
      crop_report_id: report.id,
      requested_amount: 500000,
      status: 'pending',
      created_at: report.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error: seedError } = await supabase
      .from('loan_applications')
      .upsert(seedRows, { onConflict: 'crop_report_id' });

    if (seedError) throw seedError;
  }

  static async buildApplicationsPayload(loanApps = [], page = 1, pageSize = 10, search = '') {
    const rows = Array.isArray(loanApps) ? loanApps : [];
    const farmerIds = Array.from(new Set(rows.map((row) => row.farmer_id).filter(Boolean)));
    const reportIds = Array.from(new Set(rows.map((row) => row.crop_report_id).filter(Boolean)));

    let farmersById = new Map();
    let reportsById = new Map();
    let scoresByFarmer = new Map();

    if (farmerIds.length) {
      const [{ data: farmers, error: farmersError }, { data: scores, error: scoresError }] = await Promise.all([
        supabase
          .from('farmers')
          .select('id,name,location')
          .in('id', farmerIds),
        supabase
          .from('credit_scores')
          .select('*')
          .in('farmer_id', farmerIds),
      ]);

      if (farmersError) throw farmersError;
      if (scoresError) throw scoresError;

      farmersById = new Map((farmers || []).map((row) => [row.id, row]));
      (scores || [])
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        .forEach((row) => {
          if (!scoresByFarmer.has(row.farmer_id)) {
            scoresByFarmer.set(row.farmer_id, row);
          }
        });
    }

    if (reportIds.length) {
      const { data: reports, error: reportsError } = await supabase
        .from('crop_reports')
        .select('*')
        .in('id', reportIds);

      if (reportsError) throw reportsError;
      reportsById = new Map((reports || []).map((row) => [row.id, row]));
    }

    const enriched = rows.map((row) => {
      const farmer = farmersById.get(row.farmer_id) || {};
      const report = reportsById.get(row.crop_report_id) || {};
      const scoreRecord = scoresByFarmer.get(row.farmer_id) || null;
      const trustScore = this.toTrustScore(scoreRecord) || Number(row.trustScore || row.trust_score || row.score || 0);
      const riskCategory = this.toRiskCategory(scoreRecord, trustScore) || String(row.riskCategory || 'medium').toLowerCase();

      return {
        id: row.id,
        farmerId: row.farmer_id,
        cropReportId: row.crop_report_id,
        name: farmer.name || 'Unknown Farmer',
        location: farmer.location || 'Unknown location',
        crop: report.crop_type || report.crop || 'Mixed Crop',
        requestedAmount: Number(row.requested_amount || 0),
        appliedAt: row.created_at || report.created_at || new Date().toISOString(),
        updatedAt: row.updated_at || row.created_at || null,
        status: this.normalizeApplicationStatus(row.status),
        trustScore,
        riskCategory,
      };
    });

    const normalizedSearch = String(search || '').trim().toLowerCase();
    const filtered = normalizedSearch
      ? enriched.filter((item) =>
          [item.name, item.location, item.crop, item.status]
            .filter(Boolean)
            .some((field) => String(field).toLowerCase().includes(normalizedSearch))
        )
      : enriched;

    const total = filtered.length;
    const safePageSize = Math.max(1, Math.min(Number(pageSize) || 10, 100));
    const safePage = Math.max(1, Number(page) || 1);
    const start = (safePage - 1) * safePageSize;
    const items = filtered.slice(start, start + safePageSize);

    return {
      items,
      total,
      page: safePage,
      pageSize: safePageSize,
    };
  }

  static async buildPendingApplicationsFallback(limit = 42) {
    const safeLimit = Math.max(1, Math.min(Number(limit) || 42, 100));

    const [{ data: reports, error: reportsError }, { data: farmers, error: farmersError }, { data: scores, error: scoresError }] = await Promise.all([
      supabase
        .from('crop_reports')
        .select('id,farmer_id,crop,location,health,risk,yield,trust_score,created_at')
        .not('farmer_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(safeLimit),
      supabase
        .from('farmers')
        .select('id,name,location'),
      supabase
        .from('credit_scores')
        .select('*'),
    ]);

    if (reportsError) throw reportsError;
    if (farmersError) throw farmersError;
    if (scoresError) throw scoresError;

    const farmersById = new Map((farmers || []).map((row) => [row.id, row]));
    const scoresByFarmer = new Map(
      (scores || [])
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        .map((row) => [row.farmer_id, row])
    );

    const syntheticLoanRows = (reports || []).map((report) => {
      const farmer = farmersById.get(report.farmer_id) || {};
      const scoreRecord = scoresByFarmer.get(report.farmer_id) || null;
      const trustScore = this.toTrustScore(scoreRecord) || Number(report.trust_score || 0);
      const riskCategory = this.toRiskCategory(scoreRecord, trustScore);

      return {
        id: report.id,
        farmer_id: report.farmer_id,
        crop_report_id: report.id,
        requested_amount: Math.max(100000, Math.round((Number(report.yield) || 1) * 100000)),
        status: 'pending',
        created_at: report.created_at,
        updated_at: report.created_at,
        name: farmer.name || 'Unknown Farmer',
        location: farmer.location || report.location || 'Unknown location',
        crop: report.crop || 'Mixed Crop',
        trustScore,
        riskCategory,
      };
    });

    return this.buildApplicationsPayload(syntheticLoanRows, 1, safeLimit, '');
  }

  static async getLoanApplications({ status = '', page = 1, pageSize = 10, search = '' } = {}) {
    try {
      const normalizedStatus = String(status || '').trim().toLowerCase();
      const isStatusFilter = ['pending', 'approved', 'rejected'].includes(normalizedStatus);

      let query = supabase
        .from('loan_applications')
        .select('id,farmer_id,crop_report_id,requested_amount,status,created_at,updated_at')
        .order('created_at', { ascending: false })
        .limit(500);

      if (isStatusFilter) {
        query = query.eq('status', normalizedStatus);
      }

      let result = await query;

      if (result.error) {
        if (!this.isMissingLoanApplicationsTable(result.error)) {
          throw result.error;
        }

        return await this.buildPendingApplicationsFallback(Math.max(1, Math.min(Number(pageSize) || 10, 100)));
      }

      if (!(result.data || []).length) {
        try {
          await this.bootstrapLoanApplications();
          result = await query;
        } catch (bootstrapError) {
          console.warn('Loan application bootstrap skipped:', bootstrapError.message);
        }
      }

      if (result.error) throw result.error;

      return await this.buildApplicationsPayload(result.data || [], page, pageSize, search);
    } catch (error) {
      console.error('Error fetching loan applications:', error);
      throw error;
    }
  }

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

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error fetching farmer:', error);
      throw error;
    }
  }

  // Update farmer profile
  static async updateFarmer(farmerId, updates) {
    try {
      // Separate known columns from flexible profile fields.
      const KNOWN_COLUMNS = ['name', 'location'];

      const baseUpdates = {};
      const profileUpdates = {};

      for (const [k, v] of Object.entries(updates || {})) {
        if (KNOWN_COLUMNS.includes(k)) baseUpdates[k] = v;
        else profileUpdates[k] = v;
      }

      // First, update known columns so that basic profile fields are saved
      // even when the DB schema doesn't include the extended profile fields.
      if (Object.keys(baseUpdates).length > 0) {
        const { data: baseData, error: baseError } = await supabase
          .from('farmers')
          .update({
            ...baseUpdates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', farmerId)
          .select()
          .single();

        if (baseError) throw baseError;

        // Attempt to merge profile fields if any exist; ignore errors here
        // so missing schema columns don't surface to the client.
        if (Object.keys(profileUpdates).length > 0) {
          try {
            const { data: existing, error: fetchErr } = await supabase
              .from('farmers')
              .select('profile')
              .eq('id', farmerId)
              .single();

            const existingProfile = (existing && existing.profile) || {};
            const newProfile = { ...existingProfile, ...profileUpdates };

            await supabase
              .from('farmers')
              .update({ profile: newProfile, updated_at: new Date().toISOString() })
              .eq('id', farmerId);
          } catch (ignoreErr) {
            // Intentionally ignore profile update errors (missing column/schema mismatches)
            console.warn('Profile merge skipped due to schema mismatch:', ignoreErr?.message || ignoreErr);
          }
        }

        return baseData;
      }

      // If there are no known columns to update, attempt profile-only update.
      // This may fail on older schemas; let errors bubble up in that case.
      const { data: existing, error: fetchErr } = await supabase
        .from('farmers')
        .select('profile')
        .eq('id', farmerId)
        .single();

      if (fetchErr && fetchErr.code !== 'PGRST116') {
        throw fetchErr;
      }

      const existingProfile = (existing && existing.profile) || {};
      const newProfile = { ...existingProfile, ...profileUpdates };

      const { data, error } = await supabase
        .from('farmers')
        .update({
          profile: newProfile,
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

      if (farmerError) {
        if (farmerError.code === 'PGRST116') return null;
        throw farmerError;
      }

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
        .order('created_at', { ascending: false })
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

  // Get pending loan applications feed from recent crop reports + trust snapshots
  static async getPendingApplications(limit = 42) {
    try {
      const safeLimit = Math.max(1, Math.min(Number(limit) || 42, 100));
      const response = await this.getLoanApplications({
        status: 'pending',
        page: 1,
        pageSize: safeLimit,
        search: '',
      });

      return response.items;
    } catch (error) {
      console.error('Error fetching pending applications:', error);
      return [];
    }
  }

  static async updateLoanApplicationStatus(applicationId, status) {
    try {
      const normalizedStatus = this.normalizeApplicationStatus(status);

      const { error: selectError } = await supabase
        .from('loan_applications')
        .select('id')
        .eq('id', applicationId)
        .limit(1);

      if (selectError && this.isMissingLoanApplicationsTable(selectError)) {
        return {
          id: applicationId,
          status: normalizedStatus,
          updated_at: new Date().toISOString(),
          fallback: true,
        };
      }

      const { data, error } = await supabase
        .from('loan_applications')
        .update({
          status: normalizedStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', applicationId)
        .select('id,status,updated_at')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating loan application status:', error);
      throw error;
    }
  }
}

module.exports = FarmerModel;