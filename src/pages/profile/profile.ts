import { Field } from '../../components';
import { ButtonStyle, ButtonType } from '../../components/button/button';
import Block from '../../core/Block';
import { ValidationRule } from '../../utils/validator';

import './profile.scss';

interface IProps {
  viewMode?: boolean;
  passwordChangeMode?: boolean;
  user?: object;

  handleSave?: () => void;
  handelDataChangeBtnClick?: () => void;
  handlePasswordChangeBtnClick?: () => void;
}

interface IRefs {
  email: Field;
  login: Field;
  first_name: Field;
  second_name: Field;
  display_name: Field;
  phone: Field;

  old_password: Field;
  password: Field;
  password_repeat: Field;
}

type RefsKeys = Array<Partial<keyof IRefs>>;

const PASSWORD_CHANGE_MODE_KEYS_REFS: RefsKeys = [
  'old_password', 'password', 'password_repeat'
];

export class Profile extends Block<IProps, null, IRefs> {
  constructor({ viewMode = true, passwordChangeMode, user }: IProps) {
    super({
      viewMode,
      passwordChangeMode,
      user,
    });

    this.setProps({
      handelDataChangeBtnClick: this.handelDataChangeBtnClick,
      handlePasswordChangeBtnClick: this.handlePasswordChangeBtnClick,
      handleSave: this.handleSave,
    });
  }

  private handelDataChangeBtnClick = () => {
    this.setProps({ viewMode: false });
  };

  private handlePasswordChangeBtnClick = () => {
    this.setProps({ viewMode: false, passwordChangeMode: true });
  };

  private get refsKeys(): RefsKeys {
    if (this.props.passwordChangeMode) {
      return PASSWORD_CHANGE_MODE_KEYS_REFS;
    }

    const keys = Object.keys(this.refs) as RefsKeys;
    return keys.filter((key: keyof IRefs) => !PASSWORD_CHANGE_MODE_KEYS_REFS.includes(key));
  }

  private isFormInvalid = (): boolean => {
    this.refsKeys.forEach(key => {
      this.refs[key].validate();
    });

    let hasErrors = this.refsKeys.some(key => this.refs[key].getError());

    if (this.props.passwordChangeMode && this.refs.password.getValue() !== this.refs.password_repeat.getValue()) {
      hasErrors = true;
      this.refs.password_repeat.showError('Пароли не совпадают');
    }

    return hasErrors;
  };

  private handleSave = () => {
    if (this.isFormInvalid()) {
      return;
    }

    const values: Record<Partial<keyof IRefs>, string> = this.refsKeys.reduce((acc, key: keyof IRefs) => {
      acc[key] = this.refs[key].getValue();

      return acc;
    }, {} as Record<Partial<keyof IRefs>, string>);

    console.log(values);
  };

  render() {
    return `
      <main class="profile__wrapper">
        <a href="./chats.hbs" class="profile__back-link">
          <span class="profile__back-icon">
            <i class="fa-solid fa-arrow-left"></i>
          </span>
        </a>
      
        <div class="profile__content">
          <div class="profile__avatar">
            <i class="fa-solid fa-image fa-3x"></i>
          </div>
          <span class="profile__name">{{user.display_name}}</span>
      
          <form class="profile__data-form" id="profileForm">
          {{#if passwordChangeMode}}
            {{{Field 
              type="password"
              name="old_password"
              label="Старый пароль"
              validationRule="${ValidationRule.PASSWORD}"
              ref="old_password"
            }}}

            {{{Field 
              type="password"
              name="password"
              label="Новый пароль"
              validationRule="${ValidationRule.PASSWORD}"
              ref="password"
            }}}
      
            {{{Field 
              type="password" 
              name="password_repeat"
              label="Повторите пароль"
              validationRule="${ValidationRule.PASSWORD}"
              ref="password_repeat"
            }}}
          {{else}}
            {{{Field 
              type="email"
              name="email"
              initialValue=user.email
              label="Почта"
              disabled=${!!this.props.viewMode}
              validationRule="${ValidationRule.EMAIL}"
              ref="email"
            }}}
      
            {{{Field 
              type="text"
              name="login"
              initialValue=user.login
              label="Логин"
              disabled=${!!this.props.viewMode}
              validationRule="${ValidationRule.LOGIN}"
              ref="login"
            }}}
      
            {{{Field 
              type="text"
              name="first_name"
              initialValue=user.first_name
              label="Имя"
              disabled=${!!this.props.viewMode}
              validationRule="${ValidationRule.NAME}"
              ref="first_name"
            }}}
      
            {{{Field 
              type="text"
              name="second_name"
              initialValue=user.second_name
              label="Фамилия"
              disabled=${!!this.props.viewMode}
              validationRule="${ValidationRule.NAME}"
              ref="second_name"
            }}}
      
            {{{Field 
              type="text" 
              name="display_name"
              initialValue=user.display_name
              label="Имя в чате"
              disabled=${!!this.props.viewMode}
              validationRule="${ValidationRule.NAME}"
              ref="display_name"
            }}}
      
            {{{Field 
              type="tel"
              name="phone"
              initialValue=user.phone
              label="Телефон"
              disabled=${!!this.props.viewMode}
              validationRule="${ValidationRule.PHONE}"
              ref="phone"
            }}}
          {{/if}}
          </form>
      
          <div class="profile__actions">
            {{#if viewMode}}
              {{{Button 
                text="Изменить данные"
                classes="profile__action"
                spanType="${ButtonType.SPAN}"
                onClick=handelDataChangeBtnClick 
              }}}

              {{{Button 
                text="Изменить пароль"
                classes="profile__action"
                spanType="${ButtonType.SPAN}"
                onClick=handlePasswordChangeBtnClick 
              }}}

              {{{Button 
                text="Выйти"
                classes="profile__action"
                spanType="${ButtonType.SPAN}"
                style="${ButtonStyle.DANGER}"
               }}}
            {{else}}
              {{{Button text="Сохранить" onClick=handleSave }}}
            {{/if}}
          </div>
        </div>
      </main>
    `;
  }
}