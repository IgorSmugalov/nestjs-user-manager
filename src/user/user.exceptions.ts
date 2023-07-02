import { BadRequestException } from '@nestjs/common';

export enum UserExceptionMessages {
  userAlreadyExistst = 'Пользователь уже существует',
  userDoesNotExistst = 'Пользователь не существует',
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
