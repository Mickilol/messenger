import { registerComponent, Router } from './core';
import { BlockConstructable } from './core/Block';

import './styles/app.scss';
import * as components from './components';
import { Store } from './core/Store';
import { AppState } from './store/types';
import { defaultState } from './store';
import { hasError as apiHasError } from './utils/apiHasError';
import { AuthAPI } from './api/auth-api';
import { initRouter } from './initRouter';

declare global {
  interface Window {
    store: Store<AppState>;
    router: Router;
  }
}

Object.values(components).forEach((component: BlockConstructable) => {
  registerComponent(component);
});

const authAPI = new AuthAPI();

document.addEventListener('DOMContentLoaded', async () => {
  const store = new Store<AppState>(defaultState);
  const router = new Router();

  window.router = router;
  window.store = store;

  initRouter(router, store);

  try {
    const response = await authAPI.getUser();

    if (apiHasError(response)) {
      return;
    }

    store.set({ user: response });
  } catch (err) {
    console.error(err);
  } finally {
    router.start();
  }
});
