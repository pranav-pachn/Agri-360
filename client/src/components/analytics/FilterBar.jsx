import React from 'react';

const FilterBar = ({ selectedCrop, onCropChange, onSort, sortAsc }) => {
  const crops = ['All', 'Rice', 'Wheat', 'Tomato', 'Maize', 'Potato'];

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
      <div className="flex items-center space-x-3">
        <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span className="text-slate-300 text-sm font-medium whitespace-nowrap">Filter by Crop:</span>
        <div className="relative">
          <select
            value={selectedCrop}
            onChange={(e) => onCropChange(e.target.value)}
            className="appearance-none bg-slate-900/80 text-white border border-slate-700 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500/50 cursor-pointer"
          >
            {crops.map((crop) => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <button
        onClick={onSort}
        className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg border border-slate-600 transition-all active:scale-95"
      >
        <svg className={`w-4 h-4 transition-transform duration-300 ${sortAsc ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
        <span>Sort: Risk {sortAsc ? 'Low → High' : 'High → Low'}</span>
      </button>
    </div>
  );
};

export default FilterBar;
