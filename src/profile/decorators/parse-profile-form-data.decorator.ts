import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarFormDataInterceptor } from '../interceptors/avatar-form-data.interceptor';
import { ApiConsumes } from '@nestjs/swagger';

export function ParseProfileFormData() {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('avatar', {
        limits: { fileSize: 1024 * 1024 * 1 },
      }),
      AvatarFormDataInterceptor,
    ),
    ApiConsumes('multipart/form-data'),
  );
}
