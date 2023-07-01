import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'FileMaxSizeConstraint' })
@Injectable()
export class MaxFileSizeConstraint implements ValidatorConstraintInterface {
  validate(
    image: Express.Multer.File,
    validationArguments?: ValidationArguments,
  ) {
    const [maxSize] = validationArguments.constraints;
    return image.size <= maxSize;
  }
  defaultMessage() {
    return `file too large`;
  }
}

export function MaxFileSize(
  bytes: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'MaxFileSize',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [bytes],
      validator: MaxFileSizeConstraint,
    });
  };
}
