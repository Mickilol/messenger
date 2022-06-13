export type ChatDTO = {
  id: number;
  name: string;
  timestamp: string;
  lastMessage: string;
  unreadCounter: Nullable<number>;

  messages: ChatMessage[];
};

type ChatMessage = {
  id: number;
  user_id: number;
  chat_id: number;
  time: string;
  type: ChatMessageType;
  content: string;
};

export enum ChatMessageType {
  MESSAGE = 'message',
  FILE = 'file'
}