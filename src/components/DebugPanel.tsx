import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ServerStatus {
  status: string;
  environment: string;
  n8nWebhookUrl: string;
  timestamp: string;
}

const DebugPanel: React.FC = () => {
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const checkServerStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/status`);
      setServerStatus(response.data);
    } catch (err) {
      console.error('Error checking server status:', err);
      setError('Could not connect to server. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white p-2 rounded-full shadow-lg"
      >
        {isOpen ? '✕' : '🛠️'}
      </button>
      
      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl w-80 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Connection Diagnostics</h3>
          
          <div className="mb-4">
            <button 
              onClick={checkServerStatus}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
              disabled={loading}
            >
              {loading ? 'Checking...' : 'Check Server Status'}
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded text-sm">
              {error}
            </div>
          )}
          
          {serverStatus && (
            <div className="text-sm dark:text-gray-200">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Status:</div>
                <div className={serverStatus.status === 'ok' ? 'text-green-500' : 'text-red-500'}>
                  {serverStatus.status}
                </div>
                
                <div className="font-medium">Environment:</div>
                <div>{serverStatus.environment}</div>
                
                <div className="font-medium">n8n Webhook:</div>
                <div className="truncate" title={serverStatus.n8nWebhookUrl}>
                  {serverStatus.n8nWebhookUrl === 'not set' 
                    ? <span className="text-red-500">Not set</span> 
                    : <span className="text-green-500">Configured</span>}
                </div>
                
                <div className="font-medium">Timestamp:</div>
                <div>{new Date(serverStatus.timestamp).toLocaleTimeString()}</div>
              </div>
              
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                API URL: {import.meta.env.VITE_API_URL || 'Not set'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DebugPanel;
