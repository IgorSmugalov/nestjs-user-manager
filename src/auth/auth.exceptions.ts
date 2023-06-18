import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

export enum AuthExceptionMessages {
  unauthorizedDefaultMessage = 'Пользователь не авторизован',
  forbiddenDefaultMessage = 'Доступ запрещён',
  incorrectCredentials = 'Неверный логин или пароль',
  userUnactivatedOrBlocked = 'Пользователь не активирован или заблокирован',
  userAlreadyExistst = 'Пользователь с таким email уже существует',
}

export class UserAlreadyExiststException extends BadRequestException {
  constructor() {
    super(AuthExceptionMessages.userAlreadyExistst);
  }
}

export class IncorrectCredentials extends UnauthorizedException {
  constructor() {
    super(AuthExceptionMessages.incorrectCredentials);
  }
}

export class AccessForbiddenException extends ForbiddenException {
  constructor() {
    super(AuthExceptionMessages.forbiddenDefaultMessage);
  }
}
