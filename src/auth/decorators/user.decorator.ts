import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AccessJwtClaimsDTO } from '../dto/jwt-claims-access.dto';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AccessJwtClaimsDTO => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
