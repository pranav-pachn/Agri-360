import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ChatBubble from './ChatBubble';

const ChatContainer = ({ messages, language = 'en' }) => {
  const { t } = useTranslation();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scroll-smooth custom-scrollbar">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
          </div>
          <p className="text-center max-w-xs text-base">{t('emptyChat')}</p>
        </div>
      ) : (
        messages.map((msg, idx) => (
          <ChatBubble key={idx} message={msg} language={language} />
        ))
      )}
      <div ref={bottomRef} className="h-1 pb-1" />
    </div>
  );
};

export default ChatContainer;
