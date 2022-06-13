import { ChatDTO } from '../../api/types';
import { Block } from '../../core';

import './chatsList.scss';

interface IProps {
  chats: ChatDTO[];
  selectedChatId?: number;
  onClick?: (id: number) => void;

  events: {
    click: (e: Event) => void;
  }
}

export class ChatsList extends Block<IProps> {
  static componentName = 'ChatsList';

  constructor(props: IProps) {
    super(props);

    this.setProps({
      events: {
        click: this.handleCLick
      }
    });
  }

  handleCLick = (e: Event) => {
    const target = e.target as Element;
    const li = target.closest('li');

    if (li && this.props.onClick) {
      this.props.onClick(Number(li.dataset.chatId));
    }
  };

  render() {
    return `
      <ul class="list__wrapper"> 
        {{#each chats}}
          <li class="list__item" data-chat-id="{{this.id}}">
            <div 
              class="chat-preview__wrapper {{#ifEqual value1=this.id value2=@root.selectedChatId}}chat-preview__wrapper_active{{/ifEqual}}"
            >
              <span class="chat-preview__avatar"></span>

              <div class="chat-preview__body">
                <div class="chat-preview__header">
                  <span class="chat-preview__name">{{this.name}}</span>
                  <time class="chat-preview__timestamp">{{this.timestamp}}</time>
                </div>
                
                <div class="chat-preview__content">
                  <span class="chat-preview__last-message">{{this.lastMessage}}</span>

                  {{#if chat.unreadCounter}}
                    <span class="chat-preview__unread-counter">{{this.unreadCounter}}</span>
                  {{/if}}
                </div>
              </div>
            </div>
          </li>
        {{/each}}
      </ul>
    `;
  }
}