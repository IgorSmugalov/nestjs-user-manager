import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

enum PermissionExceptions {
  forbiddenDefaultMessage = 'Access denied',
  UserNotAuthenticatedMessage = 'User not authenticated',
}

export class AccessForbiddenException extends ForbiddenException {
  constructor() {
    super(PermissionExceptions.forbiddenDefaultMessage);
  }
}

export class UserNotAuthenticatedException extends UnauthorizedException {
  constructor() {
    super(PermissionExceptions.UserNotAuthenticatedMessage);
  }
}
