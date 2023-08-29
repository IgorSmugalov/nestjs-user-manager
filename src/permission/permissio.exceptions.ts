import { ForbiddenException } from '@nestjs/common';

enum PermissionExceptions {
  forbiddenDefaultMessage = 'Недостаточно прав доступа',
}

export class AccessForbiddenException extends ForbiddenException {
  constructor() {
    super(PermissionExceptions.forbiddenDefaultMessage);
  }
}
