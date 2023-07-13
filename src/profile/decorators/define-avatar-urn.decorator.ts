import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { DefineAvatarURNInterceptor } from '../interceptors/define-avatar-urn.interceptor';

/**
 * Tranform response: set full path to avatar file
 */
export function SerializeAvatarURNInterceptor() {
  return applyDecorators(UseInterceptors(DefineAvatarURNInterceptor));
}
