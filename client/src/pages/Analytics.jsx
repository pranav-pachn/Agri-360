import React, { useState, useMemo } from 'react';
import SummaryCards from '../components/analytics/SummaryCards';
import FilterBar from '../components/analytics/FilterBar';
import RiskTable from '../components/analytics/RiskTable';
import IndiaRiskHeatmap from '../components/analytics/IndiaRiskHeatmap';

const DISTRICT_DATA = [
  { district: 'Guntur',       crop: 'Tomato',  risk: 0.82 },
  { district: 'Nellore',      crop: 'Rice',    risk: 0.67 },
  { district: 'Kurnool',      crop: 'Wheat',   risk: 0.21 },
  { district: 'Krishna',      crop: 'Rice',    risk: 0.75 },
  { district: 'Vizianagaram', crop: 'Maize',   risk: 0.44 },
  { district: 'Chittoor',     crop: 'Tomato',  risk: 0.91 },
  { district: 'Prakasam',     crop: 'Wheat',   risk: 0.33 },
  { district: 'Srikakulam',   crop: 'Rice',    risk: 0.58 },
  { district: 'West Godavari',crop: 'Rice',    risk: 0.39 },
  { district: 'East Godavari',crop: 'Maize',   risk: 0.77 },
  { district: 'Anantapur',    crop: 'Potato',  risk: 0.15 },
  { district: 'Kadapa',       crop: 'Potato',  risk: 0.62 },
];

const Analytics = () => {
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredData = useMemo(() => {
    let data = selectedCrop === 'All'
      ? [...DISTRICT_DATA]
      : DISTRICT_DATA.filter(d => d.crop === selectedCrop);

    return data.sort((a, b) => sortAsc ? a.risk - b.risk : b.risk - a.risk);
  }, [selectedCrop, sortAsc]);

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
          onSort={() => setSortAsc(prev => !prev)}
          sortAsc={sortAsc}
        />

        <IndiaRiskHeatmap />

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
