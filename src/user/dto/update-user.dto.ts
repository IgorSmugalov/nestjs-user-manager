import { PartialType, PickType } from '@nestjs/swagger';
import { UserDTO } from './user.dto';
import { UpdateUser } from '../user.types';

export class UpdateUserDTO
  extends PartialType(PickType(UserDTO, ['roles', 'activated', 'email']))
  implements UpdateUser {}
