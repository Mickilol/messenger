import { UserDTO } from './types';

export type ChatDTO = {
  id: number;
  created_by: number;
  title: string;
  avatar: string;
  unread_count: number;
  last_message: LastMessage;
};

type LastMessage = {
  user: UserDTO;
  time: string;
  content: string;
};

export type ChatMessage = {
  id: number;
  user_id: number;
  chat_id: number;
  time: string;
  type: ChatMessageType;
  content: string;
  file?: ChatMessageFile;
};

export enum ChatMessageType {
  MESSAGE = 'message',
  FILE = 'file'
}

type ChatMessageFile = {
  id: number;
  user_id: number;
  path: string;
  filename: string;
  content_type: string;
  content_size: number;
  upload_date: string;
};

export type CreateChatRequestData = { title: string; };

export type DeleteChatRequestData = { chatId: number; };

export type DeleteChatResponseData = { userId: number; result: { id: number; title: string; avatar: string; } };

export type GetChatsRequestData = { offset?: number; limit?: number; title?: string; };

export type ModifyChatUserRequestData = { users: number[]; chatId: number; };

export type GetChatTokenRequestData = { id: number };

export type GetChatTokenResponseData = { token: string };

export type StartChattingData = {
  userId: number;
  chatId: number;
  token: string;
};