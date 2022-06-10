export enum ValidationRule {
  LOGIN = 'LOGIN',
  PASSWORD = 'PASSWORD',
  EMAIL = 'EMAIL',
  NAME = 'NAME',
  PHONE = 'PHONE',
  MESSAGE = 'MESSAGE'
}

export function validate(rule: ValidationRule, value: string = ''): string {
  switch (rule) {
    case ValidationRule.LOGIN: {
      const correct = new RegExp('^(?=.*\\D)[-\\w]{3,20}$', 'g').test(value);

      return !correct ? 'Некорректный логин' : '';
    }

    case ValidationRule.PASSWORD: {
      const correct = new RegExp('^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,40}$', 'g').test(value);

      return !correct ? 'Некорректный пароль' : '';
    }

    case ValidationRule.EMAIL: {
      const correct = new RegExp('^[\\w-]{1,}[@]{1}[a-zA-Z]{1,}[.]{1}[a-zA-Z]{0,}$', 'g').test(value);

      return !correct ? 'Некорректный email' : '';
    }

    case ValidationRule.NAME: {
      const correct = new RegExp('^[A-ZА-Я]{1}[a-zA-Zа-яА-Я-]{1,}$').test(value);

      return !correct ? 'Некорректное значение' : '';
    }

    case ValidationRule.PHONE: {
      const correct = new RegExp('^[+]{0,1}[\\d]{10,15}$').test(value);

      return !correct ? 'Некорректный телефон' : '';
    }

    case ValidationRule.MESSAGE: {
      return !value.length ? 'Сообщение не может быть пустым' : '';
    }

    default: 
      return '';
  }
}