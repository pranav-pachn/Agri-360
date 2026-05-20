import React from 'react';
import { useTranslation } from 'react-i18next';

const AnalyzeButton = ({ disabled, onClick }) => {
  const { t } = useTranslation();

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      aria-label={t('analyze')}
      className={`flex w-full items-center justify-center rounded-2xl py-4 text-lg font-black transition-all duration-300 ${
        disabled 
          ? 'cursor-not-allowed bg-slate-800/70 text-slate-500 opacity-70' 
          : 'bg-gradient-to-r from-emerald-500 to-cyan-500 !text-slate-950 shadow-2xl shadow-emerald-900/20 hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(45,212,191,0.24)] active:scale-[0.99]'
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
