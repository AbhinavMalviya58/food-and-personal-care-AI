export enum Sender {
  User = "user",
  Model = "model",
}

export enum ChatType {
  FOOD_AI = "Food AI",
  PERSONAL_CARE_AI = "Personal Care AI",
}

export type ImageData = {
  base64String: string;
  mimeType: string;
};

type FileData = {
  mimeType: string;
  fileUri: string;
};

export type ChatHistoryPart = {
  fileData?: FileData;
  text?: string;
};

export type ChatHistory = {
  role: Sender;
  parts: ChatHistoryPart[];
};

export type Chat = {
  id?: string;
  title: string;
  userId: string;
  type: ChatType;
  history: ChatHistory[];
};
