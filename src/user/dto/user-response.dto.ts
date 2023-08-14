import { PickType } from '@nestjs/swagger';
import { UserResponse } from '../types';
import { UserDTO } from './user.dto';

export class UserResponseDTO
  extends PickType(UserDTO, [
    'id',
    'email',
    'roles',
    'activated',
    'createdAt',
    'updatedAt',
    'userProfileId',
  ])
  implements UserResponse {}
