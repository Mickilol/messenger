import { hasError } from '../utils/apiHasError';
import { PageUrl } from '../utils/urls';
import { AvatarAPI } from '../api/avatar-api';
import { defaultAvatarChangeModalState } from '../store';
import { AvatarChangeModal } from '../store/types';
import chatService from '../services/chat';
import { ChatDTO } from '../api/types/chat.types';

class AvatarService {
  private readonly avatarAPI: AvatarAPI;

  constructor() {
    this.avatarAPI = new AvatarAPI();
  }

  public saveProfileAvatar = async () => {
    try {
      const avatarChangeModal = window.store.getState().avatarChangeModal;

      if (!avatarChangeModal.file) {
        this.changeAvatarChangeModal({ error: 'Нужно выбрать файл' });
        return;
      }

      this.changeAvatarChangeModal({
        isLoading: true
      });

      const response = await this.avatarAPI.saveProfileAvatar(avatarChangeModal.file);

      if (hasError(response)) {
        this.changeAvatarChangeModal({
          isLoading: false,
          title: 'Ошибка, попробуйте ещё раз',
          error: response.reason, file: null
        });
        return;
      }

      window.store.set({
        user: response,
        avatarChangeModal: defaultAvatarChangeModalState
      });
    } catch {
      window.store.set({
        avatarChangeModal: defaultAvatarChangeModalState
      });
      window.router.go(PageUrl.ERROR);
    }
  };

  public saveChatAvatar = async () => {
    try {
      const { avatarChangeModal, chat: { selectedChat } } = window.store.getState();

      if (!avatarChangeModal.file) {
        this.changeAvatarChangeModal({ error: 'Нужно выбрать файл' });
        return;
      }

      this.changeAvatarChangeModal({
        isLoading: true
      });

      const response = await this.avatarAPI.saveChatAvatar(selectedChat!.id, avatarChangeModal.file);

      if (hasError(response)) {
        this.changeAvatarChangeModal({
          isLoading: false,
          title: 'Ошибка, попробуйте ещё раз',
          error: response.reason,
          file: null
        });
        return;
      }

      window.store.set({
        avatarChangeModal: defaultAvatarChangeModalState
      });
      chatService.changeSelectedChatData({
        ...selectedChat,
        avatar: response.avatar
      } as ChatDTO);
    } catch {
      window.store.set({
        avatarChangeModal: defaultAvatarChangeModalState
      });
      window.router.go(PageUrl.ERROR);
    }
  };

  public openAvatarChangeModal = () => {
    this.changeAvatarChangeModal({
      isOpen: true
    });
  };

  public closeAvatarChangeModal = () => {
    this.changeAvatarChangeModal(defaultAvatarChangeModalState);
  };

  public changeAvatar = (file: File) => {
    this.changeAvatarChangeModal({
      file,
      title: 'Файл загружен',
      error: ''
    });
  };

  public changeAvatarChangeModal = (data: Partial<AvatarChangeModal>) => {
    const avatarChangeModalState = window.store.getState().avatarChangeModal;

    window.store.set({
      avatarChangeModal: {
        ...avatarChangeModalState,
        ...data
      },
    });
  };
}

export default new AvatarService();