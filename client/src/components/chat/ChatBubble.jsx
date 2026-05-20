import React from 'react';
import { useTranslation } from 'react-i18next';

const speechLanguageMap = {
  en: 'en-IN',
  hi: 'hi-IN',
  te: 'te-IN',
};

const ChatBubble = ({ message, language = 'en' }) => {
  const { t } = useTranslation();
  const isUser = message.sender === 'user';

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !message?.text) return;

    const utterance = new SpeechSynthesisUtterance(message.text);
    utterance.lang = speechLanguageMap[language] || speechLanguageMap.en;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div 
        className={`max-w-[85%] rounded-3xl px-5 py-4 shadow-xl backdrop-blur-xl md:max-w-[72%] ${
          isUser 
            ? 'border border-emerald-400/20 bg-gradient-to-br from-emerald-500 to-cyan-500 text-white rounded-tr-sm shadow-emerald-500/10' 
            : 'border border-white/10 bg-slate-900/70 text-slate-100 rounded-tl-sm shadow-black/20'
        }`}
      >
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{message.text}</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className={`text-[10px] font-medium opacity-70 ${isUser ? 'text-green-100' : 'text-slate-400'}`}>
            {isUser ? t('you') : t('assistant')}
          </p>
          {!isUser && (
            <button
              type="button"
              onClick={handleSpeak}
              className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-300"
              aria-label={t('listen')}
            >
              {t('listen')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
