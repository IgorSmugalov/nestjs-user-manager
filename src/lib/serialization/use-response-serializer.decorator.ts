import {
  applyDecorators,
  ClassSerializerInterceptor,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';

export const UseResponseSerializer = (
  classType: ClassConstructor<any>,
): MethodDecorator & ClassDecorator =>
  applyDecorators(
    SerializeOptions({
      strategy: 'excludeAll',
      excludeExtraneousValues: true,
      type: classType,
    }),
    UseInterceptors(ClassSerializerInterceptor),
  );
