import { IntersectionType, PickType } from '@nestjs/swagger';
import { RegisteredJwtClaimsDTO } from './registered-jwt-claims.dto';
import { RefreshJwtClaims } from '../types';
import { UserEntity } from 'src/user/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { JWTPayload } from 'jose';

export class RefreshJwtClaimsDTO
  extends IntersectionType(
    PickType(UserEntity, ['id', 'updatedAt']),
    PickType(RegisteredJwtClaimsDTO, ['exp', 'jti', 'iat']),
  )
  implements RefreshJwtClaims
{
  static fromUser(user: UserEntity): RefreshJwtClaimsDTO {
    return plainToInstance(this, user, {
      strategy: 'excludeAll',
      exposeUnsetFields: false,
      exposeDefaultValues: true,
    });
  }
  static fromToken(jwt: JWTPayload) {
    return plainToInstance(RefreshJwtClaimsDTO, jwt, {
      strategy: 'excludeAll',
      exposeDefaultValues: false,
    });
  }
}
