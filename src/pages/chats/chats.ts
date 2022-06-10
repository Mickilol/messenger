import { ChatDTO } from '../../api/types';
import { ButtonType } from '../../components/button/button';
import { ToolbarAction } from '../../components/toolbar/toolbar';
import Block from '../../core/Block';

import './chats.scss';

interface IProps {
  chats?: ChatDTO[];
  chat?: ChatDTO;

  chatActions?: ToolbarAction[];
  attachmentActions?: ToolbarAction[];

  handleChatPreviewClick?: (id: number) => void;
  handleMessageSend?: () => void;
}

const CHATS: ChatDTO[] = [
  {
    id: 1,
    name: 'asdf',
    lastMessage: 'asdf',
    messages: [],
    timestamp: '12:23',
    unreadCounter: 1
  }
];

export class Chats extends Block<IProps> {
  constructor({ chats = CHATS }: IProps) {
    super({ chats });

    this.setProps({
      handleChatPreviewClick: this.handleChatPreviewClick,
      handleMessageSend: this.handleMessageSend,
      chatActions: [
        {
          icon: 'fa-solid fa-circle-plus fa-xl',
          text: 'Добавить пользователя',
          onClick: this.handleAddUser
        },
        {
          icon: 'fa-solid fa-circle-xmark fa-xl',
          text: 'Удалить пользователя',
          onClick: this.handleDeleteUser
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

  handleMessageSend = () => {
    const message = this.element?.querySelector('input[name=message]') as HTMLInputElement;

    if (!message.value) {
      return;
    }

    console.log(message.value);
  };

  private scrollDown = () => {
    const chatFeed = this.element?.querySelector('.main__chat-feed');

    if (chatFeed) {
      chatFeed.scrollTop = chatFeed.scrollHeight;
    }
  };

  private handleChatPreviewClick = (id: number) => {
    this.setProps({
      chat: this.props.chats?.find(item => item.id === id)
    });
    this.scrollDown();
  };

  private handleAddUser = () => {
    console.log('add user');
  };

  private handleDeleteUser = () => {
    console.log('delete user');
  };

  private handlePhotoOrVideoAttach = () => {
    console.log('attach photo or video');
  };

  private handleFileAttach = () => {
    console.log('attach file');
  };

  render() {
    return `
      <div class="chats__wrapper">
        <aside class="aside__wrapper">
          <div class="aside__header">
            <a href="../profile/profile.html" class="aside__profile-link">Профиль</a>
      
            <div class="aside__search-field search-field__wrapper">
              <input type="text" name="search" placeholder="placeholder" class="search-field__input">
              <span class="search-field__icon"></span>
              <label class="search-field__label">Поиск</label>
            </div>
          </div>
      
          {{{ChatsList chats=chats selectedChatId=chat.id onClick=handleChatPreviewClick }}}
        </aside>
      
        <main class="main__wrapper">
          {{#if chat}}
            <div class="main__header">
              <span class="main__avatar"></span>
              <span class="main__name">{{chat.name}}</span>

              {{{Toolbar icon="fa-solid fa-ellipsis-vertical" classes="main__actions" actions=chatActions }}}
            </div>
      
            <div class="main__chat-feed">
              {{#each chat.messages}}
                <span class="main__date">{{this.time}}</span>

                <div class="chat-message__wrapper {{#ifEqual value1=this.id value2=2}}chat-message__wrapper_yours{{/ifEqual}}">
                  <span class="chat-message__content">{{this.content}}</span>

                  <time class="chat-message__time">{{this.time}}</time>
                </div>
              {{/each}}
            </div>
      
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
      </div>
    `;
  }
}