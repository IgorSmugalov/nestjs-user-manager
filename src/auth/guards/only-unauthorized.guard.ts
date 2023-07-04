import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserAlreadyAuthorizedException } from '../auth.exceptions';

@Injectable()
export class OnlyUnauthorizedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { refreshedUser, user }: Request = context
      .switchToHttp()
      .getRequest();
    if (refreshedUser || user) throw new UserAlreadyAuthorizedException();
    return true;
  }
}
