import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user-auth-data.entity';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class UserCredentialsDTO extends PickType(UserEntity, [
  'email',
  'password',
]) {}
