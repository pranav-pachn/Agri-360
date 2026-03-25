import React from 'react';

const getRiskMeta = (risk) => {
  if (risk > 0.7) return { label: 'High', badge: 'bg-red-500/20 text-red-400 border-red-500/30', row: 'bg-red-500/5' };
  if (risk > 0.4) return { label: 'Medium', badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', row: 'bg-yellow-500/5' };
  return { label: 'Low', badge: 'bg-green-500/20 text-green-400 border-green-500/30', row: 'bg-green-500/5' };
};

const RiskTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-500 bg-slate-800 rounded-xl border border-slate-700">
        <p>No data available for the selected filter.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-md">
      <table className="w-full text-sm">
        <thead className="bg-slate-900/60 border-b border-slate-700">
          <tr>
            <th className="text-left px-6 py-4 text-slate-400 font-semibold uppercase tracking-wider">District</th>
            <th className="text-left px-6 py-4 text-slate-400 font-semibold uppercase tracking-wider">Crop</th>
            <th className="text-left px-6 py-4 text-slate-400 font-semibold uppercase tracking-wider">Risk Score</th>
            <th className="text-left px-6 py-4 text-slate-400 font-semibold uppercase tracking-wider">Status</th>
            <th className="text-left px-6 py-4 text-slate-400 font-semibold uppercase tracking-wider">Risk Level</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {data.map((row, idx) => {
            const meta = getRiskMeta(row.risk);
            return (
              <tr
                key={idx}
                className={`${meta.row} hover:bg-slate-700/40 transition-colors duration-200 cursor-default`}
              >
                <td className="px-6 py-4 font-semibold text-white">{row.district}</td>
                <td className="px-6 py-4 text-slate-300">{row.crop}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-bold">{row.risk.toFixed(2)}</span>
                    <div className="flex-1 max-w-[100px] h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${meta.label === 'High' ? 'bg-red-400' : meta.label === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'}`}
                        style={{ width: `${row.risk * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${meta.badge}`}>
                    {meta.label}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400 text-xs">
                  {meta.label === 'High' ? 'Immediate action needed' : meta.label === 'Medium' ? 'Monitor closely' : 'Under control'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RiskTable;
