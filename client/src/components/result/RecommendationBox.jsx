import React from 'react';

const RecommendationBox = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="bg-slate-800/80 rounded-2xl p-6 shadow-inner border border-slate-700 hover:border-slate-600 transition-colors duration-300">
      <div className="flex items-center mb-5">
        <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg mr-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white">Recommended Actions</h3>
      </div>
      
      <ul className="space-y-4">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <div className="mr-3 mt-0.5 flex-shrink-0 bg-purple-500/10 p-1.5 rounded-full">
               <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
               </svg>
            </div>
            <span className="text-slate-300 text-sm leading-relaxed font-medium">{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationBox;
