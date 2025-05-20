import { useState, useRef, ChangeEvent, FormEvent } from 'react'
import './App.css'

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Paperclip, Send, User, Bot, FileImage, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

// Types for our chat application
type MessageType = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

type FileType = {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

function App() {
  // State for messages
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      content: 'مرحبا! كيف يمكنني مساعدتك اليوم؟',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  // State for input text
  const [inputText, setInputText] = useState('');
  
  // State for files
  const [files, setFiles] = useState<FileType[]>([]);
  
  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Ref for scroll area
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Handle input text change
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  // Handle file selection
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        size: file.size
      }));
      
      setFiles([...files, ...newFiles]);
    }
  };

  // Open file dialog
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove file
  const removeFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (inputText.trim() === '' && files.length === 0) return;
    
    // Create content text including file information
    let content = inputText;
    if (files.length > 0) {
      content += '\n' + files.map(file => `[File: ${file.name}]`).join('\n');
    }
    
    // Create user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Add user message to chat
    setMessages([...messages, userMessage]);
    
    // Clear input and files
    setInputText('');
    setFiles([]);
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: 'شكرا لرسالتك! سأقوم بالتحقق من ذلك.',
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Scroll to bottom after bot response
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    }, 1000);
  };

  // Function to determine file icon
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <FileImage className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-xl flex items-center gap-2">
            <Bot className="h-5 w-5" />
            تطبيق الدردشة
          </CardTitle>
        </CardHeader>
        
        <ScrollArea 
          ref={scrollAreaRef} 
          className="h-[400px] p-4"
        >
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={cn(
                  "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  message.sender === 'user' 
                    ? "ml-auto bg-primary text-primary-foreground" 
                    : "bg-muted"
                )}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    {message.sender === 'user' ? (
                      <>
                        <AvatarFallback>U</AvatarFallback>
                        <AvatarImage src="" />
                      </>
                    ) : (
                      <>
                        <AvatarFallback>B</AvatarFallback>
                        <AvatarImage src="" />
                      </>
                    )}
                  </Avatar>
                  <span className="text-xs">
                    {message.sender === 'user' ? 'أنت' : 'بوت'}
                  </span>
                </div>
                
                <div style={{ direction: 'rtl' }}>
                  {message.content.split('\n').map((text, i) => (
                    <p key={i}>{text}</p>
                  ))}
                </div>
                
                <span className="ml-auto text-xs opacity-50">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {files.length > 0 && (
          <div className="px-4 py-2 border-t">
            <p className="text-xs text-gray-500 mb-2">الملفات المرفقة:</p>
            <div className="flex flex-wrap gap-2">
              {files.map(file => (
                <div 
                  key={file.id}
                  className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs"
                >
                  {getFileIcon(file.type)}
                  <span className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {file.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => removeFile(file.id)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <CardFooter className="flex flex-col border-t p-4">
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
            <Textarea
              placeholder="اكتب رسالتك هنا..."
              value={inputText}
              onChange={handleInputChange}
              className="min-h-20 resize-none"
              dir="rtl"
            />
            
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={openFileDialog}
                >
                  <Paperclip className="h-4 w-4" />
                  <span className="sr-only">إرفاق ملف</span>
                </Button>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  className="hidden"
                />
              </div>
              
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                إرسال
              </Button>
            </div>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

export default App
