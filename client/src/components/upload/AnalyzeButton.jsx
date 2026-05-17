import React from 'react';
import { useTranslation } from 'react-i18next';

const AnalyzeButton = ({ disabled, onClick }) => {
  const { t } = useTranslation();

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      aria-label={t('analyze')}
      className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex justify-center items-center shadow-md ${
        disabled 
          ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-70' 
          : 'bg-green-600 text-white hover:bg-green-500 hover:shadow-green-900/50 hover:shadow-lg active:scale-[0.98]'
      }`}
    >
      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
      </svg>
      {t('analyze')}
    </button>
  );
};

export default AnalyzeButton;
