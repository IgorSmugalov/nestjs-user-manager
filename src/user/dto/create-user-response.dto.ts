import { PickType } from '@nestjs/swagger';
import { CreateUserResponse } from '../types';
import { UserDTO } from './user.dto';
import { plainToInstance } from 'class-transformer';
import { User } from '@prisma/client';

export class CreateUserResponseDTO
  extends PickType(UserDTO, ['email'])
  implements CreateUserResponse
{
  static fromPrisma(user: User) {
    return plainToInstance(this, user, { strategy: 'excludeAll' });
  }
}
