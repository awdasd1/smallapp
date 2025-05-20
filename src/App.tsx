import React, { useState } from 'react';
    import { MessageCircle, Paperclip } from 'lucide-react';
    import { IntlProvider } from 'react-intl';

    interface Message {
      id: string;
      text: string;
      sender: 'user' | 'bot';
      timestamp: Date;
    }

    interface FileUpload {
      id: string;
      name: string;
      type: string;
      size: number;
      uploaded: boolean;
    }

    export default function App() {
      const [messages, setMessages] = useState<Message[]>([]);
      const [uploads, setUploads] = useState<FileUpload[]>([]);
      const [newMessage, setNewMessage] = useState('');
      const [isLoading, setIsLoading] = useState(false);

      const handleSendMessage = async () => {
        if (newMessage.trim()) {
          const userMessage: Message = {
            id: Math.random().toString(),
            text: newMessage,
            sender: 'user',
            timestamp: new Date(),
          };

          setMessages([...messages, userMessage]);
          setNewMessage('');
          setIsLoading(true);

          try {
            const response = await fetch(import.meta.env.VITE_N8N_WORKFLOW_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message: newMessage }),
            });

            if (response.ok) {
              const data = await response.json();
              if (data && data.response) {
                const botMessage: Message = {
                  id: Math.random().toString(),
                  text: data.response,
                  sender: 'bot',
                  timestamp: new Date(),
                };
                setMessages(prev => [...prev, botMessage]);
              } else {
                throw new Error('No response data received');
              }
            } else {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
              id: Math.random().toString(),
              text: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.',
              sender: 'bot',
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
          } finally {
            setIsLoading(false);
          }
        }
      };

      const handleFileUpload = (acceptedFiles: File[]) => {
        const newUploads = acceptedFiles.map(file => ({
          id: Math.random().toString(),
          name: file.name,
          type: file.type,
          size: file.size,
          uploaded: false,
        }));

        setUploads([...uploads, ...newUploads]);

        setTimeout(() => {
          setUploads(prev => prev.map(upload => ({
            ...upload,
            uploaded: true,
          })));
        }, 2000);
      };

      return (
        <IntlProvider locale="ar" messages={{}}>
          <div className="min-h-screen bg-gray-100 p-4 direction-rtl">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
              <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-gray-800">
                  واجهة الدردشة
                </h1>
              </div>

              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div 
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg">
                      جاري الرد...
                    </div>
                  </div>
                )}

                {uploads.map(upload => (
                  <div 
                    key={upload.id}
                    className={`flex items-center space-x-2 p-2 rounded-lg ${
                      upload.uploaded 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    <Paperclip className="w-4 h-4" />
                    <span>{upload.name}</span>
                    {upload.uploaded && <span className="text-sm">تم التحميل</span>}
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="اكتب رسالتك..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    ارسال
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <Paperclip className="w-4 h-4" />
                    <span className="text-gray-600">الملفات المرفقة</span>
                  </div>
                  <div className="mt-2">
                    <label className="block w-full text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                      <input
                        type="file"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            handleFileUpload(Array.from(e.target.files));
                          }
                        }}
                        className="hidden"
                        disabled={isLoading}
                      />
                      <span className="text-gray-600">اسحب الملفات هنا او اختر من خلال النقر</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </IntlProvider>
      );
    }
