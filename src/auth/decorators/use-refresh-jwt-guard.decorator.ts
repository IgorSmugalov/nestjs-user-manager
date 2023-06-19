import { UseGuards, applyDecorators } from '@nestjs/common';
import { RefreshJwtGuard } from '../guards/refresh-jwt.guard';

export function UseRefreshJwtGuard() {
  return applyDecorators(UseGuards(RefreshJwtGuard));
}
