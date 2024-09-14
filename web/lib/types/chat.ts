export enum Sender {
  User = "User",
  AI = "AI",
}

export type Chat = {
  id?: string;
  title: string;
  userId: string;
  messages: {
    sender: Sender;
    content: string;
  }[];
};
