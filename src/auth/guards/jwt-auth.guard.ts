import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user }: Request = context.switchToHttp().getRequest();
    if (user) return true;
    throw new UnauthorizedException(); //TODO: Rework exception
  }
}
