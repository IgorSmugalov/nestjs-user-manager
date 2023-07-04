import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { UseGuards, applyDecorators } from '@nestjs/common';
import { AccessJwtGuard } from 'src/auth/guards/access-jwt.guard';
import { UserUnauthorizedException } from '../auth.exceptions';

export function AuthorizedAccess() {
  return applyDecorators(
    UseGuards(AccessJwtGuard),
    ApiException(() => UserUnauthorizedException),
  );
}
