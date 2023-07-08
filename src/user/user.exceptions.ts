import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export enum UserExceptionMessages {
  userUnknownErrorException = 'Неизвестная ошибка',
  userAlreadyExistst = 'Пользователь уже существует',
  userDoesNotExistst = 'Пользователь не существует',
  activationKeyNotValid = 'Ключ активации не валиден',
  userAlreadyActivated = 'Пользователь уже активирован',
  passwordRecoveryKeyNotValid = 'Ключ восстановления пароля не валиден',
}

export class UserUnknownErrorException extends InternalServerErrorException {
  constructor() {
    super(UserExceptionMessages.userUnknownErrorException);
  }
}

export class UserAlreadyExistsException extends BadRequestException {
  constructor() {
    super(UserExceptionMessages.userAlreadyExistst);
  }
}

export class UserDoesNotExistsException extends BadRequestException {
  constructor() {
    super(UserExceptionMessages.userDoesNotExistst);
  }
}

export class ActivationKeyNotValidException extends BadRequestException {
  constructor() {
    super(UserExceptionMessages.activationKeyNotValid);
  }
}

export class UserAlreadyActivatedException extends BadRequestException {
  constructor() {
    super(UserExceptionMessages.userAlreadyActivated);
  }
}

export class PasswordRecoveryKeyNotValidException extends BadRequestException {
  constructor() {
    super(UserExceptionMessages.passwordRecoveryKeyNotValid);
  }
}
