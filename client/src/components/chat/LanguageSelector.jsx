import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const LanguageSelector = ({
  selected,
  onSelect,
  className = '',
  selectClassName = 'appearance-none rounded-lg border border-slate-700 bg-slate-800 py-1.5 pl-3 pr-8 text-sm text-slate-200 shadow-sm transition-colors hover:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-green-500/50',
  iconClassName = 'text-slate-400',
}) => {
  const { t } = useTranslation();

  const handleChange = (value) => {
    i18n.changeLanguage(value);
    onSelect?.(value);
  };

  return (
    <div className={`relative ${className}`.trim()}>
      <label htmlFor="language-selector" className="sr-only">{t('language')}</label>
      <select 
        id="language-selector"
        value={selected} 
        onChange={(e) => handleChange(e.target.value)}
        className={`${selectClassName} cursor-pointer`}
        aria-label={t('language')}
      >
        <option value="en">{t('languageEnglish')}</option>
        <option value="hi">{t('languageHindi')}</option>
        <option value="te">{t('languageTelugu')}</option>
      </select>
      <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${iconClassName}`.trim()}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;
