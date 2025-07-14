import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Tractor, ImagePlus, X } from 'lucide-react';
import { getChatbotResponse } from '../lib/gemini';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
  loading?: boolean;
  imageUrl?: string;
}

function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Namaste! 🙏 I'm your friendly farming guide. I can help you with any farming questions - like how to grow crops organically, solve plant problems, or improve soil health. You can also share photos of your plants if you need help identifying problems!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [farmData, setFarmData] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('farmData');
    if (storedData) {
      setFarmData(JSON.parse(storedData));
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Please upload an image smaller than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        setImageUrl(url);
        setPreviewUrl(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageUrl('');
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !imageUrl) return;

    const userMessage: Message = {
      text: input,
      isBot: false,
      timestamp: new Date(),
      imageUrl: imageUrl
    };

    const loadingMessage: Message = {
      text: '',
      isBot: true,
      timestamp: new Date(),
      loading: true
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInput('');
    setImageUrl('');
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    try {
      const response = await getChatbotResponse(input, farmData, imageUrl);
      
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          text: response,
          isBot: true,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          text: "Namaste! 🙏 Sorry, I'm having some trouble understanding your question. Can you please ask again in simpler words?",
          isBot: true,
          timestamp: new Date()
        }
      ]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <Tractor className="h-6 w-6 text-green-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Your Farming Friend</h1>
              <p className="text-sm text-gray-600">Ask me anything about organic farming in simple words!</p>
            </div>
          </div>
          {farmData && (
            <div className="mt-2 p-2 bg-green-50 rounded text-sm">
              <p className="text-green-700">I know about your farm and will give advice that works for you</p>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`p-3 rounded-lg ${
                  message.isBot 
                    ? 'bg-green-100 text-gray-800' 
                    : 'bg-green-600 text-white'
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    {message.isBot ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span className="text-xs">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  {message.loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Let me think about this...</span>
                    </div>
                  ) : (
                    <>
                      {message.imageUrl && (
                        <div className="mb-2">
                          <img 
                            src={message.imageUrl} 
                            alt="Uploaded plant" 
                            className="rounded-lg max-w-full h-auto"
                          />
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t space-y-2">
          {previewUrl && (
            <div className="relative inline-block">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="h-20 w-20 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your farming questions in simple words..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ImagePlus className="h-5 w-5" />
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chatbot;