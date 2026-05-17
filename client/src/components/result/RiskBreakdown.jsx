import React from 'react';
import { getColor } from '../../utils/riskUtils';

const RiskBreakdown = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-slate-800 p-6 rounded-2xl space-y-4 shadow-md">
      <h2 className="text-xl font-bold">⚠️ Risk Analysis</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-700/60 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Score</p>
          <p className={`mt-2 text-3xl font-bold ${getColor(data.riskCategory)}`}>
            {data.riskScore}
          </p>
        </div>
        <div className="rounded-xl bg-slate-700/60 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Category</p>
          <p className={`mt-2 text-xl font-bold ${getColor(data.riskCategory)}`}>
            {data.riskCategory}
          </p>
          <p className="mt-1 text-sm text-gray-400">Confidence: {data.confidence}</p>
        </div>
      </div>

      <div className="space-y-2">
        {Array.isArray(data.breakdown) && data.breakdown.map((item, index) => (
          <div key={index} className="flex justify-between rounded-xl bg-slate-700/40 px-3 py-2 text-sm">
            <span>{item.factor}</span>
            <span className={item.impact > 0 ? 'text-green-400' : 'text-red-400'}>
              {item.impact > 0 ? '+' : ''}{item.impact}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-slate-700 p-3 rounded-lg text-sm">
        💡 {data.explanation}
      </div>
    </div>
  );
};

export default RiskBreakdown;
