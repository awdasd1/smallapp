import React from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { ChatProvider } from './context/ChatContext';

function App() {
  return (
    <ChatProvider>
      <div className="flex flex-col h-screen bg-gray-100">
        <Header />
        <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto shadow-lg bg-white rounded-lg overflow-hidden my-4">
          <ChatWindow />
          <ChatInput />
        </div>
        <footer className="text-center py-3 text-sm text-gray-500">
          Built with React, Vite, and Webhook Integration
        </footer>
      </div>
    </ChatProvider>
  );
}

export default App;
