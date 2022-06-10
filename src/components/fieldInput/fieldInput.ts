import { Block } from '../../core';
import './fieldInput.scss';

interface IProps {
  type: string;
  name: string;
  initialValue?: string;
  disabled?: boolean;
  onInput?: (e: Event) => void;
  onFocus?: (e: Event) => void;
  onBlur?: (e: Event) => void;
}

export class FieldInput extends Block {
  static componentName = 'FieldInput';

  constructor({ onInput, onFocus, onBlur, ...props }: IProps) {
    super({
      ...props,
      events: {
        input: onInput,
        focus: onFocus,
        blur: onBlur
      }
    });
  }

  public getValue = (): string => {
    const input = this.element as HTMLInputElement;
    return input.value;
  };

  protected render() {
    return `
      <input 
        type="{{type}}"
        name="{{name}}"
        placeholder="placeholder"
        class="field__input"
        value="{{initialValue}}"
        {{#if disabled}}disabled{{/if}}
      >
    `;
  }
}
