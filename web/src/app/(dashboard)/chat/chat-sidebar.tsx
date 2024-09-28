'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthContext } from "@/contexts/auth-context.provider";
import { getChatsByUserId } from "@/firebase/chat-db-requests";
import { HOME_ROUTE } from "@/lib/constants/constants";
import { Chat, ChatType } from "@/lib/types/chat";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ChatSidebar = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [selectedType, setSelectedType] = useState<ChatType>(ChatType.FOOD_AI);
  const router = useRouter();
  const {
    user
  } = useAuthContext();
  const params = useSearchParams();
  const id = params.get('id');

  const userId = user?.id;

  const fetchChatsByUserId = async (userId: string) => {
    const response = await getChatsByUserId(userId);

    setChats(response);
    const filteredResponse = response.filter((chat) => chat.type === selectedType);
    setFilteredChats(response);

    if (filteredResponse.length !== 0) {
      const chatId = id ? id : filteredResponse[0].id;
      router.replace(`/chat?id=${chatId}`);
    };
  }

  useEffect(() => {
    const filteredResponse = chats.filter(chat => chat.type === selectedType);
    setFilteredChats(filteredResponse);
  }, [selectedType]);

  useEffect(() => {
    if (!userId) return;
    fetchChatsByUserId(userId);
  }, [userId]);

  if (!user) return null; // TODO: Add a loading spinner

  return (
    <nav className="w-1/5 bg-[#212121] flex flex-col shadow-md overflow-y-auto pb-8">
      <div className="sticky top-0 z-10 border-b border-gray-200">
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
      <ul className="flex-1 flex-col p-4 space-y-2 overflow-auto">
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
      <div className="w-full px-4">
        <Button
          size="lg"
          variant="app-primary"
          className="w-full"
          onClick={() => router.push(HOME_ROUTE)}
        >
          Go to Dashboard
        </Button>
      </div>
    </nav>
  );
}

export default ChatSidebar;
