import { Block } from 'core';
import { validate, ValidationRule } from 'utils/validator';
import FieldError from '../fieldError';
import FieldInput from '../fieldInput';
import './field.scss';

interface IProps {
  type: string;
  name: string;
  label: string;
  value?: string;
  disabled?: boolean;
  accept?: string;
  validationRule?: ValidationRule;
  dataTestId?: string;

  onBlur?: (e: Event) => void;
  onInput?: (e: Event) => void;
  onChange?: (value: unknown) => void;
}

interface IState {}

interface IRefs {
  error?: FieldError;
  input: FieldInput;
}

export class Field extends Block<IProps, IState, IRefs> {
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

  private handleInput = (e: Event) => {
    if (this.props.type === 'file' && this.props.onChange) {
      const input = e.target as HTMLInputElement;

      this.props.onChange(input.files?.[0]);
    }
    
    this.refs.error?.setProps({ message: '' });
  };

  private _validate = () => {
    if (this.props.validationRule) {
      const message = validate(this.props.validationRule, this.refs.input.getValue());

      this.refs.error?.setProps({ message });
    }
  };

  public validate = () => {
    this._validate();
  };

  public getError = (): string => {
    return this.refs.error?.getErrorMessage() || '';
  };

  public showError = (message: string) => {
    this.refs.error?.setProps({ message });
  };

  public getValue = (): string => {
    return this.refs.input.getValue();
  };

  protected render() {
    if (this.props.type === 'file') {
      return `
        <div>
          {{#if value}}
            <span class="file-field__name">{{value}}</span>
          {{else}}
            <label for="{{name}}" class="file-field__label">{{label}}</label>
          {{/if}}

          {{{FieldInput 
            type="file"
            name=name
            initialValue=value
            accept=accept
            disabled=disabled
            onInput=onInput
            ref="input"
          }}}
        </div>
      `;
    }

    return `
      <div class="field__wrapper" {{#if dataTestId}}data-testid="{{dataTestId}}"{{/if}}>
        {{{FieldInput 
          type=type
          name=name
          initialValue=value
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
