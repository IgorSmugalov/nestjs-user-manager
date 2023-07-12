import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { IncorrectPasswordException } from './exceptions/password.exceptions';

type validatePasswordOptions = { throwOnFail: boolean };
const defaultOptions: validatePasswordOptions = { throwOnFail: false };

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
    options: validatePasswordOptions = defaultOptions,
  ): Promise<boolean | never> {
    const isValid = await argon2.verify(hashedPassword, password);
    if (options.throwOnFail && !isValid) throw new IncorrectPasswordException();
    return isValid;
  }
}
