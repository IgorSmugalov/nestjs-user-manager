import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
@ValidatorConstraint({ name: 'IsImageBufferConstraint' })
@Injectable()
export class IsImageBufferConstraint implements ValidatorConstraintInterface {
  validate(image: Express.Multer.File) {
    return image.mimetype === 'image/jpeg';
  }
  defaultMessage() {
    return `file is not an image`;
  }
}

export function IsImage(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsImage',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsImageBufferConstraint,
    });
  };
}
