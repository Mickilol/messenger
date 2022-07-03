import { APIError, UserDTO } from './types';

export type LoginRequestData = {
  login: string;
  password: string;
};

export type LoginResponseData = Nullable<APIError>;

export type RegisterRequestData = Omit<UserDTO, 'display_name' | 'avatar' | 'id'> & {
  password: string;
};

export type RegisterResponseData = { id: number } | APIError;