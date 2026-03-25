import React from 'react';

const RiskCard = ({ riskLevel, riskScore }) => {
  const getRiskColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'low': return 'text-green-400 bg-green-400/10 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-500/30';
      case 'high': return 'text-red-400 bg-red-400/10 border-red-500/30';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-500/30';
    }
  };

  const colors = getRiskColor(riskLevel);

  return (
    <div className={`rounded-2xl p-5 shadow-md border hover:shadow-lg hover:border-slate-600 transition-all duration-300 bg-slate-800 border-slate-700/50`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-slate-700/50 rounded-lg mr-3 text-orange-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white">Risk Profile</h3>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border tracking-wider ${colors}`}>
          {riskLevel?.toUpperCase()}
        </span>
      </div>
      
      <div className="flex flex-col">
        <div className="flex justify-between items-end mb-2">
          <p className="text-slate-400 text-sm">Risk Score</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-white">{riskScore}</span>
            <span className="text-xs text-slate-500">/ 1.0</span>
          </div>
        </div>
        
        {/* Simple Progress Bar */}
        <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden mt-1">
          <div 
            className={`h-full rounded-full ${colors.split(' ')[0].replace('text-', 'bg-')}`}
            style={{ width: `${Math.min(100, riskScore * 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default RiskCard;
