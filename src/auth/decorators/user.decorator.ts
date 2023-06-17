import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AccessJwtPayloadDTO } from '../dto/access-jwt-payload.dto';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AccessJwtPayloadDTO => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
