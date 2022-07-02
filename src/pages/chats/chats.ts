import { ChatDTO, ChatMessage, UserDTO } from '../../api/types';
import { ButtonType } from '../../components/button/button';
import { ToolbarAction } from '../../components/toolbar/toolbar';
import Block from '../../core/Block';
import { connect } from '../../core/connect';
import { AppState, AvatarChangeModal, ChatModifyEntity, ChatModifyModal } from '../../store/types';
import { PageUrl } from '../../utils/urls';
import chatService from '../../services/chat';
import avatarService from '../../services/avatar';

import './chats.scss';
import { ChatFeed, Field } from '../../components';
import { trim } from '../../utils/mydash/trim';

interface IOwnProps {
  chatActions: ToolbarAction[];
  attachmentActions: ToolbarAction[];

  handleSearchFieldChange: (value: string) => void;
  handleChatCreateBtnClick: () => void;
  handleChatModifyModalClose: () => void;
  handleChatModify: () => void;
  handleAvatarChangeModalClose?: () => void;
  handleAvatarChange?: (file: File) => void;
  handleAvatarSave?: () => void;
  handleChatPreviewClick: (id: number) => void;
  handleGetOldMessages: () => void;
  handleMessageSend: () => void;
}

interface IStateToProps {
  user: Nullable<UserDTO>;
  chats: ChatDTO[];
  selectedChat: Nullable<ChatDTO>;
  avatarChangeModal: AvatarChangeModal;
  chatModifyModal: ChatModifyModal;
  searchFilter: string;
  messageList: ChatMessage[];
}

type IProps = IOwnProps & IStateToProps;

interface IState { }

interface IRefs {
  chatModifyField: Field;
  chatFeed: ChatFeed;
}

class Chats extends Block<IProps, IState, IRefs> {
  constructor(props: IProps) {
    super({ ...props });

    this.setProps({
      handleSearchFieldChange: this.handleSearchFieldChange,
      handleChatCreateBtnClick: this.handleChatCreateBtnClick,
      handleChatModifyModalClose: this.handleChatModifyModalClose,
      handleChatModify: this.handleChatModify,
      handleAvatarChangeModalClose: this.handleAvatarChangeModalClose,
      handleAvatarChange: this.handleAvatarChange,
      handleAvatarSave: this.handleAvatarSave,
      handleChatPreviewClick: this.handleChatPreviewClick,
      handleGetOldMessages: this.handleGetOldMessages,
      handleMessageSend: this.handleMessageSend,
      chatActions: [
        {
          icon: 'fa-solid fa-circle-plus fa-xl',
          text: 'Добавить пользователя',
          onClick: this.handleUserAddBtnClick
        },
        {
          icon: 'fa-solid fa-circle-xmark fa-xl',
          text: 'Удалить пользователя',
          onClick: this.handleUserDeleteBtnClick
        },
        {
          icon: 'fa-solid fa-circle-xmark fa-xl',
          text: 'Удалить чат',
          onClick: this.handleChatDeleteBtnClick
        },
        {
          icon: 'fa-solid fa-image fa-xl',
          text: 'Изменить аватар чата',
          onClick: this.handleAvatarChangeBtnClick
        }
      ],
      attachmentActions: [
        {
          icon: 'fa-solid fa-image fa-xl',
          text: 'Фото или видео',
          onClick: this.handlePhotoOrVideoAttach
        },
        {
          icon: 'fa-solid fa-file fa-xl',
          text: 'Файл',
          onClick: this.handleFileAttach
        }
      ]
    });
  }

  componentDidMount(): void {
    chatService.getChats();
  }

  componentWillUnmount(): void {
    chatService.clearSelectedChat();
  }

  componentUpdated(oldProps: IProps, newProps: IProps): void {
    if (!oldProps.messageList.length && newProps.messageList.length) {
      setTimeout(() => {
        this.refs.chatFeed.scrollDown();
      });
    }

    if (oldProps.messageList.length !== newProps.messageList.length && oldProps.messageList?.[0]?.id === newProps.messageList?.[0]?.id) {
      setTimeout(() => {
        this.refs.chatFeed.scrollDown();
      });
    }
  }

  private handleSearchFieldChange = (value: string) => {
    chatService.changeSearchField(value);
  };

  private handleChatCreateBtnClick = () => {
    chatService.openChatModifyModal(ChatModifyEntity.CHAT);
  };

  private handleChatDeleteBtnClick = () => {
    chatService.openChatModifyModal(ChatModifyEntity.CHAT, false);
  };

  private handleUserAddBtnClick = () => {
    chatService.openChatModifyModal(ChatModifyEntity.USER);
  };

  private handleUserDeleteBtnClick = () => {
    chatService.openChatModifyModal(ChatModifyEntity.USER, false);
  };

  private handleChatModifyModalClose = () => {
    chatService.closeChatModifyModal();
  };

  private handleChatModify = () => {
    if (this.props.chatModifyModal.entity === ChatModifyEntity.CHAT) {
      if (this.props.chatModifyModal.isAddMode) {
        chatService.createChat(this.refs.chatModifyField.getValue());
      } else {
        chatService.deleteChat();
      }
    } else {
      if (this.props.chatModifyModal.isAddMode) {
        chatService.addUser(this.refs.chatModifyField.getValue());
      } else {
        chatService.deleteUser(this.refs.chatModifyField.getValue());
      }
    }
  };

