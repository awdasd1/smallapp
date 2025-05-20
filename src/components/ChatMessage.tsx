import React from 'react';
import { Message } from '../types';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex items-center justify-center h-10 w-10 rounded-full ${isBot ? 'bg-blue-500 mr-3' : 'bg-gray-700 ml-3'}`}>
          {isBot ? <Bot size={20} className="text-white" /> : <User size={20} className="text-white" />}
        </div>
        <div className={`py-3 px-4 rounded-2xl ${isBot ? 'bg-gray-200 text-gray-800 rounded-tl-none' : 'bg-blue-500 text-white rounded-tr-none'}`}>
          <p className="text-sm">{message.content}</p>
          <p className="text-xs mt-1 opacity-70">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
