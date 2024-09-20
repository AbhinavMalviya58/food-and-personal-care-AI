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
    <div>
      <h1>History</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="bg-black text-white"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>

      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <p>
              <strong>{message.role === "user" ? "User" : "Model"}:</strong>{" "}
              {message.parts[0]?.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
