"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const ChatbotPage = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const city = searchParams.get("city");

  const fetchAIResponse = async (query: string) => {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `Tell me about ${city} and its tourist attractions.`,
      }),
    });
    const data = await res.json();
    setChatHistory((prev) => [...prev, `AI: ${data.answer}`]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setChatHistory((prev) => [...prev, `You: ${message}`]);
    fetchAIResponse(message);
    setMessage("");
  };

  useEffect(() => {
    if (city) {
      setChatHistory([`Welcome to the tour guide for ${city}! How can I help you?`]);
    }
  }, [city]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-teal-100 to-purple-200 p-6">
      {/* Chat Box Container */}
      <div className="relative w-full max-w-2xl p-6 bg-white/40 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Chatbot for {city}
        </h1>

        {/* Chat Messages */}
        <div className="mt-4 max-h-96 overflow-y-auto p-4 bg-white/20 rounded-xl border border-white/30 shadow-inner">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`p-3 my-2 max-w-[80%] rounded-lg ${
                msg.startsWith("You:")
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-gray-200 text-gray-900 self-start"
              }`}
            >
              {msg}
            </div>
          ))}
        </div>

        {/* Input & Button */}
        <form onSubmit={handleSubmit} className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask something about the city..."
            className="flex-1 p-3 rounded-full border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/70"
          />
          <button
            type="submit"
            className="px-5 py-3 text-white font-semibold bg-gradient-to-r from-blue-500 to-teal-500 rounded-full shadow-lg hover:scale-105 transition-all active:scale-95"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotPage;
