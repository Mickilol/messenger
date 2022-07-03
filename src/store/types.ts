import { ChatDTO, ChatMessage } from '../api/types/chat.types';
import { UserDTO } from '../api/types/types';

export type AppState = {
  isLoading: boolean;
  user: Nullable<UserDTO>;
  loginError?: string;
  registerError?: string;
  profile: ProfileState;
  chat: ChatState;
  avatarChangeModal: AvatarChangeModal;
};

type ProfileState = {
  error?: string;
  isViewMode: boolean;
  isPasswordChangeMode: boolean;
};

export type AvatarChangeModal = {
  isOpen: boolean;
  title: string;
  file: Nullable<File>;
  error: string;
  isLoading: boolean;
};

export type ChatState = {
  error: string;
  searchFilter: string;
  list: ChatDTO[];
  selectedChat: Nullable<ChatDTO>;
  chatModifyModal: ChatModifyModal;

  messageList: ChatMessage[];
  paginationOffset: number;
};

export type ChatModifyModal = {
  isOpen: boolean;
  isAddMode: boolean;
  entity: ChatModifyEntity;
  field: string;
  error: string;
  isLoading: boolean;
};

export enum ChatModifyEntity {
  CHAT = 'CHAT',
  USER = 'USER'
}