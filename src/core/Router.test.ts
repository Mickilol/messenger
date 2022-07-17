import Block from './Block';
import Router from './Router';

jest.mock('nanoid', () => {
  return { nanoid: () => Math.round(Math.random() * 100) };
});

describe('core/Router', () => {
  it('should update history when going to the new page', () => {
    const router = new Router();

    router.go('login');

    expect(window.history.length).toBe(2);
  });

  it('should redirect to login page when unauthorized', () => {
    const router = new Router();

    class Login extends Block {
      render() {
        return '<div>123</div>';
      }
    }

    class Chats extends Block {
      render() {
        return '<div>123</div>';
      }
    }

    const app = document.createElement('div');

    app.setAttribute('id', 'app');
    document.body.appendChild(app);

    router
      .use('login', Login, false, true)
      .use('messenger', Chats, true, false);

    router.setAuthConfig('login', 'messenger', () => false);
    router.go('messenger');

    expect(window.location.pathname).toBe('/login');
  });
});