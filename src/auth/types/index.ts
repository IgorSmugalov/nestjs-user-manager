import { User } from '@prisma/client';
import { RegisteredJwtClaims } from '../dto/registered-jwt-claims.dto';

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

type AccessJwtRegisteredClaims = Pick<RegisteredJwtClaims, 'exp' | 'iat'>;
type AccessJwtAuthClaims = Pick<
  User,
  'id' | 'userProfileId' | 'activated' | 'updatedAt'
>;
export type AccessJwtClaims = AccessJwtRegisteredClaims & AccessJwtAuthClaims;

type RefreshJwtRegisteredClaims = Pick<
  RegisteredJwtClaims,
  'exp' | 'jti' | 'iat'
>;
type RefreshJwtAuthClaims = Pick<User, 'id' | 'updatedAt'>;
export type RefreshJwtClaims = RefreshJwtRegisteredClaims &
  RefreshJwtAuthClaims;
