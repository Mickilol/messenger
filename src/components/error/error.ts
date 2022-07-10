import Block from '../../core/Block';

import './error.scss';

interface IProps {
  text: string;
}

export class Error extends Block<IProps> {
  static componentName = 'Error';

  render() {
    return `
      <span class="error">{{text}}</span>
    `;
  }
}