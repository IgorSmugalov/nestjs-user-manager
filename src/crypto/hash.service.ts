import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashService {
  public async hashPassword(password: string) {
    return await argon2.hash(password, {
      type: argon2.argon2i,
    });
  }
  public async validatePassword(hashedPassword: string, password: string) {
    return await argon2.verify(hashedPassword, password);
  }
}
