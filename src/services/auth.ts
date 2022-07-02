import { AuthAPI, LoginRequestData, RegisterRequestData } from '../api/auth-api';
import { hasError } from '../utils/apiHasError';
import { PageUrl } from '../utils/urls';

const authAPI = new AuthAPI();

class AuthService {
  public login = async (data: LoginRequestData) => {
    window.store.set({ isLoading: true, loginError: undefined });

    const response = await authAPI.login(data);

    if (hasError(response)) {
      window.store.set({ isLoading: false, loginError: response.reason });
      return;
    }

    const responseUser = await authAPI.getUser();

    if (hasError(responseUser)) {
      window.store.set({ isLoading: false, loginError: responseUser.reason });
      return;
    }

    window.store.set({ isLoading: false, user: responseUser });
    window.router.go(PageUrl.CHATS);
  };

  public register = async (data: RegisterRequestData) => {
    window.store.set({ isLoading: true, registerError: undefined });

    const response = await authAPI.register(data);

    if (hasError(response)) {
      window.store.set({ isLoading: false, registerError: response.reason });
      return;
    }

    const responseUser = await authAPI.getUser();

    if (hasError(responseUser)) {
      window.store.set({ isLoading: false, loginError: responseUser.reason });
      return;
    }

    window.store.set({ isLoading: false, user: responseUser });
    window.router.go(PageUrl.CHATS);
  };

  public logout = async () => {
    window.store.set({ isLoading: true });

    await authAPI.logout();

    window.store.set({ isLoading: false, user: null });
    window.router.go(PageUrl.LOGIN);
  };
}

export default new AuthService();