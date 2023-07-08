import { PickType } from '@nestjs/swagger';
import { UserDTO } from './user.dto';
import { ActivationUserResponse } from '../types';

export class ActivationUserResponseDTO
  extends PickType(UserDTO, ['email', 'activated'])
  implements ActivationUserResponse {}
