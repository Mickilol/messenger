import Block from 'core/Block';

import './button.scss';

export enum ButtonStyle {
  DANGER = 'DANGER'
}

export enum ButtonType {
  SPAN = 'SPAN',
  CUSTOM_SPAN = 'CUSTOM_SPAN'
}

interface IProps {
  text: string;
  icon?: string;
  type: string;
  formId?: string;
  classes?: string;
  spanType?: ButtonType;
  style?: ButtonStyle;
  isLoading: boolean;
  dataTestId?: string;
  onClick?: (e: Event) => void;
}

export class Button extends Block {
  static componentName = 'Button';

  constructor({ onClick, ...props }: IProps) {
    super({ ...props, events: { click: onClick } });
  }

  protected render(): string {
    if (this.props.spanType === ButtonType.SPAN) {
      return `
        <span 
          class="span-button {{classes}} ${this.props.style === ButtonStyle.DANGER ? 'span-button_danger' : ''}"
          {{#if dataTestId}}data-testid="{{dataTestId}}"{{/if}}
        >
          {{text}} {{#if icon}}<i class="{{icon}}"></i>{{/if}}
        </span>
      `;
    }

    if (this.props.spanType === ButtonType.CUSTOM_SPAN) {
      return `
        <span class="{{classes}}" {{#if dataTestId}}data-testid="{{dataTestId}}"{{/if}}>
          {{text}} {{#if icon}}<i class="{{icon}}"></i>{{/if}}
        </span>
      `;
    }

    return `
      <button 
        class="button {{classes}}"
        type="{{type}}"
        form="{{formId}}"
        {{#if isLoading}}disabled{{/if}}
        {{#if dataTestId}}data-testid="{{dataTestId}}"{{/if}}
      >
        {{text}} {{#if icon}}<i class="{{icon}}"></i>{{/if}}
      </button>
    `;
  }
}
