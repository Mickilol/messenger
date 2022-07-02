import { HTTPTransport } from '../utils/httpTransport';
import { APIError, ChatDTO, UserDTO } from './types';

const avatarAPIInstance = new HTTPTransport('https://ya-praktikum.tech/api/v2');

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
