import { useState } from 'react';
import { ChatProvider } from './context/ChatContext';
import ChatInterface from './components/ChatInterface';
import DebugPanel from './components/DebugPanel';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <ChatProvider>
          <ChatInterface />
          <DebugPanel />
          <button
            onClick={toggleDarkMode}
            className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </ChatProvider>
      </div>
    </div>
  );
}

export default App;
