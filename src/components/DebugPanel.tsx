import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ServerStatus {
  status: string;
  environment: string;
  n8nWebhookUrl: string;
  timestamp: string;
  apiUrl?: string;
  corsOrigin?: string;
}

const DebugPanel: React.FC = () => {
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  const checkServerStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/status`);
      setServerStatus(response.data);
    } catch (err) {
      console.error('Error checking server status:', err);
      setError('لا يمكن الاتصال بالخادم. تحقق من وحدة التحكم للحصول على التفاصيل.');
    } finally {
      setLoading(false);
    }
  };

  const sendTestMessage = async () => {
    if (!testMessage.trim()) return;
    
    setTestLoading(true);
    setTestResponse(null);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat`, {
        message: testMessage
      });
      setTestResponse(response.data.reply);
    } catch (err) {
      console.error('Error sending test message:', err);
      setTestResponse('فشل إرسال الرسالة الاختبارية. تحقق من وحدة التحكم للحصول على التفاصيل.');
    } finally {
      setTestLoading(false);
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
        <div className="absolute bottom-12 right-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl w-96 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">تشخيص الاتصال</h3>
          
          <div className="mb-4">
            <button 
              onClick={checkServerStatus}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
              disabled={loading}
            >
              {loading ? 'جاري الفحص...' : 'فحص حالة الخادم'}
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
                <div className="font-medium">الحالة:</div>
                <div className={serverStatus.status === 'ok' ? 'text-green-500' : 'text-red-500'}>
                  {serverStatus.status === 'ok' ? 'متصل' : 'غير متصل'}
                </div>
                
                <div className="font-medium">البيئة:</div>
                <div>{serverStatus.environment}</div>
                
                <div className="font-medium">عنوان n8n:</div>
                <div className="truncate" title={serverStatus.n8nWebhookUrl}>
                  {serverStatus.n8nWebhookUrl === 'not set' 
                    ? <span className="text-red-500">غير محدد</span> 
                    : <span className="text-green-500">تم تكوينه</span>}
                </div>
                
                <div className="font-medium">CORS:</div>
                <div className="truncate" title={serverStatus.corsOrigin}>
                  {serverStatus.corsOrigin || '*'}
                </div>
                
                <div className="font-medium">الوقت:</div>
                <div>{new Date(serverStatus.timestamp).toLocaleTimeString()}</div>
              </div>
              
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                عنوان API: {import.meta.env.VITE_API_URL || 'غير محدد'}
              </div>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-medium mb-2 dark:text-white">اختبار الرسائل</h4>
            <div className="flex mb-2">
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="أدخل رسالة اختبارية..."
                className="flex-1 border border-gray-300 rounded-l p-2 text-sm"
              />
              <button
                onClick={sendTestMessage}
                disabled={testLoading || !testMessage.trim()}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-r text-sm disabled:opacity-50"
              >
                {testLoading ? 'جاري الإرسال...' : 'إرسال'}
              </button>
            </div>
            {testResponse && (
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm dark:text-white">
                <strong>الرد:</strong> {testResponse}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;
