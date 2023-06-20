import { UserEntity } from '../entities/user.entity';
import { PickType } from '@nestjs/swagger';
import { CreateUser } from '../types';

export class CreateUserDTO
  extends PickType(UserEntity, ['email', 'password'])
  implements CreateUser {}
