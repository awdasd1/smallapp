import React from 'react';
import { Bot, Github } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <div className="bg-blue-500 p-2 rounded-lg mr-3">
          <Bot size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">ChatBot</h1>
          <p className="text-xs text-gray-500">Powered by Webhooks & n8n</p>
        </div>
      </div>
      <a 
        href="https://github.com/yourusername/chatbot-webhook" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <Github size={20} className="mr-1" />
        <span className="text-sm">GitHub</span>
      </a>
    </header>
  );
};

export default Header;
