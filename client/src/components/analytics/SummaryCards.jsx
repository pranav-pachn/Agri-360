import React from 'react';

const getRiskLabel = (risk) => {
  if (risk > 0.7) return 'High';
  if (risk > 0.4) return 'Medium';
  return 'Low';
};

const SummaryCards = ({ data }) => {
  const totalDistricts = data.length;
  const highRiskCount = data.filter(d => d.risk > 0.7).length;
  const avgRisk = data.length > 0
    ? (data.reduce((sum, d) => sum + d.risk, 0) / data.length).toFixed(2)
    : '0.00';

  const cards = [
    {
      label: 'Total Districts',
      value: totalDistricts,
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      accent: 'border-blue-500/30 bg-blue-500/5',
      textColor: 'text-blue-400',
    },
    {
      label: 'High Risk Districts',
      value: highRiskCount,
      icon: (
        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      accent: 'border-red-500/30 bg-red-500/5',
      textColor: 'text-red-400',
    },
    {
      label: 'Average Risk Score',
      value: avgRisk,
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      accent: 'border-amber-500/30 bg-amber-500/5',
      textColor: 'text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className={`bg-slate-800 rounded-xl p-5 border ${card.accent} flex items-center space-x-4 hover:scale-[1.02] transition-transform duration-200 shadow-md`}>
          <div className={`p-3 rounded-xl ${card.accent}`}>
            {card.icon}
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">{card.label}</p>
            <p className={`text-3xl font-black mt-0.5 ${card.textColor}`}>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
