import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarInterceptor } from '../interceptors/avatar.interceptor';
import { ApiConsumes } from '@nestjs/swagger';

export function ParseProfileFormData() {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('avatar', { limits: { fileSize: 1024 * 1024 * 10 } }),
      AvatarInterceptor,
    ),
    ApiConsumes('multipart/form-data'),
  );
}
