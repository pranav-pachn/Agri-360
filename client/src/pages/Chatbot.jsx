import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import ChatContainer from '../components/chat/ChatContainer';
import ChatInput from '../components/chat/ChatInput';
import LanguageSelector from '../components/chat/LanguageSelector';
import SuggestionChips from '../components/chat/SuggestionChips';
import { api } from '../services/api';
import { buildChatContextFromDashboardData, getDashboardData } from '../services/dashboardDataService';

const Chatbot = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatContext, setChatContext] = useState({});
  const requestIdRef = useRef(0);
  const language = i18n.language || 'en';

  // When language changes, reset the chat and show a greeting in that language
  const handleLanguageChange = (lang) => {
    setMessages([{ text: t('chatGreeting', { lng: lang }), sender: 'bot' }]);
  };

  // Greet on first load
  useEffect(() => {
    setMessages([{ text: t('chatGreeting', { lng: language }), sender: 'bot' }]);
  }, [language, t]);

  useEffect(() => {
    const loadChatContext = async () => {
      const requestId = ++requestIdRef.current;

      try {
        const dashboardData = await getDashboardData({ farmerId: user?.id, user });
        if (requestId !== requestIdRef.current) return;
        setChatContext(buildChatContextFromDashboardData(dashboardData, user));
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        setChatContext(buildChatContextFromDashboardData({}, user));
      }
    };

    loadChatContext();
  }, [user]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const newMessages = [...messages, { text, sender: 'user' }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await api.chat({
        message: text,
        language,
        context: chatContext,
      });

      setMessages([...newMessages, {
        text: response?.data?.reply || t('responseDefault'),
        sender: 'bot',
      }]);
    } catch (error) {
      console.error('Chat error', error);
      setMessages([...newMessages, { text: t('networkError'), sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col overflow-hidden rounded-none border-x border-white/10 bg-slate-950 shadow-2xl lg:rounded-[2rem] lg:border">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 translate-y-1/2 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-slate-950/85 px-6 py-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-2.5 shadow-lg shadow-emerald-900/30">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white">{t('agriAssistant')}</h1>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t('online')}
              </p>
            </div>
          </div>

          <LanguageSelector selected={language} onSelect={handleLanguageChange} />
        </div>

        <ChatContainer
          messages={messages}
          language={language}
          loading={loading}
          loadingText={t('assistantThinking')}
        />

        <div className="border-t border-white/10 bg-slate-950/90 px-4 py-4 backdrop-blur-xl md:px-6">
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.length <= 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <SuggestionChips onSuggest={handleSendMessage} language={language} />
              </div>
            )}
            <ChatInput onSend={handleSendMessage} disabled={loading} language={language} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
