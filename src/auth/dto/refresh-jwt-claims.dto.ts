import { UserEntity } from '../entities/user-auth-data.entity';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { RegisteredJwtClaimsDTO } from './registered-jwt-claims.dto';
import { RefreshJwtClaims } from '../types';

export class RefreshJwtClaimsDTO
  extends IntersectionType(
    PickType(UserEntity, ['id', 'updatedAt']),
    PickType(RegisteredJwtClaimsDTO, ['exp', 'jti', 'iat']),
  )
  implements RefreshJwtClaims {}
