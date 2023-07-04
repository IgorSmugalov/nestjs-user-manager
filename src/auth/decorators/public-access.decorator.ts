import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { UseGuards, applyDecorators } from '@nestjs/common';
import { UserAlreadyAuthorizedException } from '../auth.exceptions';
import { OnlyUnauthorizedGuard } from '../guards/only-unauthorized.guard';

export function OnlyPublicAccess() {
  return applyDecorators(
    UseGuards(OnlyUnauthorizedGuard),
    ApiException(() => UserAlreadyAuthorizedException),
  );
}
