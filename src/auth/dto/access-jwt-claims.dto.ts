import { IntersectionType, PickType } from '@nestjs/swagger';
import { RegisteredJwtClaimsDTO } from './registered-jwt-claims.dto';
import { AccessJwtClaims } from '../types';
import { UserEntity } from 'src/user/entities/user.entity';

export class AccessJwtClaimsDTO
  extends IntersectionType(
    PickType(UserEntity, ['id', 'userProfileId', 'activated', 'updatedAt']),
    PickType(RegisteredJwtClaimsDTO, ['exp', 'iat']),
  )
  implements AccessJwtClaims {}
