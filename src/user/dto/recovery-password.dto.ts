import { PickType } from '@nestjs/swagger';
import { UserDTO } from './user.dto';
import { RecoveryPassword } from '../user.types';

export class RecoveryPasswordDTO
  extends PickType(UserDTO, ['recoveryPasswordKey', 'password'])
  implements RecoveryPassword {}
