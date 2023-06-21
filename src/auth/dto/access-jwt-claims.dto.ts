import { IntersectionType, PickType } from '@nestjs/swagger';
import { RegisteredJwtClaimsDTO } from './registered-jwt-claims.dto';
import { AccessJwtClaims } from '../types';
import { UserEntity } from 'src/user/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { JWTPayload } from 'jose';

export class AccessJwtClaimsDTO
  extends IntersectionType(
    PickType(UserEntity, ['id', 'userProfileId', 'activated', 'updatedAt']),
    PickType(RegisteredJwtClaimsDTO, ['exp', 'iat']),
  )
  implements AccessJwtClaims
{
  static fromUser(user: UserEntity): AccessJwtClaimsDTO {
    return plainToInstance(this, user, {
      strategy: 'excludeAll',
      exposeUnsetFields: false,
      exposeDefaultValues: true,
    });
  }
  static fromToken(jwt: JWTPayload) {
    return plainToInstance(AccessJwtClaimsDTO, jwt, {
      strategy: 'excludeAll',
      exposeDefaultValues: false,
    });
  }
}
