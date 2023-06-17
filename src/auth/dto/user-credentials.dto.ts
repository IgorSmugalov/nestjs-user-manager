import { PickType } from '@nestjs/swagger';
import { UserAuthDataEntity } from '../entities/user-auth-data.entity';

export class UserCredentialsDTO extends PickType(UserAuthDataEntity, [
  'email',
  'password',
]) {}
