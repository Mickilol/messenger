import { Block } from '../../core';
import { validate, ValidationRule } from '../../utils/validator';
import FieldError from '../fieldError';
import FieldInput from '../fieldInput';
import './field.scss';

interface IProps {
  type: string;
  name: string;
  label: string;
  initialValue?: string;
  disabled?: boolean;
  validationRule?: ValidationRule;

  onBlur?: (e: Event) => void;
  onInput?: (e: InputEvent) => void;
}

interface IRefs {
  error: FieldError;
  input: FieldInput;
}

export class Field extends Block<IProps, null, IRefs> {
  static componentName = 'Field';

  constructor(props: IProps) {
    super({
      ...props,
    });

    this.setProps({
      onBlur: this.handleBlur,
      onInput: this.handleInput
    });
  }

  private handleBlur = () => {
    this._validate();
  };

  private handleInput = () => {
    this.refs.error.setProps({ message: '' });
  };

  private _validate = () => {
    if (this.props.validationRule) {
      const message = validate(this.props.validationRule, this.refs.input.getValue());

      this.refs.error.setProps({ message });
    }
  };

  public validate = () => {
    this._validate();
  };

  public getError = (): string => {
    return this.refs.error.getErrorMessage();
  };

  public showError = (message: string) => {
    this.refs.error.setProps({ message });
  };

  public getValue = (): string => {
    return this.refs.input.getValue();
  };

  protected render() {
    return `
      <div class="field__wrapper">
        {{{FieldInput 
          type=type
          name=name
          initialValue=initialValue
          disabled=disabled
          onInput=onInput
          onBlur=onBlur
          ref="input"
        }}}
        <label class="field__label  {{#if disabled}}field__label_disabled{{/if}}">{{label}}</label>
        {{{FieldError ref="error"}}}
      </div>
    `;
  }
}
