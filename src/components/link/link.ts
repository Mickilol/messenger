import { Block } from '../../core';
import './link.scss';

interface IProps {
  href: string;
  text: string;
}

export class Link extends Block {
  static componentName = 'Link';

  constructor(props: IProps) {
    super({ ...props });
  }

  render() {
    return `
      <a href="{{href}}" class="link">{{text}}</a>
    `;
  }
}
