import { Block } from '../../core';
import './fieldError.scss';

interface IProps {
  message: string;
}

export class FieldError extends Block {
  static componentName = 'FieldError';

  constructor(props: IProps) {
    super({ ...props });
  }

  public getErrorMessage = (): string => {
    return this.props.message;
  };

  protected render() {
    return `
      <span class="field__error">{{message}}</span>
    `;
  }
}
