import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export enum UserExceptionMessages {
  userUnknownError = 'Неизвестная ошибка',
  userAlreadyExistst = 'Пользователь уже существует',
  userDoesNotExistst = 'Пользователь не существует',
  emailAlreadyInUse = 'Email уже используется',
  activationKeyNotValid = 'Ключ активации не валиден',
  userAlreadyActivated = 'Пользователь уже активирован',
  passwordRecoveryKeyNotValid = 'Ключ восстановления пароля не валиден',
  KeyExpired = 'Ключ просрочен',
}

export class UserUnknownErrorException extends InternalServerErrorException {
  constructor() {
    super(UserExceptionMessages.userUnknownError);
  }
}

export class UserAlreadyExistsException extends BadRequestException {
  constructor() {
    super(UserExceptionMessages.userAlreadyExistst);
  }
}

export class EmailAlreadyInUseException extends BadRequestException {
  constructor() {
    super(UserExceptionMessages.emailAlreadyInUse);
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

export class KeyExpiredException extends BadRequestException {
  constructor() {
    super(UserExceptionMessages.KeyExpired);
  }
}
