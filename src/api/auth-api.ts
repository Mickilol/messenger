import { HTTPTransport } from '../utils/httpTransport';
import { API_ORIGIN } from './constants';
import { LoginRequestData, LoginResponseData, RegisterRequestData, RegisterResponseData } from './types/auth.types';
import { APIError, UserDTO } from './types/types';

const authAPIInstance = new HTTPTransport(API_ORIGIN);

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
