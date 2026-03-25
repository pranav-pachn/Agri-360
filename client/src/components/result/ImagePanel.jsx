import React from 'react';

const ImagePanel = ({ imageUrl }) => {
  return (
    <div className="w-full flex-col space-y-4">
      <div className="bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-700/50 hover:border-slate-600 transition-colors duration-300">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          Analyzed Image
        </h3>
        <div className="overflow-hidden rounded-xl bg-slate-900 border border-slate-700/80">
          <img 
            src={imageUrl || "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80"} 
            alt="Analyzed Crop" 
            className="w-full h-auto max-h-[500px] object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePanel;
