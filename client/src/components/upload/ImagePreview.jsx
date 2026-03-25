import React from 'react';

const ImagePreview = ({ previewURL, fileName, onRemove }) => {
  if (!previewURL) return null;

  return (
    <div className="relative p-2 bg-slate-800 rounded-2xl shadow-md border border-slate-700">
      <div className="relative group overflow-hidden rounded-xl">
        <img 
          src={previewURL} 
          alt="Crop Preview" 
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button 
            onClick={onRemove}
            className="px-4 py-2 bg-red-500/90 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center shadow-lg hover:shadow-red-900/50"
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
          <p className="text-sm font-medium text-slate-300 truncate">{fileName}</p>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
