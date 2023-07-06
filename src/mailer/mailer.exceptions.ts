import { InternalServerErrorException } from '@nestjs/common';

enum MailerExceptions {
  emailCanNotBeSent = 'Ошибка при отправке Email',
}

export class EmailCanNotBeSentException extends InternalServerErrorException {
  constructor() {
    super(MailerExceptions.emailCanNotBeSent);
  }
}
