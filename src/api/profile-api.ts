import { HTTPTransport } from '../utils/httpTransport';
import { APIError, UserDTO } from './types';

const profileAPIInstance = new HTTPTransport('https://ya-praktikum.tech/api/v2');

export type SaveUserRequestData = Omit<UserDTO, 'id' | 'avatar'>;

export type SavePasswordRequestData = {
  oldPassword: string;
  newPassword: string;
};

export type FindUsersRequestData = {
  login: string;
};

type ResponseData = UserDTO | APIError;

export class ProfileAPI {
  saveUser = (data: SaveUserRequestData) => {
    return profileAPIInstance.put<ResponseData>('/user/profile', { data });
  };

  saveAvatar = (file: File) => {
    const data = new FormData();
    data.append('avatar', file);

    return profileAPIInstance.put<ResponseData>('/user/profile/avatar', { data });
  };

  savePassword = (data: SavePasswordRequestData) => {
    return profileAPIInstance.put<null | APIError>('/user/password', { data });
  };

  findUsers = (data: FindUsersRequestData) => {
    return profileAPIInstance.post<UserDTO[] | APIError>('/user/search', { data });
  };
}