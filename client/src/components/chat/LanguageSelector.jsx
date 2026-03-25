import React from 'react';

const LanguageSelector = ({ selected, onSelect }) => {
  return (
    <div className="relative">
      <select 
        value={selected} 
        onChange={(e) => onSelect(e.target.value)}
        className="appearance-none bg-slate-800 text-slate-200 border border-slate-700 rounded-lg pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-500/50 cursor-pointer shadow-sm hover:bg-slate-700 transition-colors"
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="te">Telugu</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;
