import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Sun, Moon, Music2, Loader2 } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from "react-markdown";

type Message = {
  text: string;
  isBot: boolean;
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let storedSessionId = sessionStorage.getItem('session_id');
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      sessionStorage.setItem('session_id', storedSessionId);
    }
    setSessionId(storedSessionId);

    // Load chat history
    const savedMessages = sessionStorage.getItem("chat_history");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error("Error parsing chat history:", error);
        sessionStorage.removeItem("chat_history");
      }
    } else {
      // Add a welcome message if no chat history exists
      const welcomeMessage: Message = {
        text: "🎵 Hi there! I'm Music Buddy. Ask me about your favorite songs, genres, or artists! 🎶",
        isBot: true,
      };
      setMessages([welcomeMessage]);
      sessionStorage.setItem("chat_history", JSON.stringify([welcomeMessage]));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId) return;

    const newMessages = [...messages, { text: input, isBot: false }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const SERVER_URL =import.meta.env.VITE_APP_SERVER_URL;

      const response = await axios.post(SERVER_URL, {
        message: input,
        session_id: sessionId,  // Sending session ID along with user input
      });

      setMessages([...newMessages, { text: response.data.response, isBot: true }]);
    } catch (error: any) {
      console.error("API Error:", error.response ? error.response.data : error.message);
      setMessages([...newMessages, { 
        text: "Sorry, I'm having trouble connecting. Please try again later!", 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Music2 className={`w-10 h-10 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Music Buddy</h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Powered by Agentic AI</p>
            </div>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
              isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>

        {/* Chat Container */}
        <div className={`rounded-2xl p-6 mb-4 backdrop-blur-lg ${
          isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
        } shadow-2xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div ref={chatContainerRef} className="space-y-4 mb-4 max-h-[60vh] overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-fadeIn`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  message.isBot
                    ? `${isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'} rounded-tl-none`
                    : `${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'} rounded-tr-none`
                } ${isDarkMode ? 'text-white' : 'text-gray-800'} shadow-md`}>
      <ReactMarkdown>{message.text}</ReactMarkdown>
      </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'
                } rounded-tl-none animate-pulse flex items-center gap-2`}>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Music Buddy is Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about any music or share your preferences..."
              className={`flex-1 p-4 rounded-xl transition-all duration-300 outline-none ${
                isDarkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-400 hover:bg-gray-600 focus:bg-gray-600'
                  : 'bg-white text-gray-800 placeholder-gray-400 hover:bg-gray-50 focus:bg-gray-50'
              } shadow-md border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 bg-purple-500 hover:bg-purple-400 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
