"use client";

import { useState } from "react";

export interface ChatPart {
  text: string;
}

export interface ChatMessage {
  role: "model" | "user";
  parts: ChatPart[];
}

export interface ErrorMessage {
  code: string;
  message: string;
}

export type RequestPrompt = {
  messages: ChatMessage[];
  currentMessage: string;
};

export default function HistoryPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]); // Holds the entire chat history
  const [currentMessage, setCurrentMessage] = useState(""); // Holds the user's input message
  const [isLoading, setIsLoading] = useState(false); // Loading state while waiting for response

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentMessage.trim()) return; // Don't submit empty messages

    setIsLoading(true);

    try {
      // Send the user's message to the backend
      const res = await fetch("/api/prompt/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", parts: [{ text: currentMessage }] }],
          currentMessage,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Append the user's message and model's response to the chat history
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "user", parts: [{ text: currentMessage }] }, // User's message
          { role: "model", parts: [{ text: data.messages }] }, // Model's response
        ]);
        setCurrentMessage(""); // Clear the input field after submission
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setIsLoading(false); // Stop the loading state
    }
  };
  console.log(messages);
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-800">Chat History</h1>
      </header>
      <div className="flex-grow overflow-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                <p>{message.parts[0]?.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            className="flex-grow px-4 py-2 text-black border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              "Send"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
