import { HTTPTransport } from '../utils/httpTransport';
import { API_ORIGIN } from './constants';
import { FindUsersRequestData, ProfileResponseData, SavePasswordRequestData, SaveUserRequestData } from './types/profile.types';
import { APIError, UserDTO } from './types/types';

const profileAPIInstance = new HTTPTransport(API_ORIGIN);

export class ProfileAPI {
  saveUser = (data: SaveUserRequestData) => {
    return profileAPIInstance.put<ProfileResponseData>('/user/profile', { data });
  };

  saveAvatar = (file: File) => {
    const data = new FormData();
    data.append('avatar', file);

    return profileAPIInstance.put<ProfileResponseData>('/user/profile/avatar', { data });
  };

  savePassword = (data: SavePasswordRequestData) => {
    return profileAPIInstance.put<Nullable<APIError>>('/user/password', { data });
  };

  findUsers = (data: FindUsersRequestData) => {
    return profileAPIInstance.post<UserDTO[] | APIError>('/user/search', { data });
  };
}