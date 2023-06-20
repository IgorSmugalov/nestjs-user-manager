import { PickType } from '@nestjs/swagger';
import { UserEmail, UserId } from '../types';
import { UserEntity as U } from '../entities/user.entity';

export class UserIdDTO extends PickType(U, ['id']) implements UserId {}

export class UserEmailDTO extends PickType(U, ['email']) implements UserEmail {}
