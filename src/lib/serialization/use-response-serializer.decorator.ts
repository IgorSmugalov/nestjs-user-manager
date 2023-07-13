import {
  applyDecorators,
  ClassSerializerInterceptor,
  NestInterceptor,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { Class } from 'type-fest';

export const UseResponseSerializer = (
  classType: ClassConstructor<any>,
  inrerceptors: Class<NestInterceptor>[] = [],
): MethodDecorator & ClassDecorator =>
  applyDecorators(
    SerializeOptions({
      strategy: 'excludeAll',
      excludeExtraneousValues: true,
      type: classType,
    }),
    UseInterceptors(ClassSerializerInterceptor, ...inrerceptors),
  );
