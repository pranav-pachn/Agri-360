import React from 'react';

const LoadingOverlay = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl transition-opacity">
      <div className="mx-4 flex w-full max-w-sm flex-col items-center rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="relative mb-6">
          <div className="h-16 w-16 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="h-6 w-6 animate-pulse text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <h3 className="mb-2 text-xl font-black text-white">Analyzing crop...</h3>
        <p className="text-sm text-gray-400">Our AI is processing the image for potential diseases and risks.</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
