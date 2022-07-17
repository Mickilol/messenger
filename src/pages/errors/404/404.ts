import { Block } from 'core';
import { PageUrl } from 'utils/urls';

import '../error.scss';

export class Error404 extends Block {
  render() {
    return `
      <main class="error-page__wrapper">
        <h1 class="error-page__code">404</h1>
        <span class="error-page__text">Не туда попали</span>
        {{{Link href="${PageUrl.CHATS}" text="Назад к чатам" }}}
      </main>
    `;
  }
}