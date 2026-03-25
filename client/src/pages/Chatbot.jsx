import React, { useState } from 'react';
import ChatContainer from '../components/chat/ChatContainer';
import ChatInput from '../components/chat/ChatInput';
import LanguageSelector from '../components/chat/LanguageSelector';
import SuggestionChips from '../components/chat/SuggestionChips';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);

  const greetings = {
    en: "Hello! I'm your Agri Assistant. Ask me about your crop risk, loan eligibility, or trust score.",
    hi: "नमस्ते! मैं आपका कृषि सहायक हूँ। अपनी फसल के जोखिम, लोन योग्यता या ट्रस्ट स्कोर के बारे में पूछें।",
    te: "నమస్కారం! నేను మీ వ్యవసాయ సహాయకుడిని. మీ పంట రిస్క్, లోన్ అర్హత లేదా ట్రస్ట్ స్కోర్ గురించి అడగండి."
  };

  // When language changes, reset the chat and show a greeting in that language
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setMessages([{ text: greetings[lang] || greetings.en, sender: 'bot' }]);
  };

  // Greet on first load
  React.useEffect(() => {
    setMessages([{ text: greetings['en'], sender: 'bot' }]);
  }, []);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const newMessages = [...messages, { text, sender: 'user' }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Setup payload / mock logic for AI response
      await new Promise(resolve => setTimeout(resolve, 1500)); // typing delay

      // Mock bot intelligence logic mapping
      let botResponse = "";
      const query = text.toLowerCase();

      const responses = {
        en: {
          thinking: "I'm assessing your query against our agricultural database...",
          risk: "Based on our latest satellite and AI analysis, your farm's risk score is High (0.82) primarily due to a 87% chance of Early Blight in your tomato crops.",
          loan: "Looking at your financial integrity map and projected yield loss of 40%, you are currently Not Eligible for a micro-loan. We recommend taking the fungicide actions strictly to recover your Trust Score.",
          trust: "Your AgriMitra Trust Score is exactly 45 out of 100, which puts you in the 'Poor' band. Improving crop treatment immediately will start rehabilitating this metric steadily.",
          default: "I can help analyze your farm's exact risks, crop yield changes, or your trust score for farming loans. How can I assist you today?"
        },
        hi: {
          thinking: "मैं हमारे कृषि डेटाबेस से आपकी क्वेरी का आकलन कर रहा हूँ...",
          risk: "हमारे नवीनतम विश्लेषण के आधार पर, आपके खेत का जोखिम स्कोर उच्च (0.82) है। टमाटर की फसल में अर्ली ब्लाइट की 87% संभावना है।",
          loan: "आपके 40% संभावित उपज नुकसान को देखते हुए, आप अभी माइक्रो-लोन के लिए पात्र नहीं हैं। कृपया कवकनाशी का उपयोग करें।",
          trust: "आपका एग्रीमित्रा ट्रस्ट स्कोर 100 में से 45 है, जो 'खराब' श्रेणी में आता है।",
          default: "मैं आपके खेत के जोखिम, फसल की उपज या लोन के लिए ट्रस्ट स्कोर का विश्लेषण करने में मदद कर सकता हूँ। मैं आपकी कैसे मदद कर सकता हूँ?"
        },
        te: {
          thinking: "నేను వ్యవసాయ డేటాబేస్ ద్వారా మీ ప్రశ్నను అంచనా వేస్తున్నాను...",
          risk: "మా తాజా విశ్లేషణ ప్రకారం, మీ పొలం రిస్క్ స్కోర్ ఎక్కువ (0.82). టమాటా పంటలో ఎర్లీ బ్లైట్ వచ్చే అవకాశం 87% ఉంది.",
          loan: "మీ 40% సంభావ్య దిగుబడి నష్టాన్ని దృష్టిలో ఉంచుకుని, మీరు ప్రస్తుతం మైక్రో-లోన్‌కు అర్హులు కారు.",
          trust: "మీ అగ్రిమిత్ర ట్రస్ట్ స్కోరు 100కి 45, ఇది 'పూర్' విభాగంలోకి వస్తుంది.",
          default: "మీ పొలం రిస్క్, పంట దిగుబడి లేదా లోన్ కోసం ట్రస్ట్ స్కోర్‌ను విశ్లేషించడంలో నేను సహాయపడగలను. ఈరోజు నేనెలా సహాయపడగలను?"
        }
      };

      const dictionary = responses[language] || responses.en;

      if (query.includes('risk') || query.includes('जोखिम') || query.includes('రిస్క్')) {
        botResponse = dictionary.risk;
      } else if (query.includes('loan') || query.includes('eligible') || query.includes('लोन') || query.includes('లోన్') || query.includes('అర్హులు')) {
        botResponse = dictionary.loan;
      } else if (query.includes('trust score') || query.includes('ट्रस्ट') || query.includes('ట్రస్ట్')) {
        botResponse = dictionary.trust;
      } else {
        botResponse = dictionary.default;
      }

      setMessages([...newMessages, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error('Chat error', error);
      setMessages([...newMessages, { text: "Network error trying to connect to the AI engine.", sender: 'bot' }]);
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
            <h1 className="text-xl font-bold text-white tracking-wide">Agri Assistant</h1>
            <p className="text-xs text-green-400 font-medium flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
              Online
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
