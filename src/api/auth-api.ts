import { HTTPTransport } from '../utils/httpTransport';
import { APIError, UserDTO } from './types';

export type LoginRequestData = {
  login: string;
  password: string;
};

type LoginResponseData = null | APIError;

export type RegisterRequestData = Omit<UserDTO, 'display_name' | 'avatar' | 'id'> & {
  password: string;
};

type RegisterResponseData = { id: number } | APIError;

const authAPIInstance = new HTTPTransport('https://ya-praktikum.tech/api/v2');

export class AuthAPI {
  static __instance: AuthAPI;

  constructor() {
    if (AuthAPI.__instance) {
      return AuthAPI.__instance;
    }

    AuthAPI.__instance = this;
  }

  register = (data: RegisterRequestData) => {
    return authAPIInstance.post<RegisterResponseData>('/auth/signup', { data });
  };

  login = (data: LoginRequestData) => {
    return authAPIInstance.post<LoginResponseData>('/auth/signin', { data });
  };

  getUser = () => {
    return authAPIInstance.get<UserDTO | APIError>('/auth/user');
  };

  logout = () => {
    return authAPIInstance.post('/auth/logout');
  };
}
