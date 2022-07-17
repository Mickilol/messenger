import './profile.scss';

import { Field } from '../../components';
import { ButtonStyle, ButtonType } from '../../components/button/button';
import Block from '../../core/Block';
import { PageUrl } from '../../utils/urls';
import { ValidationRule } from '../../utils/validator';
import { UserDTO } from '../../api/types/types';
import { connect } from '../../core/connect';
import { AppState, AvatarChangeModal } from '../../store/types';
import authService from '../../services/auth';
import profileService from '../../services/profile';
import avatarService from '../../services/avatar';
import { omit } from '../../utils/mydash/omit';

interface IOwnProps {
  handleAvatarChangeBtnClick?: () => void;
  handleAvatarChangeModalClose?: () => void;
  handleAvatarChange?: (file: File) => void;
  handleAvatarSave?: () => void;
  handleSave?: () => void;
  handelDataChangeBtnClick?: () => void;
  handlePasswordChangeBtnClick?: () => void;
  handleLogoutBtnClick?: () => void;
}

interface IStateToProps {
  user: Nullable<UserDTO>;
  isLoading: boolean;
  isViewMode: boolean;
  isPasswordChangeMode: boolean;
  error?: string;
  avatarChangeModal: AvatarChangeModal;
}

type IProps = IOwnProps & IStateToProps;

type IValues = Record<keyof Omit<IRefs, 'old_password' | 'password' | 'password_repeat'>, string>;
type IPasswordChangeValues = Record<keyof Pick<IRefs, 'old_password' | 'password' | 'password_repeat'>, string>;

interface IState {
  values: IValues;
  passwordValues: IPasswordChangeValues;
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

class Profile extends Block<IProps, IState, IRefs> {
  constructor(props: IProps) {
    super(props);

    this.setProps({
      handleAvatarChangeBtnClick: this.handleAvatarChangeBtnClick,
      handleAvatarChangeModalClose: this.handleAvatarChangeModalClose,
      handleAvatarChange: this.handleAvatarChange,
      handleAvatarSave: this.handleAvatarSave,
      handelDataChangeBtnClick: this.handelDataChangeBtnClick,
      handlePasswordChangeBtnClick: this.handlePasswordChangeBtnClick,
      handleLogoutBtnClick: this.handleLogoutBtnClick,
      handleSave: this.handleSave,
    });
  }

  protected getStateFromProps(_props: IProps): void {
    this.state = {
      values: {} as IValues,
      passwordValues: {} as IPasswordChangeValues
    };
  }

  componentWillUnmount(): void {
    profileService.resetData();
  }

  private handleAvatarChangeBtnClick = () => {
    avatarService.openAvatarChangeModal();
  };

  private handleAvatarChangeModalClose = () => {
    avatarService.closeAvatarChangeModal();
  };

  private handleAvatarChange = (file: File) => {
    avatarService.changeAvatar(file);
  };

  private handleAvatarSave = () => {
    avatarService.saveProfileAvatar();
  };

  private handelDataChangeBtnClick = () => {
    if (this.props.user) {
      this.setState({ values: omit(this.props.user, 'id', 'avatar') });
    }

    profileService.changeViewMode(false);
  };

  private handlePasswordChangeBtnClick = () => {
    this.setState({ passwordValues: {} as IPasswordChangeValues });
    profileService.changeViewMode(false);
    profileService.changePasswordChangeMode(true);
  };

  private handleLogoutBtnClick = () => {
    profileService.changeViewMode(true);
    profileService.changePasswordChangeMode(false);
    authService.logout();
  };

