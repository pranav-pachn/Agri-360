import React from 'react';

const SustainabilityCard = ({ sustainabilityScore, breakdown }) => {
  const score = sustainabilityScore ?? 64;
  const bd = breakdown || {
    water_efficiency: 40,
    fertilizer_optimization: 60,
    crop_diversity: 70,
    soil_health: 65,
  };

  const getScoreColor = (s) => {
    if (s >= 70) return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (s >= 50) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  const metrics = [
    { label: 'Water Efficiency', value: bd.water_efficiency, icon: '💧' },
    { label: 'Fertilizer Opt.', value: bd.fertilizer_optimization, icon: '🌿' },
    { label: 'Crop Diversity', value: bd.crop_diversity, icon: '🌾' },
    { label: 'Soil Health', value: bd.soil_health, icon: '🪱' },
  ];

  return (
    <div className="bg-slate-800 rounded-2xl p-5 shadow-md border border-emerald-500/20 hover:shadow-lg hover:border-emerald-500/40 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg mr-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white">Sustainability Index</h3>
        </div>
        <span className={`text-2xl font-black px-3 py-1 rounded-xl border ${getScoreColor(score)}`}>{score}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-2">
        {metrics.map((m) => (
          <div key={m.label} className="bg-slate-900/40 rounded-xl p-3 border border-slate-700/50">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-slate-400 font-medium">{m.icon} {m.label}</span>
              <span className={`text-xs font-bold ${m.value >= 70 ? 'text-green-400' : m.value >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{m.value}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${m.value >= 70 ? 'bg-green-500' : m.value >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${m.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SustainabilityCard;
