import { Field } from 'components';
import Block from 'core/Block';
import { PageUrl } from 'utils/urls';
import { ValidationRule } from 'utils/validator';
import authService from 'services/auth';
import { connect } from 'core/connect';
import { AppState } from 'store/types';

import './login.scss';

interface IOwnProps {
  handleButtonClick: (e: SubmitEvent) => void;
}

interface IStateToProps {
  loginError?: string;
  isLoading: boolean;
}

type IProps = IOwnProps & IStateToProps;

interface IState {
  values: Record<keyof IRefs, string>;
}

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

  protected getStateFromProps(): void {
    this.state = {
      values: {
        login: '',
        password: ''
      }
    };
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

  private handleButtonClick = (e: SubmitEvent) => {
    e.preventDefault();

    if (this.isFormInvalid()) {
      return;
    }

    const values: Record<keyof IRefs, string> = this.refsKeys.reduce((acc, key: keyof IRefs) => {
      acc[key] = this.refs[key].getValue();

      return acc;
    }, {} as Record<keyof IRefs, string>);

    this.setState({ values });

    authService.login(values);
  };

  render() {
    return `
      <main class="login__wrapper">
        <div class="login__card">
          <h1 class="login__title">
            Вход
          </h1>
      
          <form name="loginForm" class="login__form">
            {{{Field 
              type="text"
              name="login"
              value=values.login
              label="Логин"
              validationRule="${ValidationRule.LOGIN}"
              ref="login"
            }}}

            {{{Field
              type="password"
              name="password"
              value=values.password
              label="Пароль"
              validationRule="${ValidationRule.PASSWORD}"
              ref="password"
            }}}

            <div class="login__actions">
              {{{Button text="Авторизоваться" onClick=handleButtonClick isLoading=isLoading }}}
              {{{Error text=loginError }}}
      
              {{{Link href="${PageUrl.REGISTER}" text="Нет аккаунта?" }}}
            </div>
          </form>
        </div>
      </main>
    `;
  }
}

export default connect(Login, ({ loginError, isLoading }: AppState): IStateToProps => ({ loginError, isLoading }));