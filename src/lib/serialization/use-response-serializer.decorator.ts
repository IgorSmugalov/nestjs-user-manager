import {
  applyDecorators,
  ClassSerializerInterceptor,
  NestInterceptor,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { Class } from 'type-fest';

export const UseResponseSerializer = (
  classConstructor: Class<any>,
  inrerceptors: Class<NestInterceptor>[] = [],
): MethodDecorator =>
  applyDecorators(
    SerializeOptions({
      strategy: 'excludeAll',
      excludeExtraneousValues: true,
      type: classConstructor,
    }),
    UseInterceptors(ClassSerializerInterceptor, ...inrerceptors),
  );
