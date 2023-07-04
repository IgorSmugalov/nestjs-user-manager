import { UseGuards, applyDecorators } from '@nestjs/common';
import { RefreshJwtGuard } from '../guards/refresh-jwt.guard';
import { UserUnauthorizedException } from '../auth.exceptions';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

export function RefreshedAccess() {
  return applyDecorators(
    UseGuards(RefreshJwtGuard),
    ApiException(() => UserUnauthorizedException),
  );
}
