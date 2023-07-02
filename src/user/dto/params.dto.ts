import { PickType as PT } from '@nestjs/swagger';
import { UserEmail, UserId } from '../types';
import { UserDTO } from './user.dto';

export class UserIdDTO extends PT(UserDTO, ['id']) implements UserId {}
export class UserEmailDTO extends PT(UserDTO, ['email']) implements UserEmail {}
