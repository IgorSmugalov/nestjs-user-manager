import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export enum UserExceptionMessages {
  userAlreadyExistst = 'Пользователь с таким email уже существует',
}

export class UserCreationException extends InternalServerErrorException {
  constructor() {
    super('Server error');
  }
}

export class UserAlreadyExiststException extends BadRequestException {
  constructor() {
    super(UserExceptionMessages.userAlreadyExistst);
  }
}
