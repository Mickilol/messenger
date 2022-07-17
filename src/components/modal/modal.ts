import Block from 'core/Block';

import './modal.scss';

interface IProps {
  title: string;
  isOpen: boolean;
  titleClasses?: string;
  onClose: () => void;

  events: {
    click: (e: Event) => void;
  }
}

export class Modal extends Block<IProps> {
  static componentName = 'Modal';

  constructor(props: IProps) {
    super(props);

    this.setProps({
      events: {
        click: this.handleClick
      }
    });
  }

  handleClick = (event: Event) => {
    if (event.target === this.element) {
      this.props.onClose();
    }
  };

  render() {
    return `
      <div class="modal__overflow" style="${this.props.isOpen ? 'display: flex;' : 'display: none;'}">
        <div class="modal__wrapper">
          <h2 class="modal__title {{titleClasses}}">{{title}}</h2>
          <div data-layout=1 class="modal__content"></div>
        </div>
      </div>
    `;
  }
}