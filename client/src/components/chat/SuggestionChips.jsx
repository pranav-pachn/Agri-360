import React from 'react';

const SuggestionChips = ({ onSuggest, language = 'en' }) => {
  const dictionary = {
    en: [
      "What is my risk?",
      "Am I eligible for a loan?",
      "Show my trust score"
    ],
    hi: [
      "मेरा जोखिम क्या है?",
      "क्या मैं लोन के लिए पात्र हूँ?",
      "मेरा ट्रस्ट स्कोर दिखाएं"
    ],
    te: [
      "నా రిస్క్ ఏమిటి?",
      "నేను లోన్‌కి అర్హుడినా?",
      "నా ట్రస్ట్ స్కోర్ చూపించు"
    ]
  };

  const suggestions = dictionary[language] || dictionary['en'];

  return (
    <div className="flex flex-wrap gap-2 px-1 mb-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggest(suggestion)}
          className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 text-sm px-4 py-2 rounded-full transition-all duration-300 shadow-sm active:scale-95"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;
