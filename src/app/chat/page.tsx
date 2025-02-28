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
    setChatHistory((prev) => [...prev, `You: ${message}`]);
    fetchAIResponse(message);
    setMessage("");
  };

  useEffect(() => {
    if (city) {
      setChatHistory([
        `Welcome to the tour guide for ${city}! How can I help you?`,
      ]);
    }
  }, [city]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">Chatbot for {city}</h1>
      <div className="mt-6 space-y-4">
        {chatHistory.map((msg, index) => (
          <p key={index} className="text-lg">
            {msg}
          </p>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-6">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something about the city"
          className="p-3 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatbotPage;
