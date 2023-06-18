import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AccessForbiddenException } from '../auth.exceptions';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user }: Request = context.switchToHttp().getRequest();
    if (user) return true;
    throw new AccessForbiddenException();
  }
}
