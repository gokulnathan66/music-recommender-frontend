import React, { useState } from 'react';
import { Sun, Moon, Music2, Loader2 } from 'lucide-react';
import axios from 'axios';

type Message = {
  text: string;
  isBot: boolean;
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm your AI-powered music buddy powered by Gemini. Tell me what kind of music you like, your mood, or ask for specific recommendations!", isBot: true }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: input, isBot: false }]);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/chat', {
        message: input
      });
      
      setMessages(prev => [...prev, { text: response.data.response, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later!", 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Music2 className={`w-10 h-10 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Music Buddy
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Powered by Gemini AI
              </p>
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
          <div className="space-y-4 mb-4 max-h-[60vh] overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-fadeIn`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  message.isBot
                    ? `${isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'} rounded-tl-none`
                    : `${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'} rounded-tr-none`
                } ${isDarkMode ? 'text-white' : 'text-gray-800'} shadow-md`}>
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'
                } rounded-tl-none animate-pulse`}>
                  <Loader2 className="w-6 h-6 animate-spin" />
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
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                isDarkMode
                  ? 'bg-purple-600 hover:bg-purple-500 text-white'
                  : 'bg-purple-500 hover:bg-purple-400 text-white'
              } shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed`}
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