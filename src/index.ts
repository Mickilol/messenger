import { renderDOM, registerComponent, BlockConstructable } from './core';
import Login from './pages/login';
import Register from './pages/register';
import Error404 from './pages/errors/404';
import Error500 from './pages/errors/500';
import Profile from './pages/profile';
import Chats from './pages/chats';

import './styles/app.scss';
import * as components from './components';

Object.values(components).forEach((component: BlockConstructable) => {
  registerComponent(component);
});

document.addEventListener('DOMContentLoaded', () => {
  // renderDOM(new Login({}));
  // renderDOM(new Register({}));
  // renderDOM(new Error404({}));
  // renderDOM(new Profile({}));
  renderDOM(new Chats({}));
});
