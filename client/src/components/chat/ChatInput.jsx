import React, { useState } from 'react';

const ChatInput = ({ onSend, disabled, language = 'en' }) => {
  const [inputText, setInputText] = useState('');

  const placeholders = {
    en: "Ask about your crop, risk, or loan eligibility...",
    hi: "अपनी फसल, जोखिम या लोन पात्रता के बारे में पूछें...",
    te: "మీ పంట, రిస్క్ లేదా లోన్ అర్హత గురించి అడగండి..."
  };

  const quickMessages = {
    en: [
      "What diseases affect my crop?",
      "How can I improve my trust score?",
      "What fertilizer should I use?",
      "Explain my yield prediction"
    ],
    hi: [
      "मेरी फसल को कौन सी बीमारियाँ प्रभावित करती हैं?",
      "मेरा ट्रस्ट स्कोर कैसे सुधारूँ?",
      "मुझे कौन सा उर्वरक उपयोग करना चाहिए?",
      "मेरी उपज भविष्यवाणी समझाएं"
    ],
    te: [
      "నా పంటను ఏ వ్యాధులు ప్రభావితం చేస్తున్నాయి?",
      "నా ట్రస్ట్ స్కోర్ ఎలా మెరుగుపరచాలి?",
      "నేను ఏ ఎరువు వాడాలి?",
      "నా దిగుబడి అంచనాను వివరించండి"
    ]
  };

  const handleSend = () => {
    if (inputText.trim() && !disabled) {
      onSend(inputText.trim());
      setInputText('');
    }
  };

  const handleQuickMessage = (msg) => {
    setInputText(msg);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const chips = quickMessages[language] || quickMessages.en;

  return (
    <div className="space-y-3">
      {/* Quick message pills */}
      <div className="flex flex-wrap gap-2">
        {chips.map((msg, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickMessage(msg)}
            disabled={disabled}
            className="text-xs px-3 py-1.5 bg-slate-800/80 border border-slate-700 hover:border-green-500/40 hover:bg-slate-700 hover:text-green-400 text-slate-400 rounded-full transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {msg}
          </button>
        ))}
      </div>

      {/* Main input row */}
      <div className="flex items-center space-x-2 bg-slate-800 p-2 rounded-2xl border border-slate-700 shadow-inner focus-within:border-slate-600 transition-colors">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholders[language] || placeholders.en}
          className="flex-1 bg-transparent text-white placeholder-slate-400 px-4 py-2 focus:outline-none"
          autoComplete="off"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !inputText.trim()}
          className={`p-3 rounded-xl transition-all duration-300 flex-shrink-0 flex items-center justify-center ${
            disabled || !inputText.trim()
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-500 shadow-md hover:shadow-green-900/50 active:scale-95'
          }`}
        >
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
