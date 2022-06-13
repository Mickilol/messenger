import { Block } from '../../core';

import './toolbar.scss';

export type ToolbarAction = {
  icon: string;
  text: string;
  onClick: () => void;
};

interface IProps {
  icon: string;
  classes?: string;
  actions?: ToolbarAction[];

  events?: {
    click: (e: Event) => void;
  }
}

export class Toolbar extends Block<IProps> {
  static componentName = 'Toolbar';

  constructor(props: IProps) {
    super(props);

    this.setProps({
      events: {
        click: this.handleClick
      }
    });
  }

  private get indent() {
    return 20;
  }

  private get content(): HTMLDivElement {
    return this.element?.querySelector('.toolbar__content') as HTMLDivElement;
  }

  private handleClick = (e: Event) => {
    const target = e.target as Element;
    const isContentClick = Boolean(target.closest('.toolbar__content'));

    if (isContentClick) {
      return this.handleContentClick(target);
    }

    if (this.content.classList.contains('toolbar__content_active')) {
      this.hideContent();
      this.element?.classList.remove('toolbar__wrapper_active');
    } else {
      this.showContent(e);
      this.element?.classList.add('toolbar__wrapper_active');
    }
  };

  private showContent = (e: Event) => {
    const target = e.currentTarget as HTMLSpanElement;
    const clientRect = target.getBoundingClientRect();

    this.content.classList.add('toolbar__content_active');

    const isUnder = clientRect.y < (this.content.offsetHeight + this.indent);
    const isOutOfRightBorder = window.innerWidth < (clientRect.left + this.content.offsetWidth);
    const left = isOutOfRightBorder ? `${clientRect.left - this.content.offsetWidth}px` : `${clientRect.left}px`;

    if (isUnder) {
      this.content.style.top = `${clientRect.bottom + this.indent}px`;
      this.content.style.left = left;
    } else {
      this.content.style.top = `${clientRect.top - this.indent - this.content.offsetHeight}px`;
      this.content.style.left = left;
    }
  };

  private hideContent = () => {
    this.content.classList.remove('toolbar__content_active');
  };

  private handleContentClick = (target: Element) => {
    const actionNode = target.closest('.action__wrapper') as HTMLSpanElement;
    const action = this.props.actions?.[Number(actionNode.dataset.index)];

    if (action) {
      action.onClick();
    }
  };

  render() {
    return `
      <span class="toolbar__wrapper {{classes}}">
        <i class="{{icon}}"></i>

        <div class="toolbar__content">
          {{#each actions}}
            <span class="action__wrapper" data-index="{{@index}}">
              <span class="action__icon">
                <i class="{{this.icon}}"></i>
              </span>
              <span class="action__text">{{this.text}}</span>
            </span>
          {{/each}}
        </div>
      </span>
    `;
  }
}