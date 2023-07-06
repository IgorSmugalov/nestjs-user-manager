import { PickType } from '@nestjs/swagger';
import { UserActivationKey, UserEmail, UserId } from '../types';
import { UserDTO } from './user.dto';

export class UserIdDTO extends PickType(UserDTO, ['id']) implements UserId {}

export class UserEmailDTO
  extends PickType(UserDTO, ['email'])
  implements UserEmail {}

export class UserActivationKeyDTO
  extends PickType(UserDTO, ['activationKey'])
  implements UserActivationKey {}
