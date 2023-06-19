import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RefreshJwtClaimsDTO } from '../dto/refresh-jwt-claims.dto';

export const RefreshedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RefreshJwtClaimsDTO => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request.refreshedUser;
  },
);
