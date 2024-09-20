export enum Sender {
  User = "User",
  AI = "AI",
}

export enum ChatType {
  FOOD_AI = "Food AI",
  PERSONAL_CARE_AI = "Personal Care AI",
}

export type Chat = {
  id?: string;
  title: string;
  userId: string;
  type: ChatType;
  messages: {
    sender: Sender;
    content: string;
    imageUrl?: string;
  }[];
};
export interface ChatMessage {
  role: 'model' | 'user'
  parts: ChatPart[]
}

export interface ErrorMessage {
  code: string
  message: string
}

export interface ChatPart {
  text: string
}