"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AVAILABLE_CITIES = ["durres", "himare", "tirana", "saranda", "shkodra"] as const;
type City = typeof AVAILABLE_CITIES[number];

const ChatContent = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const city = (searchParams.get("city") as City) || AVAILABLE_CITIES[0];

  const handleCityChange = (newCity: City) => {
    router.push(`/chat?city=${newCity}`);
  };

  const fetchAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage,
          city: city,
          context: chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].content : undefined
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await res.json();
      setChatHistory(prev => [
        ...prev,
        { role: 'assistant', content: data.answer.replace(/<think>.*?\/think>/g, ' '), timestamp: new Date() }
      ]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setChatHistory(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: "I apologize, but I'm having trouble responding right now. Please try again.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    
    setChatHistory(prev => [
      ...prev,
      { role: 'user', content: userMessage, timestamp: new Date() }
    ]);
    
    await fetchAIResponse(userMessage);
  };

  useEffect(() => {
    // Capitalize city name for display
    const displayCity = city.charAt(0).toUpperCase() + city.slice(1);
    setChatHistory([{ 
      role: 'assistant', 
      content: `# Welcome to ${displayCity}! 👋\n\nI'm your AI tour guide. I can help you with:\n\n* Tourist attractions and points of interest\n* Local culture and history\n* Nearby hospitals and pharmacies\n* Restaurant recommendations\n* Travel tips and practical information\n\nWhat would you like to know about ${displayCity}?`,
      timestamp: new Date()
    }]);
  }, [city]);

  // Capitalize city name for display
  const displayCity = city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-teal-100 to-purple-200 p-6">
      <div className="relative w-full max-w-2xl p-6 bg-white/40 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            {displayCity} Tour Guide
          </h1>
          <select
            value={city}
            onChange={(e) => handleCityChange(e.target.value as City)}
            className="px-4 py-2 rounded-lg bg-white/70 border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {AVAILABLE_CITIES.map((cityOption) => (
              <option key={cityOption} value={cityOption}>
                {cityOption.charAt(0).toUpperCase() + cityOption.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm text-gray-600 text-center mb-4">
          Ask me anything about {displayCity}!
        </p>

        <div className="mt-4 max-h-[60vh] overflow-y-auto p-4 bg-white/20 rounded-xl border border-white/30 shadow-inner">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`relative p-3 my-2 rounded-lg ${
                msg.role === 'user'
                  ? "bg-blue-500 text-white ml-auto max-w-[80%]"
                  : "bg-white/60 text-gray-900 mr-auto max-w-[80%]"
              }`}
            >
              <div className="text-xs opacity-70 mb-1">
                {format(msg.timestamp, 'HH:mm')}
              </div>
              <div className={`prose ${msg.role === 'user' ? 'prose-invert' : 'prose-gray'} max-w-none`}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2 p-3 bg-white/60 text-gray-700 rounded-lg max-w-[80%]">
              <div className="animate-pulse flex items-center">
                <span className="mr-2">Thinking</span>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask anything about the city..."
            className="flex-1 p-3 rounded-full border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/70"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`px-5 py-3 text-white font-semibold bg-gradient-to-r from-blue-500 to-teal-500 rounded-full shadow-lg transition-all ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
            }`}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

const ChatbotPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
};

export default ChatbotPage;
