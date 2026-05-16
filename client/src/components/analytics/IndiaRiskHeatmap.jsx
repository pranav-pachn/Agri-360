import React, { useEffect, useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleThreshold } from 'd3-scale';
import { API_URL } from '../../services/api';

const INDIA_STATES_GEOJSON_PATH = '/india_state.geojson';

const STATE_RISK_DATA = [
  { state: 'Punjab', risk: 0.7 },
  { state: 'Kerala', risk: 0.4 },
  { state: 'Maharashtra', risk: 0.9 },
  { state: 'Karnataka', risk: 0.62 },
  { state: 'Tamil Nadu', risk: 0.55 },
  { state: 'Gujarat', risk: 0.38 },
  { state: 'Rajasthan', risk: 0.74 },
  { state: 'Uttar Pradesh', risk: 0.68 },
  { state: 'Bihar', risk: 0.51 },
  { state: 'Madhya Pradesh', risk: 0.43 },
  { state: 'Andhra Pradesh', risk: 0.47 },
  { state: 'Telangana', risk: 0.58 },
  { state: 'West Bengal', risk: 0.61 },
];

const HEATMAP_REFRESH_MS = 30000;

const riskColorScale = scaleThreshold().domain([0.4, 0.7]).range(['#22c55e', '#facc15', '#ef4444']);

const normalizeState = (value = '') => value.trim().toLowerCase();

const featureName = (feature) => {
  const p = feature?.properties || {};
  return p.ST_NM || p.NAME_1 || p.name || p.NAME || '';
};

const statusLabel = (risk) => {
  if (risk > 0.7) return 'High Risk';
  if (risk > 0.4) return 'Medium Risk';
  return 'Low Risk';
};

const noop = () => {};

