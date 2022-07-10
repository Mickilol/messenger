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
