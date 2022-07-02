export type APIError = {
  reason: string;
};

export type UserDTO = {
  id: number;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  avatar: string;
  phone: string;
  email: string;
};

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

export type SocketDataFormat = {
  type: SocketContentType;
  content: string;
};

export enum SocketContentType {
  CONNECTED = 'user connected',
  PING = 'ping',
  PONG = 'pong',
  GET_OLD = 'get old',
  MESSAGE = 'message'
}
