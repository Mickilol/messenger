import { AppState, ChatModifyEntity, ChatModifyModal, AvatarChangeModal } from './types';

export const defaultAvatarChangeModalState: AvatarChangeModal = {
  isOpen: false,
  title: 'Загрузите файл',
  file: null,
  error: '',
  isLoading: false
};

export const defaultChatModifyModalState: ChatModifyModal = {
  isOpen: false,
  isAddMode: true,
  entity: ChatModifyEntity.CHAT,
  field: '',
  error: '',
  isLoading: false
};

export const defaultState: AppState = {
  isLoading: false,
  user: null,
  loginError: '',
  avatarChangeModal: defaultAvatarChangeModalState,
  profile: {
    isViewMode: true,
    isPasswordChangeMode: false,
  },
  chat: {
    error: '',
    searchFilter: '',
    list: [],
    selectedChat: null,
    chatModifyModal: defaultChatModifyModalState,
    messageList: [],
    paginationOffset: 0
  }
};

export const PAGINATION_SIZE = 20;
