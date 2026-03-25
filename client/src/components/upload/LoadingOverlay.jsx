import React from 'react';

const LoadingOverlay = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm transition-opacity">
      <div className="flex flex-col items-center bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 text-center max-w-sm w-full mx-4">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Analyzing crop...</h3>
        <p className="text-slate-400 text-sm">Our AI is processing the image for potential diseases and risks.</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
