import React from 'react';

const ChatBubble = ({ message }) => {
  const isUser = message.sender === 'user';

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
        <p className={`text-[10px] mt-1.5 text-right font-medium opacity-70 ${isUser ? 'text-green-100' : 'text-slate-400'}`}>
          {isUser ? 'You' : 'Agri Assistant'}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;
