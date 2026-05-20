import React from 'react';
import { getColor } from '../../utils/riskUtils';

const RiskBreakdown = ({ data }) => {
  if (!data) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-800/80 p-6 shadow-xl backdrop-blur-md space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight text-white">⚠️ Risk Analysis</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Score</p>
          <p className={`mt-2 text-4xl font-bold ${getColor(data.riskCategory)}`}>
            {data.riskScore}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Category</p>
          <p className={`mt-2 text-2xl font-bold ${getColor(data.riskCategory)}`}>
            {data.riskCategory}
          </p>
          <p className="mt-1 text-sm text-gray-400">Confidence: {data.confidence}</p>
        </div>
      </div>

      <div className="space-y-3">
        {Array.isArray(data.breakdown) && data.breakdown.map((item, index) => (
          <div key={index} className="flex justify-between rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-slate-200">
            <span>{item.factor}</span>
            <span className={item.impact > 0 ? 'text-green-400' : 'text-red-400'}>
              {item.impact > 0 ? '+' : ''}{item.impact}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-300">
        💡 {data.explanation}
      </div>
    </div>
  );
};

export default RiskBreakdown;
