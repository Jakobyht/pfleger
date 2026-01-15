
import React, { useState } from 'react';
import { ChatSession, Message } from '../types';

interface ChatDetailViewProps {
  session: ChatSession;
  onBack: () => void;
}

const ChatDetailView: React.FC<ChatDetailViewProps> = ({ session, onBack }) => {
  const [messages, setMessages] = useState<Message[]>(session.messages);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputText,
      timestamp: Date.now()
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <div className="h-full flex flex-col bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-4 shadow-sm z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6A1FB0" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div className="flex items-center gap-3">
          <img src={session.participant.photo} className="w-10 h-10 rounded-full object-cover" alt="" />
          <div>
            <h3 className="font-bold text-gray-800 leading-none">{session.participant.name}</h3>
            <span className="text-[10px] text-green-500 font-bold uppercase">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium ${
              msg.senderId === 'me' 
                ? 'bg-gradient-to-r from-[#7B4AE2] to-[#6A1FB0] text-white rounded-br-none' 
                : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t flex gap-2 items-center">
        <input 
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder="Message..."
          className="flex-1 bg-gray-100 border-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />
        <button 
          onClick={handleSend}
          className="w-12 h-12 bg-purple-600 text-white flex items-center justify-center rounded-full shadow-lg active:scale-90 transition-transform"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    </div>
  );
};

export default ChatDetailView;
