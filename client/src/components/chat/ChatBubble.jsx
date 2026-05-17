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
        className={`max-w-[75%] md:max-w-[65%] px-5 py-3 rounded-2xl shadow-sm ${
          isUser 
            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white rounded-tr-sm' 
            : 'bg-slate-700 border border-slate-600 text-slate-100 rounded-tl-sm'
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{message.text}</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className={`text-[10px] font-medium opacity-70 ${isUser ? 'text-green-100' : 'text-slate-400'}`}>
            {isUser ? t('you') : t('assistant')}
          </p>
          {!isUser && (
            <button
              type="button"
              onClick={handleSpeak}
              className="rounded-full border border-slate-500/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300"
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
