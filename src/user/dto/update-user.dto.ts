import { PartialType, PickType } from '@nestjs/swagger';
import { UserDTO } from './user.dto';

export class UpdateUserDTO extends PartialType(
  PickType(UserDTO, ['roles', 'activated', 'email']),
) {}
