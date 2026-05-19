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
    <div className="h-[calc(100vh-4rem)] bg-[#060e1a] flex flex-col max-w-4xl mx-auto w-full border-x border-slate-800 shadow-2xl relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      
      {/* 1. TOP BAR */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#060e1a]/90 backdrop-blur-md border-b border-slate-800 z-10 sticky top-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-lg shadow-green-900/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">{t('agriAssistant')}</h1>
            <p className="text-sm text-green-400 font-medium flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
              {t('online')}
            </p>
          </div>
        </div>
        
        <LanguageSelector selected={language} onSelect={handleLanguageChange} />
      </div>

      {/* 2. CHAT AREA */}
      <ChatContainer
        messages={messages}
        language={language}
        loading={loading}
        loadingText={t('assistantThinking')}
      />

      {/* 3. INPUT AREA */}
      <div className="p-4 bg-[#060e1a] border-t border-slate-800 z-10">
        <div className="max-w-3xl mx-auto">
          {messages.length <= 1 && (
            <div className="animate-in slide-in-from-bottom-2 fade-in duration-500">
              <SuggestionChips onSuggest={handleSendMessage} language={language} />
            </div>
          )}
          
          <ChatInput onSend={handleSendMessage} disabled={loading} language={language} />
        </div>
      </div>
      
    </div>
  );
};

export default Chatbot;
