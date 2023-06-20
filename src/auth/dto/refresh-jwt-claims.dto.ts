import { IntersectionType, PickType } from '@nestjs/swagger';
import { RegisteredJwtClaimsDTO } from './registered-jwt-claims.dto';
import { RefreshJwtClaims } from '../types';
import { UserEntity } from 'src/user/entities/user.entity';

export class RefreshJwtClaimsDTO
  extends IntersectionType(
    PickType(UserEntity, ['id', 'updatedAt']),
    PickType(RegisteredJwtClaimsDTO, ['exp', 'jti', 'iat']),
  )
  implements RefreshJwtClaims {}
