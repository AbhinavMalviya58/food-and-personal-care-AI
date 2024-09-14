'use client';


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MarkdownContent from "@/components/ui/markdown-content";

import { DUMMY_CHAT } from "@/lib/constants/chat-messages";
import { DUMMY_PROMPT } from "@/lib/constants/prompt";
import { WEB_APP_NAME } from "@/lib/constants/web";
import { Chat, Sender } from "@/lib/types/chat";

import { Paperclip, SendHorizonalIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatConversationProps {
  params: {
    id: string;
  };
}

const ChatConversation: React.FC<ChatConversationProps> = ({
  params,
}) => {
  const [chat, setChat] = useState<Chat>();
  const [message, setMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchChat = async (id: string) => {
    const response = await fetch(`/api/chat/${id}`);
    const data = await response.json();
    setChat(data);
  }

  const onSubmit = async () => {
    if (!message) {
      return;
    }

    // const response = await fetch(`/api/chat/${id}/message`, {
    //   method: "POST",
    //   body: JSON.stringify({
    //     content: message,
    //   }),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    // if (!response.ok) {
    //   return;
    // }

    // const result = await response.json();

    setChat({
      id: chat?.id || "",
      title: chat?.title || "",
      userId: chat?.userId || "",
      messages: [
        ...chat?.messages!,
        {
          sender: Sender.User,
          content: message,
        },
        {
          sender: Sender.AI,
          content: DUMMY_PROMPT, // result.message
        }
      ]
    });

    setMessage("");

    scrollToBottom();
  };

  useEffect(() => {
    if (!params.id) {
      setChat(DUMMY_CHAT);
    }

    fetchChat(params.id as string);
  }, [params.id]);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-white">Loading...</span>
      </div>
    )
  }

  return (
    <div
      className="flex py-8 gap-4 h-screen bg-app-dark"
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          onSubmit();
        }
      }}
    >
      <div className="flex flex-col items-center gap-8 mx-auto">
        <div className="w-full lg:w-[60%]">
          <h1 className="text-center text-star-white cursor-pointer text-3xl font-secondary">
            {chat.title}
          </h1>
        </div>
        <div
          className="flex flex-1 flex-col items-center gap-8 overflow-y-auto px-8"
        >
          <div className="w-full lg:w-[60%]">
            {
              chat.messages.map((message) => {
                if (message.sender === Sender.User) {
                  return (
                    <div className="flex gap-4 items-center justify-end">
                      <div className="max-w-[80%] p-4 rounded-lg bg-gray-2">
                        <span className="text-white text-base">{message.content}</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="flex gap-4 items-center justify-start">
                    <div className="max-w-[80%] p-4 rounded-lg">
                      <MarkdownContent
                        markdown={message.content}
                      />
                    </div>
                  </div>
                );
              })
            }
          </div>
          <div ref={messagesEndRef} />
        </div>
        <div className="w-full lg:w-[60%] flex flex-col gap-4">
          <div className="flex gap-4 items-end">
            <Button
              onClick={() => { }}
              variant="app-primary"
            >
              <Paperclip />
            </Button>
            <Input
              className="flex-1"
              onChange={handleChange}
              placeholder={`Message ${WEB_APP_NAME}`}
              value={message}
            />
            <Button
              onClick={onSubmit}
              variant="app-primary"
            >
              <SendHorizonalIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatConversation;