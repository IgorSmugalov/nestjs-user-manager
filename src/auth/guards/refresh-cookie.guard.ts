import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserUnauthorizedException } from '../auth.exceptions';

@Injectable()
export class RefreshCookieGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { refreshedUser }: Request = context.switchToHttp().getRequest();
    if (refreshedUser) return true;
    throw new UserUnauthorizedException();
  }
}
