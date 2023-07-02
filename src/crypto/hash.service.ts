import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { IncorrectPasswordException } from './exceptions/password.exceptions';

@Injectable()
export class HashService {
  public async hashPassword(password: string) {
    return await argon2.hash(password, {
      type: argon2.argon2i,
    });
  }
  public async validatePassword(
    hashedPassword: string,
    password: string,
    throwOnInvalidPassword?: boolean,
  ): Promise<boolean | never> {
    const isValid = await argon2.verify(hashedPassword, password);
    if (!isValid && throwOnInvalidPassword)
      throw new IncorrectPasswordException();
    return isValid;
  }
}
