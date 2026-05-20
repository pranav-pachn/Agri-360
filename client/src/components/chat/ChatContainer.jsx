import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ChatBubble from './ChatBubble';

const ChatContainer = ({ messages, language = 'en', loading = false, loadingText = '' }) => {
  const { t } = useTranslation();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scroll-smooth custom-scrollbar md:px-6 md:py-8">
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center space-y-4 text-slate-500">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/70 shadow-lg shadow-cyan-500/10">
            <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
          </div>
          <p className="max-w-xs text-center text-sm leading-relaxed text-gray-400 md:text-base">{t('emptyChat')}</p>
        </div>
      ) : (
        messages.map((msg, idx) => (
          <ChatBubble key={idx} message={msg} language={language} />
        ))
      )}
      {loading && (
        <div className="opacity-90">
          <ChatBubble message={{ text: loadingText || t('assistantThinking'), sender: 'bot' }} language={language} />
        </div>
      )}
      <div ref={bottomRef} className="h-1 pb-1" />
    </div>
  );
};

export default ChatContainer;
