import { renderDOM, registerComponent, Router } from 'core';
import * as components from 'components';
import { AppState } from 'store/types';
import { Store } from 'core/Store';
import { BlockConstructable } from 'core/Block';
import { defaultState } from 'store';
import { initRouter } from '../initRouter';
import { sleep } from 'utils/sleep';

type RenderBlockParams<T> = {
  Block: BlockConstructable<T>;
  props: T;
  state?: Partial<AppState>;
};

export async function renderBlock<T extends Object>({ Block, props, state = defaultState }: RenderBlockParams<T>) {
  Object.values(components).forEach((Component: any) => {
    registerComponent(Component);
  });

  const store = new Store<AppState>({ ...defaultState, ...state });
  const router = new Router();

  window.router = router;
  window.store = store;

  document.body.innerHTML = '<div id="app"></div>';

  renderDOM(new Block(props as T));

  initRouter(router, store);

  await sleep();
}

export async function step(callback: () => void) {
  await callback();
}
