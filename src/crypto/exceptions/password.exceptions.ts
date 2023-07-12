import { BadRequestException } from '@nestjs/common';

export class IncorrectPasswordException extends BadRequestException {
  constructor() {
    super('Неверный пароль');
  }
}
