import { ProfileAPI, SavePasswordRequestData, SaveUserRequestData } from '../api/profile-api';
import { defaultAvatarChangeModalState } from '../store';
import { hasError } from '../utils/apiHasError';
import { PageUrl } from '../utils/urls';

const profileAPI = new ProfileAPI();

class ProfileService {
  public saveUser = async (data: SaveUserRequestData) => {
    try {
      window.store.set({ isLoading: true, profile: { ...window.store.getState().profile, error: undefined } });

      const response = await profileAPI.saveUser(data);

      if (hasError(response)) {
        window.store.set({ isLoading: false, profile: { ...window.store.getState().profile, error: response.reason } });
        return;
      }

      window.store.set({
        isLoading: false,
        user: response,
        profile: { ...window.store.getState().profile, isViewMode: true, isPasswordChangeMode: false }
      });
    } catch {
      window.store.set({ isLoading: false });
      window.router.go(PageUrl.ERROR);
    }
  };

  public savePassword = async (data: SavePasswordRequestData) => {
    try {
      window.store.set({ isLoading: true, profile: { ...window.store.getState().profile, error: undefined } });

      const response = await profileAPI.savePassword(data);

      if (hasError(response)) {
        window.store.set({ isLoading: false, profile: { ...window.store.getState().profile, error: response.reason } });
        return;
      }
    } catch {
      window.router.go(PageUrl.ERROR);
    }

    window.store.set({ isLoading: false, profile: { ...window.store.getState().profile, isViewMode: true, isPasswordChangeMode: false } });
  };

  public resetData = () => {
    window.store.set({
      profile: {
        isViewMode: true,
        isPasswordChangeMode: false,
      },
      avatarChangeModal: defaultAvatarChangeModalState,
    });
  };

  public changeViewMode = (isViewMode: boolean) => {
    window.store.set({ profile: { ...window.store.getState().profile, isViewMode } });
  };

  public changePasswordChangeMode = (isPasswordChangeMode: boolean) => {
    window.store.set({ profile: { ...window.store.getState().profile, isPasswordChangeMode } });
  };
}

export default new ProfileService();