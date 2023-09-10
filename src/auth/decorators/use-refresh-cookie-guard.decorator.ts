import { UseGuards, applyDecorators } from '@nestjs/common';
import { RefreshCookieGuard } from '../guards/refresh-cookie.guard';
import { UserUnauthorizedException } from '../auth.exceptions';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { ApiCookieAuth } from '@nestjs/swagger';

export function UseRefreshCookieGuard() {
  return applyDecorators(
    UseGuards(RefreshCookieGuard),
    ApiCookieAuth('refresh'),
    ApiException(() => UserUnauthorizedException),
  );
}
