import { PickType } from '@nestjs/swagger';
import { UserAuthDataEntity } from '../entities/user-auth-data.entity';

export class AccessJwtPayloadDTO extends PickType(UserAuthDataEntity, [
  'id',
  'activated',
  'userProfileId',
]) {}
