import React from 'react';

const YieldCard = ({ projectedYield, estimatedLoss }) => {
  return (
    <div className="bg-slate-800 rounded-2xl p-5 shadow-md border border-slate-700/50 hover:shadow-lg hover:border-slate-600 transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg mr-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white">Yield Impact</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="flex flex-col">
          <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">Projected</p>
          <p className="text-xl font-bold text-emerald-400">{projectedYield}</p>
        </div>
        <div className="flex flex-col p-2 bg-red-500/5 rounded-lg border border-red-500/10">
          <p className="text-red-400/80 text-xs mb-1 font-semibold uppercase tracking-wider">Est. Loss</p>
          <p className="text-xl font-bold text-red-400">{estimatedLoss}%</p>
        </div>
      </div>
    </div>
  );
};

export default YieldCard;
