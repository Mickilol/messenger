import { API_ORIGIN } from 'api/constants';
import Block from 'core/Block';

import './avatar.scss';

interface IProps {
  icon?: string;
  src?: string;
  classes?: string;
  onClick?: () => void;

  events?: {
    click: () => void;
  }
}

export class Avatar extends Block<IProps> {
  static componentName = 'Avatar';

  constructor({ onClick, ...props }: IProps) {
    super(onClick ? { ...props, events: { click: onClick } } : props);
  }

  render() {
    if (this.props.src) {
      return `
        <span class="avatar__wrapper {{classes}}">
          <img src="${API_ORIGIN}/resources{{src}}" alt="Avatar image" class="avatar__image">
        </span>
      `;
    }

    return `
      <span class="avatar__wrapper {{classes}}">
        {{#if icon}}<i class="{{icon}}"></i>{{/if}}
      </span>
    `;
  }
}