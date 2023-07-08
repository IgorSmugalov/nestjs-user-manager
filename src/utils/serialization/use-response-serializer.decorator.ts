import {
  applyDecorators,
  ClassSerializerInterceptor,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { ClassConstructor, TransformPlainToInstance } from 'class-transformer';

export const UseResponseSerializer = (
  classType: ClassConstructor<any>,
): MethodDecorator & ClassDecorator =>
  applyDecorators(
    TransformPlainToInstance(classType),
    SerializeOptions({
      strategy: 'excludeAll',
      excludeExtraneousValues: true,
    }),
    UseInterceptors(ClassSerializerInterceptor),
  );
