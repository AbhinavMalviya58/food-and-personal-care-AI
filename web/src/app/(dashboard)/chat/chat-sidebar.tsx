'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getChatsByUserId } from "@/firebase/chat-db-requests";
import { Chat, ChatType } from "@/lib/types/chat";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

const ChatSidebar = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [selectedType, setSelectedType] = useState<ChatType>(ChatType.FOOD_AI);
  const router = useRouter();
  const userId = "test-user-id"; // TODO: Fetch userId from getUser

  const fetchChatsByUserId = useCallback(async (userId: string) => {
    const response = await getChatsByUserId(userId);

    setChats(response);
    const filteredResponse = response.filter((chat) => chat.type === selectedType);
    setFilteredChats(response);

    if (filteredResponse.length !== 0) router.replace(`/chat?id=${filteredResponse[0].id}`);
  }, [selectedType, router]);

  useEffect(() => {
    const filteredResponse = chats.filter(chat => chat.type === selectedType);
    setFilteredChats(filteredResponse);
  }, [selectedType, chats]);

  useEffect(() => {
    if (!userId) return;
    fetchChatsByUserId(userId);
  }, [userId, fetchChatsByUserId]);

  return (
    <nav className="w-1/5 bg-[#212121]  shadow-md overflow-y-auto">
      <div className="sticky top-0  z-10 border-b border-gray-200">
        <h1 className="font-bold text-2xl p-6">Chat History</h1>
        <Select
          onValueChange={(value) => {
            setSelectedType(value as ChatType);
          }}
          value={selectedType}
          defaultValue={ChatType.FOOD_AI}
        >
          <SelectTrigger>
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ChatType.FOOD_AI}>Food AI Chats</SelectItem>
            <SelectItem value={ChatType.PERSONAL_CARE_AI}>Personal Care AI Chats</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ul className="p-4 space-y-2">
        {filteredChats.length !== 0 ? filteredChats.map((chat) => (
          <li key={chat.id}>
            <Link href={`/chat?id=${chat.id}`}>
              <Card className="hover:bg-gray-500 transition duration-150 ease-in-out">
                <CardContent className="p-4">
                  <span className="">{chat.title}</span>
                </CardContent>
              </Card>
            </Link>
          </li>
        )) : <p className="text-center text-gray-400">No chats found</p>}
      </ul>
    </nav>
  );
}

export default ChatSidebar;
