import React, { useEffect, useMemo, useState } from 'react';
import SummaryCards from '../components/analytics/SummaryCards';
import FilterBar from '../components/analytics/FilterBar';
import RiskTable from '../components/analytics/RiskTable';
import IndiaRiskHeatmap from '../components/analytics/IndiaRiskHeatmap';
import { API_URL } from '../services/api';

const readRisk = (row = {}) => {
  const value = Number(row.risk ?? row.avg_risk_score ?? 0);
  return Number.isFinite(value) ? value : 0;
};

const Analytics = () => {
  const [districtRows, setDistrictRows] = useState([]);
  const [loadingRows, setLoadingRows] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [sortAsc, setSortAsc] = useState(false);

  const loadDistrictRows = async (stateFilter = selectedState) => {
    setLoadingRows(true);
    setError('');
    try {
      const query = stateFilter && stateFilter !== 'All'
        ? `?state=${encodeURIComponent(stateFilter)}`
        : '';
      const response = await fetch(`${API_URL}/v1/analytics/districts/list${query}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch district intelligence (${response.status})`);
      }

      const payload = await response.json();
      const rows = Array.isArray(payload?.data) ? payload.data : [];
      setDistrictRows(rows);
    } catch (fetchError) {
      setError(fetchError.message || 'District intelligence is unavailable right now.');
      setDistrictRows([]);
    } finally {
      setLoadingRows(false);
    }
  };

  useEffect(() => {
    loadDistrictRows(selectedState);
  }, [selectedState]);

  const stateOptions = useMemo(() => {
    const names = districtRows.map((row) => row.state).filter(Boolean);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [districtRows]);

  const districtOptions = useMemo(() => {
    const scoped = selectedState === 'All'
      ? districtRows
      : districtRows.filter((row) => row.state === selectedState);
    const names = scoped.map((row) => row.district).filter(Boolean);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [districtRows, selectedState]);

  useEffect(() => {
    if (selectedDistrict !== 'All' && !districtOptions.includes(selectedDistrict)) {
      setSelectedDistrict('All');
    }
  }, [districtOptions, selectedDistrict]);

  const filteredData = useMemo(() => {
    let data = [...districtRows];

    if (selectedDistrict !== 'All') {
      data = data.filter((row) => row.district === selectedDistrict);
    }

    if (selectedCrop !== 'All') {
      data = data.filter((row) => (row.crop || row.crop_type) === selectedCrop);
    }

    return data.sort((a, b) => sortAsc ? readRisk(a) - readRisk(b) : readRisk(b) - readRisk(a));
  }, [districtRows, selectedDistrict, selectedCrop, sortAsc]);

  const handleRecompute = async () => {
    setRefreshing(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/v1/analytics/recompute`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Recompute failed (${response.status})`);
      }

      await loadDistrictRows(selectedState);
    } catch (recomputeError) {
      setError(recomputeError.message || 'Failed to recompute analytics.');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="border-b border-slate-800 pb-5">
          <div className="flex items-center space-x-2 text-green-400 text-sm font-bold uppercase tracking-wider mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">District Risk Intelligence</h1>
          <p className="text-slate-400 mt-1 max-w-xl">
            Real-time agricultural risk data aggregated across districts to support policy decisions and financial assessments.
          </p>
        </div>

        {/* Summary Cards */}
        <SummaryCards data={filteredData} />

        {/* Filter Bar */}
        <FilterBar
          selectedCrop={selectedCrop}
          onCropChange={setSelectedCrop}
          selectedState={selectedState}
          onStateChange={setSelectedState}
          selectedDistrict={selectedDistrict}
          onDistrictChange={setSelectedDistrict}
          states={stateOptions}
          districts={districtOptions}
          onSort={() => setSortAsc(prev => !prev)}
          sortAsc={sortAsc}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3">
          <p className="text-xs text-slate-300">
            {loadingRows ? 'Loading live district intelligence...' : `Loaded ${districtRows.length} district records`}
          </p>
          <button
            onClick={handleRecompute}
            disabled={refreshing}
            className="rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-300 transition hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {refreshing ? 'Refreshing...' : 'Refresh Real Data'}
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <IndiaRiskHeatmap
          selectedState={selectedState}
          onStateSelect={setSelectedState}
          selectedDistrict={selectedDistrict}
          onDistrictSelect={setSelectedDistrict}
          districtRows={districtRows}
        />

        {/* Risk Table */}
        <RiskTable data={filteredData} />

        {/* Footer note */}
        <p className="text-slate-600 text-xs text-right pb-2">
          Data is AI-generated from crop image analysis. Figures are indicative.
        </p>

      </div>
    </div>
  );
};

export default Analytics;
