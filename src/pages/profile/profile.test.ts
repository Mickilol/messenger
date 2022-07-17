import { getByTestId } from '@testing-library/dom';
import Profile from './profile';
import { renderBlock } from '../../tests/renderUtils';
import { UserDTO } from '../../api/types/types';
import { AvatarChangeModal } from '../../store/types';

const USER_MOCK: UserDTO = {
  id: 3094,
  avatar: '/d66cf98f-05dc-49ba-8d2b-c1db0c5888c3/761d694b-39b5-4dee-ab15-78a2bf05461d_12.png',
  display_name: 'Джон дое',
  email: 'johndoe2@johndoe2.johndoe2',
  first_name: 'Джон',
  second_name: 'Дое',
  login: 'johndoe2',
  phone: '89137909090',
};

const AVATAR_CHANGE_MODAL_MOCK: AvatarChangeModal = {
  error: '',
  file: null,
  isLoading: false,
  isOpen: false,
  title: ''
};

describe('pages/profile', () => {
  it('should render change data button when isView mode is on', () => {
    renderBlock({
      Block: Profile,
      props: {
        user: USER_MOCK,
        isLoading: false,
        isPasswordChangeMode: false,
        isViewMode: true,
        avatarChangeModal: AVATAR_CHANGE_MODAL_MOCK
      },
    });

    expect(getByTestId(document.body, 'change-data-btn')).toBeInTheDocument();
  });

  it('should render save data button when isView mode is off', async () => {
    renderBlock({
      Block: Profile,
      props: {
        user: USER_MOCK,
        isLoading: false,
        isPasswordChangeMode: false,
        isViewMode: false,
        avatarChangeModal: AVATAR_CHANGE_MODAL_MOCK
      },
      state: {
        user: USER_MOCK,
        isLoading: false,
        avatarChangeModal: AVATAR_CHANGE_MODAL_MOCK,
        profile: {
          isPasswordChangeMode: false,
          isViewMode: false,
        }
      }
    });

    expect(getByTestId(document.body, 'save-btn')).toBeInTheDocument();
  });

  it('should render password change inputs when isPasswordChange mode', () => {
    renderBlock({
      Block: Profile,
      props: {
        user: USER_MOCK,
        isLoading: false,
        isPasswordChangeMode: true,
        isViewMode: false,
        avatarChangeModal: AVATAR_CHANGE_MODAL_MOCK, 
      },
      state: {
        user: USER_MOCK,
        isLoading: false,
        avatarChangeModal: AVATAR_CHANGE_MODAL_MOCK,
        profile: {
          isPasswordChangeMode: true,
          isViewMode: false,
        }
      }
    });

    expect(getByTestId(document.body, 'old-password-field')).toBeInTheDocument();
    expect(getByTestId(document.body, 'new-password-field')).toBeInTheDocument();
  });
});
