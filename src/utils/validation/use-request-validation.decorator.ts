import { applyDecorators, UsePipes, ValidationPipe } from '@nestjs/common';

export const UseRequestValidation = (): MethodDecorator & ClassDecorator =>
  applyDecorators(
    UsePipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        validateCustomDecorators: true,
        stopAtFirstError: true,
      }),
    ),
  );
