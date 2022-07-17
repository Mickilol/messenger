import { Block } from 'core';
import { PageUrl } from 'utils/urls';

import '../error.scss';

interface IProps {
  code?: string;
}

export class Error500 extends Block {
  constructor({ code = '500' }: IProps) {
    super({ code });
  }

  render() {
    return `
      <main class="error-page__wrapper">
        <h1 class="error-page__code">{{code}}</h1>
        <span class="error-page__text">Мы уже фиксим</span>
        {{{Link href="${PageUrl.CHATS}" text="Назад к чатам" }}}
      </main>
    `;
  }
}