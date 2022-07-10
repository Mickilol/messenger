import Block from '../../core/Block';
import { AvatarChangeModal as AvatarChangeModalType } from '../../store/types';
import './avatarChangeModal.scss';

interface IProps {
  modalData: AvatarChangeModalType;
  onClose: () => void;
  onChange: (file: File) => void;
  onSave: () => void;
}

export class AvatarChangeModal extends Block<IProps> {
  static componentName = 'AvatarChangeModal';

  render() {
    return `
      {{#Modal 
        isOpen=modalData.isOpen 
        onClose=onClose
        title=modalData.title
        titleClasses="${this.props.modalData.error ? 'avatar-modal__title_error' : ''}"
      }}
        <div class="avatar-modal__content-wrapper">
          {{{Field 
            type="file"
            name="avatar"
            accept="image/*"
            label="Выбрать файл на компьютере"
            value="${this.props.modalData.file?.name ?? ''}"
            onChange=onChange
          }}}

          {{{Button text="Поменять" onClick=onSave classes="avatar-modal__button" isLoading=modalData.isLoading }}}
          {{{Error text=modalData.error }}}
        </div>
      {{/Modal}}
    `;
  }
}