import Block from 'core/Block';
import { debounce } from 'utils/mydash/debounce';

import './searchField.scss';

interface IProps {
  value?: string;
  classes?: string;
  onChange?: (value: string) => void;

  events: {
    input: (e: Event) => void;
  }
}

export class SearchField extends Block<IProps> {
  static componentName = 'SearchField';

  constructor(props: IProps) {
    super(props);

    this.setProps({
      events: {
        input: debounce(this.handleInput, 300),
      }
    });
  }

  handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;

    if (this.props.onChange) {
      this.props.onChange(input.value);
    }
  };

  render() {
    return `
      <div class="search-field__wrapper {{classes}}">
        <input type="text" name="search" placeholder="placeholder" class="search-field__input" value="{{value}}">
        <span class="search-field__icon"></span>
        <label class="search-field__label">Поиск</label>
      </div>
    `;
  }
}