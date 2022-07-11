import { formatDate } from '../utils/formatDate';
import { HTTPTransport } from '../utils/httpTransport';
import { API_ORIGIN } from './constants';
import {
  ChatDTO,
  ChatMessage,
  CreateChatRequestData,
  DeleteChatRequestData,
  DeleteChatResponseData,
  GetChatsRequestData,
  GetChatTokenRequestData,
  GetChatTokenResponseData,
  ModifyChatUserRequestData,
  StartChattingData
} from './types/chat.types';
import { APIError, SocketContentType } from './types/types';

const chatAPIInstance = new HTTPTransport(API_ORIGIN);

export class ChatAPI {
  socket: Nullable<WebSocket> = null;
  socketPingInterval: Nullable<NodeJS.Timeout> = null;

  createChat = (data: CreateChatRequestData) => {
    return chatAPIInstance.post<Nullable<APIError>>('/chats', { data });
  };

  deleteChat = (data: DeleteChatRequestData) => {
    return chatAPIInstance.delete<DeleteChatResponseData>('/chats', { data, headers: { 'content-type': 'application/json' } });
  };

  getChats = async (data: GetChatsRequestData) => {
    const response = await chatAPIInstance.get<ChatDTO[]>('/chats', { data: { ...data, title: encodeURIComponent(data.title || '') } });
    const decodedData = response.map(chat => {
      if (chat.last_message) {
        return {
          ...chat,
          last_message: {
            ...chat.last_message,
            content: decodeURIComponent(chat.last_message.content),
            time: formatDate(chat.last_message.time)
          }
        };
      }

      return chat;
    });

    return decodedData;
  };

  addUser = (data: ModifyChatUserRequestData) => {
    return chatAPIInstance.put<Nullable<APIError>>('/chats/users', { data, headers: { 'content-type': 'application/json' } });
  };

  deleteUser = (data: ModifyChatUserRequestData) => {
    return chatAPIInstance.delete<Nullable<APIError>>('/chats/users', { data, headers: { 'content-type': 'application/json' } });
  };

  getChatToken = (data: GetChatTokenRequestData) => {
    return chatAPIInstance.post<GetChatTokenResponseData>(`/chats/token/${data.id}`);
  };

  private createSocket = (userId: number, chatId: number, token: string) => {
    this.socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`);
    return this.socket;
  };

  startChatting = (
    startData: StartChattingData,
    onOpen: () => void,
    onError: (event: CloseEvent) => void,
    onMessage: (data: ChatMessage) => void,
    onGetOldMessages: (data: ChatMessage[]) => void
  ) => {
    const socket = this.createSocket(startData.userId, startData.chatId, startData.token);

    socket.addEventListener('open', () => {
      onOpen();

      this.socketPingInterval = setInterval(() => {
        socket.send(JSON.stringify({ type: SocketContentType.PING }));
      }, 5000);
    });

    socket.addEventListener('close', (event: CloseEvent) => {
      if (!event.wasClean) {
        onError(event);
      }

      clearInterval(this.socketPingInterval!);
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (data.type === SocketContentType.MESSAGE) {
        const decodedData: ChatMessage = this.formatMessage(data);
        onMessage(decodedData);
      }

      if (Array.isArray(data)) {
        const decodedData: ChatMessage[] = data.reverse().map(this.formatMessage);
        onGetOldMessages(decodedData);
      }
    });
  };

  private formatMessage = (message: ChatMessage): ChatMessage => {
    return {
      ...message,
      content: decodeURIComponent(message.content),
      time: formatDate(message.time)
    };
  };

  endChatting = () => {
    clearInterval(this.socketPingInterval!);
    this.socket?.close();
  };

  sendMessage = (message: string) => {
    this.socket?.send(JSON.stringify({ type: SocketContentType.MESSAGE, content: encodeURIComponent(message) }));
  };

  getOldMessage = (paginationOffset: number) => {
    this.socket?.send(JSON.stringify({ type: SocketContentType.GET_OLD, content: paginationOffset }));
  };
}