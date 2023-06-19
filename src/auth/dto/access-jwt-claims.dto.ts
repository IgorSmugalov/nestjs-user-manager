import { UserEntity } from '../entities/user-auth-data.entity';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { RegisteredJwtClaimsDTO } from './registered-jwt-claims.dto';
import { AccessJwtClaims } from '../types';

export class AccessJwtClaimsDTO
  extends IntersectionType(
    PickType(UserEntity, ['id', 'userProfileId', 'activated', 'updatedAt']),
    PickType(RegisteredJwtClaimsDTO, ['exp', 'iat']),
  )
  implements AccessJwtClaims {}