  private handleAvatarChangeBtnClick = () => {
    avatarService.openAvatarChangeModal();
  };

  private handleAvatarChangeModalClose = () => {
    avatarService.closeAvatarChangeModal();
  };

  private handleAvatarChange = (file: File) => {
    avatarService.changeAvatar(file);
  };

  private handleAvatarSave = () => {
    avatarService.saveChatAvatar();
  };

  private handleGetOldMessages = () => {
    chatService.getOldMessages();
  };

  private handleMessageSend = () => {
    const message = this.element?.querySelector('input[name=message]') as HTMLInputElement;
    const messageText = trim(message.value);

    if (!messageText) {
      return;
    }

    chatService.sendMessage(messageText);
    message.value = '';
  };

  private handleChatPreviewClick = (id: number) => {
    if (this.props.selectedChat?.id !== id) {
      chatService.selectChat(id);
    }
  };

  private handlePhotoOrVideoAttach = () => {
    console.log('attach photo or video');
  };

  private handleFileAttach = () => {
    console.log('attach file');
  };

  render() {
    const { isAddMode, entity } = this.props.chatModifyModal;
    const modifyModalTitle = entity === ChatModifyEntity.CHAT
      ? isAddMode ? 'Создать чат' : 'Удалить чат'
      : isAddMode ? 'Добавить пользователя' : 'Удалить пользователя';

    const modifyModalButtonText = entity === ChatModifyEntity.CHAT
      ? isAddMode ? 'Создать' : 'Удалить'
      : isAddMode ? 'Добавить' : 'Удалить';

    return `
      <div class="chats__wrapper">
        <aside class="aside__wrapper">
          <div class="aside__header">
            {{{Button 
              spanType="${ButtonType.CUSTOM_SPAN}"
              icon="fa-solid fa-pen-to-square"
              classes="aside__create-chat-btn"
              onClick=handleChatCreateBtnClick
            }}}

            {{{Link href="${PageUrl.PROFILE}" text="Профиль" class="aside__profile-link" }}}

            {{{SearchField value=searchFilter classes="aside__search-field" onChange=handleSearchFieldChange }}}
          </div>
      
          {{{ChatsList chats=chats selectedChatId=selectedChat.id onClick=handleChatPreviewClick }}}
        </aside>
      
        <main class="main__wrapper">
          {{#if selectedChat}}
            <div class="main__header">
              {{{Avatar classes="main__avatar" src=selectedChat.avatar }}}
              
              <span class="main__name">{{selectedChat.title}}</span>

              {{{Toolbar icon="fa-solid fa-ellipsis-vertical" classes="main__actions" actions=chatActions }}}
            </div>

            {{{ChatFeed messageList=messageList userId=user.id onGetOldMessages=handleGetOldMessages ref="chatFeed"}}}
      
            <div class="main__new-message-box">
              {{{Toolbar icon="fa-solid fa-paperclip fa-xl" classes="main__attachment" actions=attachmentActions }}}
      
              <div class="message-field__wrapper">
                <input type="text" name="message" placeholder="placeholder" class="message-field__input" autocomplete="off">
                <label class="message-field__label">Сообщение</label>
              </div>

              {{{Button 
                icon="fa-solid fa-arrow-right"
                classes="main__send-btn"
                spanType="${ButtonType.CUSTOM_SPAN}"
                onClick=handleMessageSend
               }}}
            </div>
          {{else}}
            <span class="main__empty-message">Выберите чат, чтобы отправить сообщение</span>
          {{/if}}
        </main>

        {{#Modal
          isOpen=chatModifyModal.isOpen 
          onClose=handleChatModifyModalClose 
          title="${modifyModalTitle}"
        }}
          <div class="chat-modify-modal__content-wrapper">
            {{#ifEqual value1=chatModifyModal.entity value2="${ChatModifyEntity.CHAT}" }}
              {{#if chatModifyModal.isAddMode}}
                {{{Field 
                  name="field"
                  label="Название чата"
                  value="${this.props.chatModifyModal.field ?? ''}"
                  ref="chatModifyField"
                }}}
              {{else}}
                <span>Вы действительно хотите удалить этот чат?</span>
              {{/if}}
            {{/ifEqual}}

            {{#ifEqual value1=chatModifyModal.entity value2="${ChatModifyEntity.USER}" }}
              {{{Field 
                name="field"
                label="Логин"
                value="${this.props.chatModifyModal.field ?? ''}"
                ref="chatModifyField"
              }}}
            {{/ifEqual}}

            {{{Button 
              text="${modifyModalButtonText}"
              onClick=handleChatModify
              classes="chat-modify-modal__button"
              isLoading=chatModifyModal.isLoading
            }}}
            {{{Error text=chatModifyModal.error }}}
          </div>
        {{/Modal}}

        {{{AvatarChangeModal 
          modalData=avatarChangeModal
          onClose=handleAvatarChangeModalClose
          onChange=handleAvatarChange
          onSave=handleAvatarSave
        }}}
      </div>
    `;
  }
}

export default connect(
  Chats,
  ({
    user,
    avatarChangeModal,
    chat: { chatModifyModal, list: chats, searchFilter, selectedChat, messageList }
  }: AppState): IStateToProps => ({
    chatModifyModal, chats, searchFilter, selectedChat, messageList, user, avatarChangeModal
  })
);