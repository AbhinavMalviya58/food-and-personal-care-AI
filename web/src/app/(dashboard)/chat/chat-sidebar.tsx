'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Chat, ChatType } from "@/lib/types/chat";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface ChatSidebarProps {
  filteredChats: Chat[];
  selectedType: ChatType;
  setSelectedType: (value: ChatType) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  filteredChats,
  selectedType,
  setSelectedType
}) => {
  const params = useSearchParams();
  const id = params.get("id");

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
            <Link href={`/chat?id=${chat.id}`} className="cursor-pointer">
              <Card
                className={`${chat.id === id as string ? 'bg-app-primary hover:opacity-85' : 'hover:bg-gray-1'} transition duration-150 ease-in-out`}
              >
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
