import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ChatInput = ({ onSend, disabled, language = 'en' }) => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const speechRef = useRef(null);

  const languageMap = {
    en: 'en-IN',
    hi: 'hi-IN',
    te: 'te-IN',
  };

  const chips = useMemo(() => ([
    t('quickDisease'),
    t('quickTrust'),
    t('quickFertilizer'),
    t('quickYield'),
  ]), [t, language]);

  const handleSend = () => {
    if (inputText.trim() && !disabled) {
      onSend(inputText.trim());
      setInputText('');
    }
  };

  const handleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      window.alert(t('speechNotSupported'));
      return;
    }

    if (!speechRef.current) {
      speechRef.current = new SpeechRecognition();
      speechRef.current.continuous = false;
      speechRef.current.interimResults = false;
      speechRef.current.onresult = (event) => {
        const text = event.results?.[0]?.[0]?.transcript || '';
        setInputText(text);
      };
    }

    speechRef.current.lang = languageMap[language] || languageMap.en;
    speechRef.current.start();
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

  return (
    <div className="space-y-3">
      {/* Quick message pills */}
      <div className="flex flex-wrap gap-2">
        {chips.map((msg, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickMessage(msg)}
            disabled={disabled}
            className="text-xs px-3 py-1.5 bg-slate-800/80 border border-slate-700 hover:border-green-500/40 hover:bg-slate-700 hover:text-green-400 text-slate-300 rounded-full transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
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
          placeholder={t('chatPlaceholder')}
          className="flex-1 bg-transparent px-4 py-3 text-lg text-white placeholder-slate-400 focus:outline-none"
          autoComplete="off"
          aria-label={t('chatPlaceholder')}
        />
        <button
          type="button"
          onClick={handleVoiceInput}
          disabled={disabled}
          className="rounded-xl border border-slate-600 px-3 py-3 text-slate-200 transition hover:border-green-500/50 hover:text-green-300 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={t('voiceInputLabel')}
          title={t('speak')}
        >
          <span className="text-base">🎤</span>
        </button>
        <button
          onClick={handleSend}
          disabled={disabled || !inputText.trim()}
          aria-label={t('sendMessageLabel')}
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
