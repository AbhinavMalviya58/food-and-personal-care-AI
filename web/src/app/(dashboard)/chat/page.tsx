'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getChatById, updateChatById } from "@/firebase/chat-db-requests";

import { WEB_APP_NAME } from "@/lib/constants/web";
import { Chat, Sender } from "@/lib/types/chat";

import { SendHorizonalIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { UserChat } from "./userChat";
import { AiChat } from "./aiChat";
import ROUTES from "@/lib/constants/routes";
import { UploadButton } from "@/lib/uploadthing/uploadthing";
import Image from "next/image";
//import { Suspense } from 'react';

interface UploadResponse {
  url: string;
}

const ChatConversation = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState<string>("");
  const [imgURL, setImgURL] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChat = async (id: string) => {
    setIsFetching(true);
    const response = await getChatById(id);
    if (response) setChat(response);
    setIsFetching(false);
  };

  const handleUploadComplete = (res: UploadResponse[] | null) => {
    if (res && res.length > 0) {
      const uploadedImgURL = res[0].url;
      setImgURL(uploadedImgURL);
    }
  };

  const handleSubmission = async () => {
    if (!message.trim() && !imgURL) return;

    setIsProcessing(true);

    try {
      console.log("Sending to backend:", { prompt: message, imageURL: imgURL });

      const response = await fetch("/api/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: message, imageURL: imgURL }),
      });

      if (!response.ok) throw new Error("Error submitting message");

      const data = await response.json();

      const updatedMessages = [
        ...(chat?.messages ?? []),
        { sender: Sender.User, content: message, imageUrl: imgURL || "" },
        { sender: Sender.AI, content: data.message, imageUrl: "" },
      ];

      if (chat?.id) {
        await updateChatById(chat.id, { messages: updatedMessages });
        setChat((prevChat) => prevChat && { ...prevChat, messages: updatedMessages });
      }

      setMessage("");
      setImgURL(null);
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

  if (isFetching) {
    return (
      <div className="flex w-full bg-[#212121] h-screen items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex flex-col w-full h-screen items-center justify-center gap">
        <span>No Chats Found</span>
        <Button
          onClick={() => router.replace(ROUTES.DASHBOARD)}
        >
          Go to Dashboard
        </Button>
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
                className={`flex gap-4 items-center ${message.sender === Sender.User ? "justify-end" : "justify-start"
                  }`}
              >
                {message.sender === Sender.User ? (
                  <UserChat content={message.content} imageUrl={message.imageUrl} />
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
          {/* Input */}
          <Card className="flex items-center space-x-4 w-full p-4 rounded-lg shadow-lg bg-gray-800">
            {imgURL && (
              <div className="relative w-12 h-12 rounded-md overflow-hidden">
                <Image src={imgURL} layout="fill" objectFit="cover" alt="Uploaded" />
              </div>
            )}
            <div className="flex-grow flex items-center space-x-2">
              <div className="mt-6"><UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={handleUploadComplete}
                onUploadError={(error: Error) => alert(`Error: ${error.message}`)}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
              </UploadButton></div>
              <Input
                type="text"
                value={message}
                placeholder={`Message ${WEB_APP_NAME}`}
                onChange={handleChange}
                className="flex-grow bg-gray-700 text-white border-none rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
                disabled={isProcessing}
              />
            </div>
            <Button
              variant="app-primary"
              onClick={handleSubmission}
              disabled={isProcessing || (!message.trim() && !imgURL)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors"
            >
              <SendHorizonalIcon className="w-5 h-5" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatConversation;
