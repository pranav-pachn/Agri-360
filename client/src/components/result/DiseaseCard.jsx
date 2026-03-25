import React from 'react';

const DiseaseCard = ({ disease, confidence }) => {
  const isHealthy = disease?.toLowerCase() === 'healthy';
  
  return (
    <div className={`bg-slate-800 rounded-2xl p-5 shadow-md border hover:shadow-lg transition-all duration-300 ${isHealthy ? 'border-green-500/30' : 'border-red-500/30'}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className={`p-3 rounded-xl mr-4 ${isHealthy ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
            </svg>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Detection Result</p>
            <h3 className={`text-xl font-bold ${isHealthy ? 'text-green-400' : 'text-red-400'}`}>{disease}</h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-sm font-medium">Confidence</p>
          <p className="text-2xl font-bold text-white">{confidence}%</p>
        </div>
      </div>
    </div>
  );
};

export default DiseaseCard;
