import { IntersectionType, PickType } from '@nestjs/swagger';
import * as jose from 'jose';
import { UserAuthDataEntity } from '../entities/user-auth-data.entity';
import { Expose } from 'class-transformer';
import { AccessJwtClaimsSet, AuthUserAccessJwtClaims } from '../types';

class BasicJwtClaims implements jose.JWTPayload {
  @Expose()
  iss?: string;
  @Expose()
  sub?: string;
  @Expose()
  aud?: string | string[];
  @Expose()
  jti?: string;
  @Expose()
  nbf?: number;
  @Expose()
  exp?: number;
  @Expose()
  iat?: number;
  [propName: string]: unknown;
}

export class AuthUserClaimsForAccessJwt
  extends PickType(UserAuthDataEntity, ['id', 'activated', 'userProfileId'])
  implements AuthUserAccessJwtClaims {}

export class AccessJwtClaimsDTO
  extends IntersectionType(BasicJwtClaims, AuthUserClaimsForAccessJwt)
  implements AccessJwtClaimsSet {}
