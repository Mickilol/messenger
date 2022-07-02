import { ChatMessage } from '../../api/types';
import Block from '../../core/Block';

import './chatFeed.scss';

interface IProps {
  userId: number;
  messageList: ChatMessage[];
  onGetOldMessages: () => void;
  events?: {
    scroll: (e: Event) => void;
  };
}

export const ALLOWABLE_SCROLL_DIFF = 20;

export class ChatFeed extends Block<IProps> {
  static componentName = 'ChatFeed';

  prevScrollTop = 0;

  constructor(props: IProps) {
    super(props);

    this.setProps({
      events: {
        scroll: this.handleScroll
      }
    });
  }

  public scrollDown = () => {
    this.element!.scrollTop = this.element!.scrollHeight;
  };

  private handleScroll = () => {
    if (this.element!.scrollTop < this.prevScrollTop && this.element!.scrollTop <= ALLOWABLE_SCROLL_DIFF) {
      this.props.onGetOldMessages();
    }

    this.prevScrollTop = this.element!.scrollTop;
  };

  render() {
    return `
    <div class="chat-feed">
      {{#each messageList}}
        <div 
          class="chat-message__wrapper {{#ifEqual value1=this.user_id value2=@root.userId}}chat-message__wrapper_yours{{/ifEqual}}"
        >
          <span class="chat-message__content">{{this.content}}</span>

          <time class="chat-message__time">{{this.time}}</time>
        </div>
      {{/each}}
    </div>
    `;
  }
}