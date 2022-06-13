import { Block } from '../../../core';

import '../error.scss';

export class Error404 extends Block {
  render() {
    return `
      <main class="error-page__wrapper">
        <h1 class="error-page__code">404</h1>
        <span class="error-page__text">Не туда попали</span>
        {{{Link href="./chats" text="Назад к чатам" }}}
      </main>
    `;
  }
}