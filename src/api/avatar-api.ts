import { HTTPTransport } from '../utils/httpTransport';
import { API_ORIGIN } from './constants';
import { ChatDTO } from './types/chat.types';
import { APIError, UserDTO } from './types/types';

const avatarAPIInstance = new HTTPTransport(API_ORIGIN);

export class AvatarAPI {
  static __instance: AvatarAPI;

  constructor() {
    if (AvatarAPI.__instance) {
      return AvatarAPI.__instance;
    }

    AvatarAPI.__instance = this;
  }

  saveProfileAvatar = (file: File) => {
    const data = new FormData();
    data.append('avatar', file);

    return avatarAPIInstance.put<UserDTO | APIError>('/user/profile/avatar', { data });
  };

  saveChatAvatar = (chatId: number, file: File) => {
    const data = new FormData();
    data.append('chatId', chatId.toString());
    data.append('avatar', file);

    return avatarAPIInstance.put<ChatDTO | APIError>('/chats/avatar', { data });
  };
}
