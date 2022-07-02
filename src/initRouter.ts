import { Router } from './core';
import { PageUrl } from './utils/urls';
import Login from './pages/login';
import Register from './pages/register';
import Error404 from './pages/errors/404';
import Error500 from './pages/errors/500';
import Profile from './pages/profile';
import Chats from './pages/chats';
import { AppState } from './store/types';
import { Store } from './core/Store';
import { BlockConstructable } from './core/Block';


const ROUTES: Array<{ path: string, block: BlockConstructable, shouldAuthorized: boolean, shouldUnAuthorized: boolean }> = [
  {
    path: PageUrl.LOGIN,
    block: Login,
    shouldAuthorized: false,
    shouldUnAuthorized: true,
  },
  {
    path: PageUrl.REGISTER,
    block: Register,
    shouldAuthorized: false,
    shouldUnAuthorized: true,
  },
  {
    path: PageUrl.CHATS,
    block: Chats,
    shouldAuthorized: true,
    shouldUnAuthorized: false,
  },
  {
    path: PageUrl.PROFILE,
    block: Profile,
    shouldAuthorized: true,
    shouldUnAuthorized: false,
  },
  {
    path: PageUrl.ERROR,
    block: Error500,
    shouldAuthorized: false,
    shouldUnAuthorized: false,
  },
  {
    path: '*',
    block: Error404,
    shouldAuthorized: false,
    shouldUnAuthorized: false,
  },
];

export const initRouter = (router: Router, store: Store<AppState>) => {
  ROUTES.forEach(route => {
    router.use(route.path, route.block, route.shouldAuthorized, route.shouldUnAuthorized);
  });

  router.setAuthConfig(PageUrl.LOGIN, PageUrl.CHATS, () => Boolean(store.getState().user));
};
