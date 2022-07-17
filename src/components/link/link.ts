import { Block } from 'core';
import './link.scss';

interface IProps {
  href: string;
  text?: string;
  class?: string;

  events?: {
    click: (e: Event) => void;
  }
}

export class Link extends Block<IProps> {
  static componentName = 'Link';

  constructor(props: IProps) {
    super({
      ...props,
      events: {
        click: (e: Event) => {
          e.preventDefault();
          window.router.go(props.href);
        }
      }
    });
  }

  render() {
    if (!this.props.text) {
      return `
        <a href=".{{href}}" class="${this.props.class ? this.props.class : 'link'}">
          <div data-layout=1></div>
        </a>
      `;
    }
    
    return `
      <a href=".{{href}}" class="${this.props.class ? this.props.class : 'link'}">{{text}}</a>
    `;
  }
}
