import { PickType } from '@nestjs/swagger';

import { UserDTO } from './user.dto';
import {
  UserActivationKey,
  UserEmail,
  UserId,
  UserRecoveryPasswordKey,
} from '../user.types';

export class UserIdDTO extends PickType(UserDTO, ['id']) implements UserId {}

export class UserEmailDTO
  extends PickType(UserDTO, ['email'])
  implements UserEmail {}

export class UserActivationKeyDTO
  extends PickType(UserDTO, ['activationKey'])
  implements UserActivationKey {}

export class UserRecoveryPasswordKeyDTO
  extends PickType(UserDTO, ['recoveryPasswordKey'])
  implements UserRecoveryPasswordKey {}
