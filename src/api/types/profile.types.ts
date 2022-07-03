import { APIError, UserDTO } from './types';

export type SaveUserRequestData = Omit<UserDTO, 'id' | 'avatar'>;

export type SavePasswordRequestData = {
  oldPassword: string;
  newPassword: string;
};

export type FindUsersRequestData = {
  login: string;
};

export type ProfileResponseData = UserDTO | APIError;