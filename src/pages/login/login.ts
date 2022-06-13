import { Field } from '../../components';
import Block from '../../core/Block';
import { ValidationRule } from '../../utils/validator';

import './login.scss';

interface IProps { }

interface IState { }

interface IRefs {
  login: Field;
  password: Field;
}

export class Login extends Block<IProps, IState, IRefs> {
  constructor(props: IProps) {
    super(props);

    this.setProps({
      handleButtonClick: this.handleButtonClick
    });
  }

  private get refsKeys(): Array<keyof IRefs> {
    return Object.keys(this.refs) as Array<keyof IRefs>;
  }

  private isFormInvalid = (): boolean => {
    this.refsKeys.forEach(key => {
      this.refs[key].validate();
    });

    return this.refsKeys.some(key => this.refs[key].getError());
  };

  private handleButtonClick = () => {
    if (this.isFormInvalid()) {
      return;
    }

    const values: Record<keyof IRefs, string> = this.refsKeys.reduce((acc, key: keyof IRefs) => {
      acc[key] = this.refs[key].getValue();

      return acc;
    }, {} as Record<keyof IRefs, string>);

    console.log(values);
  };

  render() {
    return `
      <main class="login__wrapper">
        <div class="login__card">
          <h1 class="login__title">
            Вход
          </h1>
      
          <form name="loginForm" class="login__form">
            {{{Field type="text" name="login" label="Логин" validationRule="${ValidationRule.LOGIN}" ref="login"}}}

            {{{Field type="password" name="password" label="Пароль" validationRule="${ValidationRule.PASSWORD}" ref="password"}}}

            <div class="login__actions">
              {{{Button type="submit" text="Авторизоваться" onClick=handleButtonClick }}}
      
              {{{Link href="./register" text="Нет аккаунта?" }}}
            </div>
          </form>
        </div>
      </main>
    `;
  }
}