import React from 'react';

const ImagePreview = ({ previewURL, fileName, onRemove }) => {
  if (!previewURL) return null;

  return (
    <div className="relative rounded-3xl border border-white/10 bg-slate-900/60 p-3 shadow-2xl backdrop-blur-xl">
      <div className="relative group overflow-hidden rounded-xl">
        <img 
          src={previewURL} 
          alt="Crop Preview" 
          className="h-72 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button 
            onClick={onRemove}
            className="flex items-center rounded-full border border-red-400/30 bg-red-500/90 px-4 py-2 text-white shadow-lg shadow-red-900/20 transition-colors hover:bg-red-600"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Remove Image
          </button>
        </div>
      </div>
      {fileName && (
        <div className="mt-3 mb-1 px-2 text-center">
          <p className="truncate text-sm font-medium text-gray-300">{fileName}</p>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
