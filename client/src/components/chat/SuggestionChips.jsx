import React from 'react';
import { useTranslation } from 'react-i18next';

const SuggestionChips = ({ onSuggest }) => {
  const { t } = useTranslation();

  const suggestions = [t('suggestRisk'), t('suggestLoan'), t('suggestTrust')];

  return (
    <div className="mb-2 flex flex-wrap gap-2 px-1">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggest(suggestion)}
          className="rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-sm text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-slate-800/80 hover:text-cyan-200 active:scale-95"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;
