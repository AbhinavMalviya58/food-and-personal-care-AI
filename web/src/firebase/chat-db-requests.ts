import {
  doc,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Chat } from "@/lib/types/chat";

export const createChat = async (chat: Chat) => {
  const chatRef = collection(db, "chats");
  const chatDoc = await addDoc(chatRef, chat);
  return chatDoc.id;
};

export const updateChatById = async (
  chatId: string,
  updatedChatData: Partial<Chat>
) => {
  const chatDocRef = doc(db, "chats", chatId);
  await updateDoc(chatDocRef, updatedChatData);
};

export const getChatById = async (chatId: string) => {
  const chatRef = collection(db, "chats");
  const chatDoc = await getDocs(chatRef);
  const chat = chatDoc.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Chat[];
  return chat.find((chat) => chat.id === chatId);
};

export const getChatsByUserId = async (userId: string) => {
  const chatsRef = collection(db, "chats");
  const chatsSnapshot = await getDocs(chatsRef);
  const chats = chatsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Chat[];
  return chats.filter((chat) => chat.userId === userId);
};

export const getChatsByChatId = async (chatId: string) => {
  try {
    const chatDocRef = doc(db, "chats", chatId);
    const chatSnapshot = await getDoc(chatDocRef);

    if (chatSnapshot.exists()) {
      const chatData = chatSnapshot.data() as Chat;
      return {
        id: chatSnapshot.id,
        ...chatData
      };
    } else {
      //console.log("No chat found with the given ID");
      return null;
    }
  } catch (error) {
    console.error("Error fetching chat by ID:", error);
    throw error;
  }
};