import { ChatAPI } from '../api/chat-api';
import { ProfileAPI } from '../api/profile-api';
import { ChatDTO, ChatMessage } from '../api/types';
import { defaultChatModifyModalState } from '../store';
import { ChatModifyEntity, ChatModifyModal, ChatState } from '../store/types';
import { hasError } from '../utils/apiHasError';
import { PageUrl } from '../utils/urls';

const chatAPI = new ChatAPI();
const profileAPI = new ProfileAPI();

class ChatService {
  public getChats = async () => {
    const chatState = window.store.getState().chat;

    try {
      const response = await chatAPI.getChats({ title: chatState.searchFilter });
      window.store.set({ chat: { ...chatState, list: response } });
    } catch {
      window.router.go(PageUrl.ERROR);
    }
  };

  public createChat = async (fieldValue: string) => {
    const chatState = window.store.getState().chat;

    try {
      window.store.set({
        chat: {
          ...chatState,
          chatModifyModal: {
            ...chatState.chatModifyModal,
            isLoading: true,
            field: fieldValue
          }
        }
      });

      const response = await chatAPI.createChat({ title: fieldValue });

      if (hasError(response)) {
        this.handleChatModifyError(chatState, response.reason);
        return;
      }

      window.store.set({ chat: { ...chatState, chatModifyModal: defaultChatModifyModalState } });
      this.getChats();
    } catch {
      window.store.set({ chat: { ...chatState, chatModifyModal: defaultChatModifyModalState } });
      window.router.go(PageUrl.ERROR);
    }
  };

  public deleteChat = async () => {
    const chatState = window.store.getState().chat;

    try {
      window.store.set({
        chat: {
          ...chatState,
          chatModifyModal: {
            ...chatState.chatModifyModal,
            isLoading: true,
          }
        }
      });

      await chatAPI.deleteChat({ chatId: chatState.selectedChat!.id });
      window.store.set({ chat: { ...chatState, selectedChat: null, chatModifyModal: defaultChatModifyModalState } });
      this.getChats();
    } catch {
      window.store.set({ chat: { ...chatState, chatModifyModal: defaultChatModifyModalState } });
      window.router.go(PageUrl.ERROR);
    }
  };

  public addUser = (login: string) => {
    this.modifyUser(true, login);
  };

  public deleteUser = (login: string) => {
    this.modifyUser(false, login);
  };

  private modifyUser = async (isAddMode: boolean, login: string) => {
    const chatState = window.store.getState().chat;

    try {
      window.store.set({
        chat: {
          ...chatState,
          chatModifyModal: {
            ...chatState.chatModifyModal,
            field: login,
            isLoading: true,
          }
        }
      });

      const findUsersResponse = await profileAPI.findUsers({ login });

      if (hasError(findUsersResponse)) {
        this.handleChatModifyError(chatState, findUsersResponse.reason);
        return;
      }

      const response = isAddMode
        ? await chatAPI.addUser({ users: [findUsersResponse[0].id], chatId: chatState.selectedChat!.id })
        : await chatAPI.deleteUser({ users: [findUsersResponse[0].id], chatId: chatState.selectedChat!.id });

      if (hasError(response)) {
        this.handleChatModifyError(chatState, response.reason);
        return;
      }

      window.store.set({ chat: { ...chatState, chatModifyModal: defaultChatModifyModalState } });
    } catch {
      window.store.set({ chat: { ...chatState, chatModifyModal: defaultChatModifyModalState } });
      window.router.go(PageUrl.ERROR);
    }
  };

  private handleChatModifyError = (chatState: ChatState, error: string) => {
    window.store.set({
      chat: {
        ...chatState,
        chatModifyModal: {
          ...chatState.chatModifyModal,
          isLoading: false,
          error
        }
      }
    });
  };

  public selectChat = (id: number) => {
    const { chat: chatState } = window.store.getState();

    if (chatState.selectedChat) {
      chatAPI.endChatting();
    }

    const selectedChat = chatState.list?.find(item => item.id === id) || null;

    window.store.set({ chat: { ...chatState, selectedChat, paginationOffset: 0, messageList: [] } });
    this.startChatting();
  };

  public clearSelectedChat = () => {
    const { chat: chatState } = window.store.getState();

    if (chatState.selectedChat) {
      window.store.set({ chat: { ...chatState, selectedChat: null } });
      chatAPI.endChatting();
    }
  };

  private startChatting = async () => {
    const { chat: chatState, user } = window.store.getState();
    const response = await chatAPI.getChatToken({ id: chatState.selectedChat!.id });

    chatAPI.startChatting(
      { userId: user!.id, chatId: chatState.selectedChat!.id, token: response.token },
      this.handleChattingOpen,
      this.handleChattingError,
      this.handleGetMessage,
      this.handleGetOldMessages
    );
  };

  private handleChattingOpen = () => {
    window.store.set({ chat: { ...window.store.getState().chat, error: '' } });
    this.getOldMessages();
  };

  private handleChattingError = (event: CloseEvent) => {
    window.store.set({ chat: { ...window.store.getState().chat, error: event.reason } });
  };

  private handleGetMessage = (message: ChatMessage) => {
    const chatState = window.store.getState().chat;

    window.store.set({ chat: { ...chatState, messageList: [...chatState.messageList, message] } });
    this.changeSelectedChatData({
      ...chatState.selectedChat,
      last_message: {
        user: chatState.selectedChat?.last_message.user!,
        content: message.content,
        time: message.time
      }
    } as Nullable<ChatDTO>);
  };

  private handleGetOldMessages = (messages: ChatMessage[]) => {
    const chatState = window.store.getState().chat;
    const messageList = [...messages, ...chatState.messageList];
    const isUnreadMessagesReceived = (chatState.selectedChat?.unread_count || 0) <= messageList.length;

    if (!messages.length || chatState.messageList[0]?.id === messages[0]?.id) {
      return;
    }

    if (!isUnreadMessagesReceived) {
      this.getOldMessages();
    }

    window.store.set({ chat: { ...chatState, messageList, paginationOffset: messageList[0].id } });
    this.changeSelectedChatData({
      ...chatState.selectedChat,
      unread_count: isUnreadMessagesReceived ? 0 : chatState.selectedChat?.unread_count
    } as Nullable<ChatDTO>);
  };

  public changeSelectedChatData = (data: Nullable<ChatDTO>) => {
    const chatState = window.store.getState().chat;

    const chats = chatState.list.map(chat => {
      if (chat.id === data!.id) {
        return data as ChatDTO;
      }

      return chat;
    });

    window.store.set({ chat: { ...chatState, selectedChat: data, list: chats } });
  };

  public getOldMessages = () => {
    const chatState = window.store.getState().chat;
    chatAPI.getOldMessage(chatState.paginationOffset);
  };

  public sendMessage = (message: string) => {
    chatAPI.sendMessage(message);
  };

  public changeSearchField = (searchFilter: string) => {
    window.store.set({ chat: { ...window.store.getState().chat, searchFilter } });
    this.getChats();
  };

  public openChatModifyModal = (entity: ChatModifyEntity, isAddMode: boolean = true) => {
    this.changeChatModifyModal({ isOpen: true, entity, isAddMode });
  };

  public closeChatModifyModal = () => {
    this.changeChatModifyModal(defaultChatModifyModalState);
  };

  public changeChatModifyModal = (data: Partial<ChatModifyModal>) => {
    const chatState = window.store.getState().chat;

    window.store.set({
      chat: {
        ...chatState,
        chatModifyModal: {
          ...chatState.chatModifyModal,
          ...data
        },
      }
    });
  };
}

export default new ChatService();