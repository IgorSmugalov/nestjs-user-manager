import { UseGuards, applyDecorators } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';

export function UseJwtAuthGuard() {
  return applyDecorators(UseGuards(JWTAuthGuard));
}
