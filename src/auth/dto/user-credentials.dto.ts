import { PickType } from '@nestjs/swagger';
import { UserAuthDataEntity } from '../entities/user-auth-data.entity';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class UserCredentialsDTO extends PickType(UserAuthDataEntity, [
  'email',
  'password',
]) {}
