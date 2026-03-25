import React, { useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleThreshold } from 'd3-scale';

const INDIA_STATES_GEOJSON_URL =
  'https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson';

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

export default function IndiaRiskHeatmap() {
  const [activeState, setActiveState] = useState(null);

  const riskLookup = useMemo(() => {
    const entries = STATE_RISK_DATA.map((row) => [normalizeState(row.state), row.risk]);
    return new Map(entries);
  }, []);

  const getRisk = (name) => riskLookup.get(normalizeState(name));

  const getColor = (name) => {
    const risk = getRisk(name);
    return typeof risk === 'number' ? riskColorScale(risk) : '#334155';
  };

  return (
    <section className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-md">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">India State Risk Heatmap</h2>
        <p className="text-sm text-slate-400 mt-1">
          States are colored by risk level: red (high), yellow (medium), green (low).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-3">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: [82, 22], scale: 900 }}
            width={800}
            height={520}
            style={{ width: '100%', height: 'auto' }}
          >
            <Geographies geography={INDIA_STATES_GEOJSON_URL}>
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
              <p className="mt-2 text-sm text-slate-400">Hover a state on the map to inspect its risk score.</p>
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

          <p className="text-xs text-slate-400 leading-5">
            Hackathon mode: map uses demo state-level risk values. Connect backend state risk API next.
          </p>
        </aside>
      </div>
    </section>
  );
}
