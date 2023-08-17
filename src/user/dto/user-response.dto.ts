import { PickType } from '@nestjs/swagger';
import { UserDTO } from './user.dto';
import { UserResponse } from '../user.types';

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
