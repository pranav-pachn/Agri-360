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
            className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-slate-800/80 hover:text-cyan-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {msg}
          </button>
        ))}
      </div>

      {/* Main input row */}
      <div className="flex items-center gap-2 rounded-3xl border border-white/10 bg-slate-900/70 p-2 shadow-xl shadow-black/20 transition-colors focus-within:border-cyan-400/40">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={t('chatPlaceholder')}
          className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none md:text-base"
          autoComplete="off"
          aria-label={t('chatPlaceholder')}
        />
        <button
          type="button"
          onClick={handleVoiceInput}
          disabled={disabled}
          className="rounded-2xl border border-white/10 px-3 py-3 text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={t('voiceInputLabel')}
          title={t('speak')}
        >
          <span className="text-base">🎤</span>
        </button>
        <button
          onClick={handleSend}
          disabled={disabled || !inputText.trim()}
          aria-label={t('sendMessageLabel')}
          className={`flex flex-shrink-0 items-center justify-center rounded-2xl p-3 transition-all duration-300 ${
            disabled || !inputText.trim()
              ? 'cursor-not-allowed bg-slate-800 text-slate-500'
              : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-900/20 hover:-translate-y-0.5 active:scale-95'
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
