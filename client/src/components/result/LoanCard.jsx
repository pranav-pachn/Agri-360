import React from 'react';

const LoanCard = ({ trustScore, eligibility, rating }) => {
  const isEligible = eligibility?.toLowerCase() === 'eligible';
  const trustScaleMax = Number(trustScore) > 100 ? 900 : 100;
  
  return (
    <div className="group relative h-full min-w-0 overflow-hidden rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-900/60 to-slate-900 p-5 shadow-xl transition-all duration-300 hover:border-indigo-400/60 sm:p-6">
      {/* Background glow effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-colors duration-500"></div>
      
      <div className="relative z-10 mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-center">
          <div className="mr-4 rounded-xl border border-indigo-500/20 bg-indigo-500/20 p-2.5 text-indigo-400 shadow-inner shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <h3 className="min-w-0 break-words text-lg font-bold tracking-wide text-white sm:text-xl">Loan Eligibility</h3>
        </div>
        
        <span className={`w-fit px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg border ${isEligible ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
          {eligibility}
        </span>
      </div>
      
      <div className="relative z-10 grid grid-cols-1 gap-4 border-b border-indigo-500/20 pb-4 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="text-indigo-200/60 text-sm mb-1 font-medium">Trust Score</p>
          <div className="flex items-baseline space-x-1">
            <span className="break-words bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-4xl font-black text-transparent sm:text-5xl">
              {trustScore}
            </span>
            <span className="text-lg text-indigo-300/40 font-bold">/ {trustScaleMax}</span>
          </div>
        </div>
        
        <div className="flex flex-col justify-end sm:items-end">
          <p className="text-indigo-200/60 text-sm mb-1 font-medium">Rating</p>
          <p className={`text-2xl font-bold ${isEligible ? 'text-emerald-400' : 'text-amber-400'}`}>{rating}</p>
        </div>
      </div>
      
      <div className="mt-4 relative z-10">
        <p className="text-sm text-indigo-200/80 leading-relaxed font-medium">
          {isEligible 
            ? "Your crop health and financial data meet the criteria for agricultural micro-loans." 
            : "Current risk factors limit loan eligibility. Consider implementing recommendations."}
        </p>
      </div>
    </div>
  );
};

export default LoanCard;
