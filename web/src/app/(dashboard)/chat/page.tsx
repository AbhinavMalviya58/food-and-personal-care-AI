'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import MarkdownContent from "@/components/ui/markdown-content";
import { getChatById, updateChatById } from "@/firebase/chat-db-requests";

import { WEB_APP_NAME } from "@/lib/constants/web";
import { Chat, Sender } from "@/lib/types/chat";

import { Paperclip, SendHorizonalIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { UserChat } from "./userChat";
import { AiChat } from "./aiChat";

const ChatConversation = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const params = useSearchParams();
  const id = params.get("id");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChat = async (id: string) => {
    const response = await getChatById(id);
    if (response) setChat(response);
  };

  const handleSubmission = async () => {
    if (!message.trim()) return;

    setIsProcessing(true);

    try {
      const response = await fetch("/api/prompt/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: message }),
      });

      if (!response.ok) throw new Error("Error submitting message");

      const data = await response.json();

      const updatedMessages = [
        ...chat?.messages!,
        { sender: Sender.User, content: message },
        { sender: Sender.AI, content: data.message },
      ];

      if (chat?.id) {
        await updateChatById(chat.id, { messages: updatedMessages });
        setChat((prevChat) => prevChat && { ...prevChat, messages: updatedMessages });
      }

      setMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (id) fetchChat(id);
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  if (!chat) {
    return (
      <div className="flex w-full  h-screen items-center justify-center">
        <span className="text-white">Loading...</span>
      </div>
    );
  }

  return (
    <div
      className="flex py-8 gap-4 bg-[#212121] h-screen w-full"
      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmission()}
    >
      <div className="flex flex-col w-full items-center gap-8 mx-auto">
        <div className="w-full lg:w-[80%]">
          <h1 className="text-center text-star-white cursor-pointer text-3xl font-secondary">
            {chat.title}
          </h1>
        </div>
        <div className="flex flex-col w-full flex-1 items-center gap-8 overflow-y-auto px-8">
          <div className="flex flex-col space-y-3 w-full lg:w-[60%]">
            {chat.messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-4 items-center ${
                  message.sender === Sender.User ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === Sender.User ? (
                  <UserChat content={message.content} />
                ) : (
                  <AiChat content={message.content} />
                )}
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>
        <div className="w-full lg:w-[60%] flex flex-col gap-4">
          {isProcessing && (
            <div className="flex items-center justify-center">
              <span className="text-white">Processing...</span>
            </div>
          )}
          <div className="flex gap-4 items-end">
            <Button variant="app-primary">
              <Paperclip />
            </Button>
            <Input
              className="flex-1"
              onChange={handleChange}
              placeholder={`Message ${WEB_APP_NAME}`}
              value={message}
              disabled={isProcessing}
            />
            <Button variant="app-primary" onClick={handleSubmission}>
              <SendHorizonalIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatConversation;
