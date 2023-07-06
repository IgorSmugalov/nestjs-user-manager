import { PickType } from '@nestjs/swagger';
import { UserDTO } from './user.dto';
import { ActivationUserResponse } from '../types';
import { plainToInstance } from 'class-transformer';
import { User } from '@prisma/client';

export class ActivationUserResponseDTO
  extends PickType(UserDTO, ['email', 'activated'])
  implements ActivationUserResponse
{
  static fromUser(profile: User) {
    return plainToInstance(this, profile, { strategy: 'excludeAll' });
  }
}
