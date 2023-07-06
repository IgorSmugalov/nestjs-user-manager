import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

export enum AuthExceptionMessages {
  unauthorizedDefaultMessage = 'Пользователь не авторизован',
  forbiddenDefaultMessage = 'Доступ запрещён',
  incorrectCredentials = 'Неверный логин или пароль',
  userUnactivatedOrBlocked = 'Пользователь не активирован или заблокирован',
  userAlreadyAuthorized = 'Пользователь уже авторизован',
  userNotActivated = 'Пользователь не активирован',
}

export class IncorrectCredentialsException extends UnauthorizedException {
  constructor() {
    super(AuthExceptionMessages.incorrectCredentials);
  }
}

export class UserUnauthorizedException extends UnauthorizedException {
  constructor() {
    super(AuthExceptionMessages.unauthorizedDefaultMessage);
  }
}

export class UserAlreadyAuthorizedException extends ForbiddenException {
  constructor() {
    super(AuthExceptionMessages.userAlreadyAuthorized);
  }
}

export class AccessForbiddenException extends ForbiddenException {
  constructor() {
    super(AuthExceptionMessages.forbiddenDefaultMessage);
  }
}

export class UserNotActivatedException extends ForbiddenException {
  constructor() {
    super(AuthExceptionMessages.userNotActivated);
  }
}
