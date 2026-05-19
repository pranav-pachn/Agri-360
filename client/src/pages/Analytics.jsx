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

const formatYield = (value) => `${Number(value || 0).toFixed(2)} t/ha`;

const riskBandMeta = {
  High: { color: '#f87171', label: 'High Risk' },
  Medium: { color: '#facc15', label: 'Medium Risk' },
  Low: { color: '#4ade80', label: 'Low Risk' },
};

const YieldComparisonChart = ({ series = [] }) => {
  if (!series.length) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
        <h2 className="text-lg font-bold text-white">Predicted vs Actual Yield</h2>
        <p className="mt-4 text-sm text-slate-400">Yield comparison data is unavailable.</p>
      </div>
    );
  }

  const width = 640;
  const height = 260;
  const padding = 28;
  const values = series.flatMap((point) => [Number(point.predicted), Number(point.actual)]);
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);
  const span = Math.max(1, maxValue - minValue);

  const xForIndex = (index) => {
    if (series.length === 1) return width / 2;
    return padding + (index * (width - padding * 2)) / (series.length - 1);
  };

  const yForValue = (value) => (
    height - padding - ((Number(value) - minValue) / span) * (height - padding * 2)
  );

  const buildPath = (key) => series.map((point, index) => {
    const x = xForIndex(index);
    const y = yForValue(point[key]);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Predicted vs Actual Yield</h2>
          <p className="mt-1 text-sm text-slate-400">Line comparison across sample farm records to show model credibility.</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-slate-300">
          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />Predicted</span>
          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-sky-400" />Actual</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 w-full">
        {[0, 1, 2, 3].map((step) => {
          const y = padding + (step * (height - padding * 2)) / 3;
          return (
            <line
              key={step}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#334155"
              strokeDasharray="4 6"
              strokeWidth="1"
            />
          );
        })}
        <path d={buildPath('predicted')} fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d={buildPath('actual')} fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {series.map((point, index) => (
          <g key={`${point.label}-${index}`}>
            <circle cx={xForIndex(index)} cy={yForValue(point.predicted)} r="4" fill="#4ade80" />
            <circle cx={xForIndex(index)} cy={yForValue(point.actual)} r="4" fill="#38bdf8" />
            <text x={xForIndex(index)} y={height - 6} textAnchor="middle" fill="#94a3b8" fontSize="10">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

const RiskDistributionCard = ({ distribution = {} }) => {
  const entries = ['High', 'Medium', 'Low'].map((key) => ({
    key,
    value: Number(distribution[key] || 0),
    color: riskBandMeta[key].color,
    label: riskBandMeta[key].label,
  }));
  const total = entries.reduce((sum, entry) => sum + entry.value, 0);

  let cumulative = 0;
  const slices = entries.map((entry) => {
    const start = total ? (cumulative / total) * Math.PI * 2 : 0;
    cumulative += entry.value;
    const end = total ? (cumulative / total) * Math.PI * 2 : 0;
    const x1 = 50 + 40 * Math.cos(start - Math.PI / 2);
    const y1 = 50 + 40 * Math.sin(start - Math.PI / 2);
    const x2 = 50 + 40 * Math.cos(end - Math.PI / 2);
    const y2 = 50 + 40 * Math.sin(end - Math.PI / 2);
    const largeArc = end - start > Math.PI ? 1 : 0;
    const d = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
    return { ...entry, d };
  });

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
      <h2 className="text-lg font-bold text-white">Risk Distribution</h2>
      <p className="mt-1 text-sm text-slate-400">Pie view of high, medium, and low agricultural risk records.</p>
      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <svg viewBox="0 0 100 100" className="h-40 w-40">
          {slices.map((slice) => (
            <path key={slice.key} d={slice.d} fill={slice.color} stroke="#0f172a" strokeWidth="1.5" />
          ))}
          <circle cx="50" cy="50" r="18" fill="#1e293b" />
        </svg>
        <div className="w-full space-y-3">
          {entries.map((entry) => (
            <div key={entry.key} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2">
              <span className="flex items-center gap-2 text-sm text-slate-200">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.label}
              </span>
              <span className="text-sm font-bold text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SamplePredictionsTable = ({ rows = [] }) => (
  <div className="rounded-xl border border-slate-700 bg-slate-800 p-5 shadow-md">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold text-white">Sample Predictions</h2>
        <p className="mt-1 text-sm text-slate-400">District-level proof table showing predicted vs actual yields and assigned risk.</p>
      </div>
      <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
        {rows.length} records shown
      </span>
    </div>
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="border-b border-slate-700 text-left text-slate-400">
          <tr>
            <th className="px-3 py-3 font-semibold uppercase tracking-wider">District</th>
            <th className="px-3 py-3 font-semibold uppercase tracking-wider">Crop</th>
            <th className="px-3 py-3 font-semibold uppercase tracking-wider">Predicted</th>
            <th className="px-3 py-3 font-semibold uppercase tracking-wider">Actual</th>
            <th className="px-3 py-3 font-semibold uppercase tracking-wider">Risk</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/40">
          {rows.map((row, index) => (
            <tr key={`${row.district}-${row.crop}-${index}`} className="text-slate-200">
              <td className="px-3 py-3 font-medium text-white">{row.district}</td>
              <td className="px-3 py-3">{row.crop}</td>
              <td className="px-3 py-3">{formatYield(row.predicted)}</td>
              <td className="px-3 py-3">{formatYield(row.actual)}</td>
              <td className="px-3 py-3">
                <span className="rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wide"
                  style={{
                    color: riskBandMeta[row.riskBand]?.color || '#e2e8f0',
                    borderColor: `${riskBandMeta[row.riskBand]?.color || '#64748b'}66`,
                    backgroundColor: `${riskBandMeta[row.riskBand]?.color || '#64748b'}1A`,
                  }}>
                  {row.riskBand} ({Number(row.risk || 0).toFixed(2)})
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Analytics = () => {
  const [districtRows, setDistrictRows] = useState([]);
  const [analyticsSummary, setAnalyticsSummary] = useState(null);
  const [loadingRows, setLoadingRows] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);
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

  const loadAnalyticsSummary = async () => {
    setLoadingSummary(true);
    try {
      const response = await fetch(`${API_URL}/v1/analytics`);
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics summary (${response.status})`);
      }

      const payload = await response.json();
      setAnalyticsSummary(payload);
    } catch (summaryError) {
      setError(summaryError.message || 'Analytics summary is unavailable right now.');
      setAnalyticsSummary(null);
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    loadDistrictRows(selectedState);
  }, [selectedState]);

  useEffect(() => {
    loadAnalyticsSummary();
  }, []);

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
      await loadAnalyticsSummary();
    } catch (recomputeError) {
      setError(recomputeError.message || 'Failed to recompute analytics.');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#060e1a] text-white p-6">
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

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Dataset Foundation</p>
            <h2 className="mt-2 text-xl font-bold text-white">Synthetic dataset modeled on real agricultural patterns</h2>
            <p className="mt-2 text-sm text-slate-300">
              Crop yield, plant health, weather volatility, and market fluctuation signals are combined into a professional baseline dataset for analytics benchmarking.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-300">
              <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5">
                {loadingSummary ? 'Loading records...' : `${analyticsSummary?.totalRecords || 0} records`}
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5">
                {loadingSummary ? 'Loading districts...' : `${analyticsSummary?.districtsCovered || 0} districts`}
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5">
                {loadingSummary ? 'Loading crops...' : `${analyticsSummary?.cropsCovered || 0} crop profiles`}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">Model Quality</p>
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-sm text-slate-400">Yield prediction accuracy</p>
                <p className="text-2xl font-black text-white">
                  {loadingSummary ? '--' : `${analyticsSummary?.mae?.toFixed?.(2) ?? '0.00'} t/ha`}
                </p>
                <p className="text-xs text-slate-400">Mean Absolute Error (MAE)</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Risk classification accuracy</p>
                <p className="text-2xl font-black text-white">
                  {loadingSummary ? '--' : `${analyticsSummary?.riskAccuracyPercent ?? 0}%`}
                </p>
                <p className="text-xs text-slate-400">Yield-derived validation proxy</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
            <h2 className="text-lg font-bold text-white">Model Performance</h2>
            <p className="mt-1 text-sm text-slate-400">Proof points recruiters and reviewers can inspect directly from the analytics engine.</p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-500/20 bg-slate-900/60 p-4">
                <p className="text-sm text-slate-400">MAE</p>
                <p className="mt-1 text-2xl font-black text-white">
                  {loadingSummary ? '--' : `${analyticsSummary?.mae?.toFixed?.(2) ?? '0.00'} tons/hectare`}
                </p>
              </div>
              <div className="rounded-xl border border-sky-500/20 bg-slate-900/60 p-4">
                <p className="text-sm text-slate-400">Risk Accuracy</p>
                <p className="mt-1 text-2xl font-black text-white">
                  {loadingSummary ? '--' : `${analyticsSummary?.riskAccuracyPercent ?? 0}%`}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-violet-500/20 bg-slate-800 p-5">
            <h2 className="text-lg font-bold text-white">Why This Model Works</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This model combines crop health, yield trends, weather volatility, and market fluctuations to estimate agricultural risk and financial trust.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Validated on 150+ simulated farm records derived from a synthetic dataset modeled on real agricultural patterns.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <YieldComparisonChart series={analyticsSummary?.comparisonSeries || []} />
          <RiskDistributionCard distribution={analyticsSummary?.riskDistribution || {}} />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.9fr]">
          <SamplePredictionsTable rows={analyticsSummary?.samplePredictions || []} />
          <div className="rounded-xl border border-amber-500/20 bg-slate-800 p-5">
            <h2 className="text-lg font-bold text-white">Explainability</h2>
            <p className="mt-1 text-sm text-slate-400">Dataset insights combined with the risk engine make the output defensible.</p>
            <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/60 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Risk Breakdown Insight</p>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                {analyticsSummary?.explainability || 'Risk insights will appear here once analytics summary data is available.'}
              </p>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3">
                <p className="text-xs uppercase tracking-wider text-slate-400">Average Health</p>
                <p className="mt-1 text-xl font-black text-white">
                  {loadingSummary ? '--' : `${analyticsSummary?.averageHealth ?? 0}`}
                </p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3">
                <p className="text-xs uppercase tracking-wider text-slate-400">Dataset Coverage</p>
                <p className="mt-1 text-xl font-black text-white">
                  {loadingSummary ? '--' : `${analyticsSummary?.districtsCovered ?? 0} districts`}
                </p>
              </div>
            </div>
          </div>
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
          <div className="flex flex-wrap items-center gap-3">
            {analyticsSummary?.dataSource && (
              <span className="text-xs text-slate-400">{analyticsSummary.dataSource}</span>
            )}
            <button
              onClick={handleRecompute}
              disabled={refreshing}
              className="rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-300 transition hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {refreshing ? 'Refreshing...' : 'Refresh Real Data'}
            </button>
          </div>
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
          Analytics baseline uses a synthetic dataset modeled on real agricultural patterns. Figures are indicative but consistently benchmarked.
        </p>

      </div>
    </div>
  );
};

export default Analytics;
