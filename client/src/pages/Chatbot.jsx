import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChatContainer from '../components/chat/ChatContainer';
import ChatInput from '../components/chat/ChatInput';
import LanguageSelector from '../components/chat/LanguageSelector';
import SuggestionChips from '../components/chat/SuggestionChips';

const Chatbot = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const language = i18n.language || 'en';

  const responses = useMemo(() => ({
    thinking: {
      en: t('assistantThinking', { lng: 'en' }),
      hi: t('assistantThinking', { lng: 'hi' }),
      te: t('assistantThinking', { lng: 'te' }),
    },
    risk: {
      en: t('responseRisk', { lng: 'en' }),
      hi: t('responseRisk', { lng: 'hi' }),
      te: t('responseRisk', { lng: 'te' }),
    },
    loan: {
      en: t('responseLoan', { lng: 'en' }),
      hi: t('responseLoan', { lng: 'hi' }),
      te: t('responseLoan', { lng: 'te' }),
    },
    trust: {
      en: t('responseTrust', { lng: 'en' }),
      hi: t('responseTrust', { lng: 'hi' }),
      te: t('responseTrust', { lng: 'te' }),
    },
    default: {
      en: t('responseDefault', { lng: 'en' }),
      hi: t('responseDefault', { lng: 'hi' }),
      te: t('responseDefault', { lng: 'te' }),
    },
  }), [t]);

  // When language changes, reset the chat and show a greeting in that language
  const handleLanguageChange = (lang) => {
    setMessages([{ text: t('chatGreeting', { lng: lang }), sender: 'bot' }]);
  };

  // Greet on first load
  useEffect(() => {
    setMessages([{ text: t('chatGreeting', { lng: language }), sender: 'bot' }]);
  }, [language, t]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const newMessages = [...messages, { text, sender: 'user' }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Setup payload / mock logic for AI response
      await new Promise(resolve => setTimeout(resolve, 1500)); // typing delay

      const query = text.toLowerCase();
      let explanation = responses.default;

      if (query.includes('risk') || query.includes('जोखिम') || query.includes('రిస్క్')) {
        explanation = responses.risk;
      } else if (query.includes('loan') || query.includes('eligible') || query.includes('लोन') || query.includes('లోన్') || query.includes('అర్హులు')) {
        explanation = responses.loan;
      } else if (query.includes('trust score') || query.includes('ट्रस्ट') || query.includes('ట్రస్ట్')) {
        explanation = responses.trust;
      }

      setMessages([...newMessages, {
        text: explanation[language] || explanation.en,
        sender: 'bot',
        explanation,
      }]);
    } catch (error) {
      console.error('Chat error', error);
      setMessages([...newMessages, { text: t('networkError'), sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-slate-900 flex flex-col max-w-4xl mx-auto w-full border-x border-slate-800 shadow-2xl relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      
      {/* 1. TOP BAR */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 z-10 sticky top-0">
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
      <ChatContainer messages={messages} language={language} />

      {/* 3. INPUT AREA */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 z-10">
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
