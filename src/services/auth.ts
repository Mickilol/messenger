import { AuthAPI } from '../api/auth-api';
import { LoginRequestData, RegisterRequestData } from '../api/types/auth.types';
import { hasError } from '../utils/apiHasError';
import { PageUrl } from '../utils/urls';

class AuthService {
  private readonly authAPI: AuthAPI;

  constructor() {
    this.authAPI = new AuthAPI();
  }

  public login = async (data: LoginRequestData) => {
    window.store.set({
      isLoading: true,
      loginError: undefined
    });

    const response = await this.authAPI.login(data);

    if (hasError(response)) {
      window.store.set({
        isLoading: false,
        loginError: response.reason
      });
      return;
    }

    const responseUser = await this.authAPI.getUser();

    if (hasError(responseUser)) {
      window.store.set({
        isLoading: false,
        loginError: responseUser.reason
      });
      return;
    }

    window.store.set({
      isLoading: false,
      user: responseUser
    });
    window.router.go(PageUrl.CHATS);
  };

  public register = async (data: RegisterRequestData) => {
    window.store.set({
      isLoading: true,
      registerError: undefined
    });

    const response = await this.authAPI.register(data);

    if (hasError(response)) {
      window.store.set({
        isLoading: false,
        registerError: response.reason
      });
      return;
    }

    const responseUser = await this.authAPI.getUser();

    if (hasError(responseUser)) {
      window.store.set({
        isLoading: false,
        loginError: responseUser.reason
      });
      return;
    }

    window.store.set({
      isLoading: false,
      user: responseUser
    });
    window.router.go(PageUrl.CHATS);
  };

  public logout = async () => {
    window.store.set({
      isLoading: true
    });

    await this.authAPI.logout();

    window.store.set({
      isLoading: false,
      user: null
    });
    window.router.go(PageUrl.LOGIN);
  };
}

export default new AuthService();