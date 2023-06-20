import {
  applyDecorators,
  ClassSerializerInterceptor,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';

export const UseResponseSerializer = (): MethodDecorator & ClassDecorator =>
  applyDecorators(
    SerializeOptions({
      excludeExtraneousValues: true,
      strategy: 'excludeAll',
    }),
    UseInterceptors(ClassSerializerInterceptor),
  );
