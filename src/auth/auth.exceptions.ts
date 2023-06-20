import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

export enum AuthExceptionMessages {
  unauthorizedDefaultMessage = 'Пользователь не авторизован',
  forbiddenDefaultMessage = 'Доступ запрещён',
  incorrectCredentials = 'Неверный логин или пароль',
  userUnactivatedOrBlocked = 'Пользователь не активирован или заблокирован',
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

export class AccessForbiddenException extends ForbiddenException {
  constructor() {
    super(AuthExceptionMessages.forbiddenDefaultMessage);
  }
}