  private get refsKeys(): RefsKeys {
    if (this.props.isPasswordChangeMode) {
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

    if (this.props.isPasswordChangeMode && this.refs.password.getValue() !== this.refs.password_repeat.getValue()) {
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

    if (this.props.isPasswordChangeMode) {
      this.setState({ passwordValues: values });
      profileService.savePassword({ oldPassword: values.old_password, newPassword: values.password });
    } else {
      this.setState({ values });
      profileService.saveUser(values);
    }
  };

  render() {
    const { values } = this.state;
    const { isViewMode, user } = this.props;

    return `
      <main class="profile__wrapper">
        {{#Link href="${PageUrl.CHATS}" class="profile__back-link"}}
          <span class="profile__back-icon">
            <i class="fa-solid fa-arrow-left"></i>
          </span>
        {{/Link}}
      
        <div class="profile__content">
          {{{Avatar icon="fa-solid fa-image fa-3x" src=user.avatar classes="profile__avatar" onClick=handleAvatarChangeBtnClick }}}

          {{{AvatarChangeModal 
            modalData=avatarChangeModal
            onClose=handleAvatarChangeModalClose
            onChange=handleAvatarChange
            onSave=handleAvatarSave
          }}}

          <span class="profile__name">{{user.display_name}}</span>
      
          <form class="profile__data-form" id="profileForm">
          {{#if isPasswordChangeMode}}
            {{{Field 
              type="password"
              name="old_password"
              value=passwordValues.old_password
              label="Старый пароль"
              dataTestId="old-password-field"
              validationRule="${ValidationRule.PASSWORD}"
              ref="old_password"
            }}}

            {{{Field 
              type="password"
              name="password"
              value=passwordValues.password
              label="Новый пароль"
              dataTestId="new-password-field"
              validationRule="${ValidationRule.PASSWORD}"
              ref="password"
            }}}
      
            {{{Field 
              type="password" 
              name="password_repeat"
              value=passwordValues.password_repeat
              label="Повторите пароль"
              validationRule="${ValidationRule.PASSWORD}"
              ref="password_repeat"
            }}}
          {{else}}
            {{{Field 
              type="email"
              name="email"
              value="${isViewMode ? user?.email : values.email}"
              label="Почта"
              disabled=${!!isViewMode}
              validationRule="${ValidationRule.EMAIL}"
              ref="email"
            }}}
      
            {{{Field 
              type="text"
              name="login"
              value="${isViewMode ? user?.login : values.login}"
              label="Логин"
              disabled=${!!isViewMode}
              validationRule="${ValidationRule.LOGIN}"
              ref="login"
            }}}
      
            {{{Field 
              type="text"
              name="first_name"
              value="${isViewMode ? user?.first_name : values.first_name}"
              label="Имя"
              disabled=${!!isViewMode}
              validationRule="${ValidationRule.NAME}"
              ref="first_name"
            }}}
      
            {{{Field 
              type="text"
              name="second_name"
              value="${isViewMode ? user?.second_name : values.second_name}"
              label="Фамилия"
              disabled=${!!isViewMode}
              validationRule="${ValidationRule.NAME}"
              ref="second_name"
            }}}
      
            {{{Field 
              type="text" 
              name="display_name"
              value="${isViewMode ? user?.display_name : values.display_name}"
              label="Имя в чате"
              disabled=${!!isViewMode}
              validationRule="${ValidationRule.NAME}"
              ref="display_name"
            }}}
      
            {{{Field 
              type="tel"
              name="phone"
              value="${isViewMode ? user?.phone : values.phone}"
              label="Телефон"
              disabled=${!!isViewMode}
              validationRule="${ValidationRule.PHONE}"
              ref="phone"
            }}}
          {{/if}}
          </form>
      
          <div class="profile__actions">
            {{#if isViewMode}}
              {{{Button 
                text="Изменить данные"
                classes="profile__action"
                spanType="${ButtonType.SPAN}"
                dataTestId="change-data-btn"
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
                onClick=handleLogoutBtnClick 
              }}}
            {{else}}
              {{{Button text="Сохранить" dataTestId="save-btn" onClick=handleSave isLoading=isLoading }}}
              {{{Error text=error }}}
            {{/if}}
          </div>
        </div>
      </main>
    `;
  }
}

export default connect(
  Profile,
  ({ isLoading, user, avatarChangeModal, profile: { isViewMode, isPasswordChangeMode, error } }: AppState): IStateToProps =>
    ({ isLoading, user, isViewMode, isPasswordChangeMode, error, avatarChangeModal })
);