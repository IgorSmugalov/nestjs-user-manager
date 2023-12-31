import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  applyDecorators,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';

const exceptionFactory = (err: ValidationError[]) => {
  const errorMessages = err.map((error) => {
    return new ExceptionMessage({
      error: Object.values(error.constraints).join(', '),
      field: error.property || null,
      value: error.value || null,
    });
  });
  throw new ValidationException(errorMessages);
};

export const UseRequestValidation = (): MethodDecorator & ClassDecorator =>
  applyDecorators(
    UsePipes(
      new ValidationPipe({
        exceptionFactory,
        transform: true,
        whitelist: true,
        validateCustomDecorators: true,
        stopAtFirstError: true,
        transformOptions: { exposeUnsetFields: false },
      }),
    ),
    ApiException(() => ValidationException, {
      messageSchema: { $ref: getSchemaPath(ExceptionMessage) },
      type: () => ExceptionMessage,
      isArray: true,
    }),
    ApiExtraModels(ExceptionMessage),
  );

export class ExceptionMessage implements IExceptionMessage {
  constructor(exception: IExceptionMessage) {
    Object.assign(this, exception);
  }
  @ApiProperty()
  value: any;
  @ApiProperty()
  field: string;
  @ApiProperty()
  error: string;
}

export interface IExceptionMessage {
  field: string;
  error: string;
  value: any;
}

export class ValidationException extends BadRequestException {
  constructor(errors: ExceptionMessage[]) {
    super(errors);
  }
}

// TODO: Update validation
