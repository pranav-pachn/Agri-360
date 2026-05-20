import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const UploadBox = ({ onFileSelect }) => {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = function(e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div 
      className={`group relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed p-10 text-center transition-all duration-300 ${
        dragActive
          ? 'border-cyan-400/50 bg-cyan-500/10 shadow-2xl shadow-cyan-500/10'
          : 'border-white/10 bg-slate-900/50 hover:border-cyan-400/30 hover:bg-slate-800/70'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
      role="button"
      tabIndex={0}
      aria-label={t('upload')}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onButtonClick();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <div className="flex flex-col items-center space-y-4">
        <svg className="h-12 w-12 text-cyan-300 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        <div className="text-center">
          <p className="text-lg font-semibold text-white">{t('uploadPrompt')}</p>
          <p className="mt-2 text-sm text-gray-400">{t('uploadFormats')}</p>
        </div>
      </div>
    </div>
  );
};

export default UploadBox;
