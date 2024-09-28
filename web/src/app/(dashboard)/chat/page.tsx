'use client';

import { useRouter } from "next/navigation";
import ChatConversation from "./chat-conversation";
import ChatSidebar from "./chat-sidebar";
import { useEffect, useState } from "react";
import { Chat, ChatType } from "@/lib/types/chat";
import { useAuthContext } from "@/contexts/auth-context.provider";
import { getChatsByUserId } from "@/firebase/chat-db-requests";

const ChatPage = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [selectedType, setSelectedType] = useState<ChatType>(ChatType.FOOD_AI);
  const [isChatsLoading, setIsChatsLoading] = useState<boolean>(true);
  const router = useRouter();
  const {
    user
  } = useAuthContext();

  const userId = user?.id;

  const fetchChatsByUserId = async (userId: string) => {
    const response = await getChatsByUserId(userId);

    setChats(response);
    const filteredResponse = response.filter((chat) => chat.type === selectedType);
    setFilteredChats(response);

    if (filteredResponse.length !== 0) {
      router.replace(`/chat?id=${filteredResponse[0].id}`);
    }

    setIsChatsLoading(false);
  }

  useEffect(() => {
    const filteredResponse = chats.filter(chat => chat.type === selectedType);
    setFilteredChats(filteredResponse);
  }, [selectedType]);

  useEffect(() => {
    if (userId) {
      fetchChatsByUserId(userId);
    }
  }, [userId]);

  if (isChatsLoading) {
    return (
      <div className="w-full flex items-center justify-center h-full">
        <p>Loading chats...</p>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="w-full flex items-center justify-center h-full">
        <p>No chats found</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Please login to view this page</p>
      </div>
    );
  }

  return (
    <>
      <ChatSidebar
        filteredChats={filteredChats}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
      <main className="flex-1 overflow-y-auto ">
        <ChatConversation />
      </main>
    </>
  );
};

export default ChatPage;
