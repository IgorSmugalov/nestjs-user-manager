import { UseGuards, applyDecorators } from '@nestjs/common';
import { AccessJwtGuard } from 'src/auth/guards/access-jwt.guard';

export function UseAccessJwtGuard() {
  return applyDecorators(UseGuards(AccessJwtGuard));
}