export default function IndiaRiskHeatmap({
  selectedState = 'All',
  onStateSelect = noop,
  selectedDistrict = 'All',
  onDistrictSelect = noop,
  districtRows = [],
}) {
  const [activeState, setActiveState] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [geoError, setGeoError] = useState('');
  const [liveRiskRows, setLiveRiskRows] = useState([]);
  const [lastLiveUpdate, setLastLiveUpdate] = useState(null);
  const [dataMode, setDataMode] = useState('fallback');

  const riskRows = useMemo(
    () => (liveRiskRows.length ? liveRiskRows : STATE_RISK_DATA),
    [liveRiskRows]
  );

  const riskLookup = useMemo(() => {
    const entries = riskRows.map((row) => [normalizeState(row.state), row.risk]);
    return new Map(entries);
  }, [riskRows]);

  const getRisk = (name) => riskLookup.get(normalizeState(name));

  const getColor = (name) => {
    const risk = getRisk(name);
    return typeof risk === 'number' ? riskColorScale(risk) : '#334155';
  };

  const stateContext = selectedState !== 'All'
    ? selectedState
    : (activeState?.name || 'All');

  const visibleDistricts = useMemo(() => {
    if (!Array.isArray(districtRows)) return [];
    if (!stateContext || stateContext === 'All') return districtRows;
    return districtRows.filter((row) => row?.state === stateContext);
  }, [districtRows, stateContext]);

  const districtRecord = useMemo(() => {
    if (!visibleDistricts.length) return null;
    if (selectedDistrict !== 'All') {
      return visibleDistricts.find((row) => row?.district === selectedDistrict) || null;
    }
    return visibleDistricts[0];
  }, [selectedDistrict, visibleDistricts]);

  useEffect(() => {
    let cancelled = false;

    const loadGeographies = async () => {
      try {
        const response = await fetch(INDIA_STATES_GEOJSON_PATH);
        if (!response.ok) {
          throw new Error(`Failed to load map data (${response.status})`);
        }

        const json = await response.json();
        if (!cancelled) {
          setGeoData(json);
          setGeoError('');
        }
      } catch (error) {
        if (!cancelled) {
          setGeoError('Unable to load India map boundaries.');
        }
        console.error('Failed to load India GeoJSON:', error);
      }
    };

    loadGeographies();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchLiveRisk = async () => {
      try {
        const response = await fetch(`${API_URL}/v1/analytics/dashboard`);
        if (!response.ok) {
          throw new Error(`Failed to fetch analytics (${response.status})`);
        }

        const payload = await response.json();
        const states = Array.isArray(payload?.states) ? payload.states : [];

        const mapped = states
          .filter((row) => row?.state && Number.isFinite(Number(row?.avg_risk_score)))
          .map((row) => ({
            state: String(row.state).trim(),
            risk: Number(row.avg_risk_score),
          }));

        if (!cancelled && mapped.length) {
          setLiveRiskRows(mapped);
          setLastLiveUpdate(new Date());
          setDataMode('live');
        }
      } catch (error) {
        if (!cancelled) {
          setDataMode('fallback');
        }
        console.warn('Live state risk unavailable, using fallback heatmap data.', error);
      }
    };

    fetchLiveRisk();
    const timer = setInterval(fetchLiveRisk, HEATMAP_REFRESH_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return (
    <section className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-md">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">India State Risk Heatmap</h2>
        <p className="text-sm text-slate-400 mt-1">
          States are colored by risk level: red (high), yellow (medium), green (low).
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Data source: {dataMode === 'live' ? 'Live analytics (auto-refresh 30s)' : 'Fallback demo data'}
          {lastLiveUpdate ? ` • Last update ${lastLiveUpdate.toLocaleTimeString()}` : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-3">
          {!geoData && !geoError && (
            <p className="text-sm text-slate-400 p-4">Loading India map boundaries...</p>
          )}
          {geoError && <p className="text-sm text-red-300 p-4">{geoError}</p>}
          {geoData && (
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ center: [82, 22], scale: 900 }}
              width={800}
              height={520}
              style={{ width: '100%', height: 'auto' }}
            >
              <Geographies geography={geoData}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const name = featureName(geo);
                    const risk = getRisk(name);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => {
                          setActiveState({
                            name,
                            risk,
                          });
                        }}
                        onClick={() => onStateSelect(name || 'All')}
                        onMouseLeave={() => setActiveState(null)}
                        style={{
                          default: {
                            fill: getColor(name),
                            stroke: '#0f172a',
                            strokeWidth: 0.7,
                            outline: 'none',
                          },
                          hover: {
                            fill: '#38bdf8',
                            stroke: '#e2e8f0',
                            strokeWidth: 0.9,
                            outline: 'none',
                            cursor: 'pointer',
                          },
                          pressed: {
                            fill: '#0ea5e9',
                            outline: 'none',
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          )}
        </div>

        <aside className="rounded-lg border border-slate-700 bg-slate-900/40 p-4 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Legend</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-slate-200">High Risk (&gt; 0.7)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="text-slate-200">Medium Risk (&gt; 0.4)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-slate-200">Low Risk (0 to 0.4)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-slate-600" />
                <span className="text-slate-200">No Data</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800 p-3 min-h-[120px]">
            <h4 className="text-sm font-semibold text-slate-300">State Details</h4>
            {!activeState && (
              <p className="mt-2 text-sm text-slate-400">Hover a state to inspect risk. Click a state to filter district intelligence.</p>
            )}
            {activeState && (
              <div className="mt-2 text-sm space-y-1">
                <p className="text-white font-semibold">{activeState.name || 'Unknown State'}</p>
                <p className="text-slate-200">
                  Risk Score:{' '}
                  {typeof activeState.risk === 'number' ? activeState.risk.toFixed(2) : 'No data'}
                </p>
                <p className="text-slate-300">
                  Status:{' '}
                  {typeof activeState.risk === 'number' ? statusLabel(activeState.risk) : 'Unavailable'}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800 p-3 min-h-[140px]">
            <h4 className="text-sm font-semibold text-slate-300">District Intelligence</h4>
            <p className="mt-1 text-xs text-slate-400">Scope: {stateContext || 'All States'}</p>

            {visibleDistricts.length > 0 && (
              <select
                value={selectedDistrict}
                onChange={(event) => onDistrictSelect(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-xs text-slate-100"
              >
                <option value="All">All Districts</option>
                {visibleDistricts.map((row) => (
                  <option key={`${row.state}-${row.district}`} value={row.district}>
                    {row.district}
                  </option>
                ))}
              </select>
            )}

            {!visibleDistricts.length && (
              <p className="mt-2 text-sm text-slate-400">No district data in this scope.</p>
            )}

            {districtRecord && (
              <div className="mt-3 text-xs space-y-1 text-slate-200">
                <p className="font-semibold text-white">{districtRecord.district}</p>
                <p>Risk: {Number(districtRecord.avg_risk_score || 0).toFixed(2)}</p>
                <p>Reports: {Number(districtRecord.total_reports || 0)}</p>
                <p>Healthy: {Number(districtRecord.healthy_reports || 0)}</p>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 leading-5">
            Live mode reads backend analytics every 30 seconds. Fallback data appears only when API is unavailable.
          </p>
        </aside>
      </div>
    </section>
  );
}
