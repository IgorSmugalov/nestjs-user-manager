import { Prisma } from '@prisma/client';
import { RegisteredJwtClaims } from '../dto/jwt-claims-registered.dto';
import { UserId } from 'src/user/user.types';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export type AuthSignInResponse = Pick<Tokens, 'accessToken'>;
export type AuthSignOutResponse = UserId;

// Access Jwt

type AccessRegisteredClaims = Pick<RegisteredJwtClaims, 'exp' | 'iat'>;

type AccessCustomClaims = Prisma.UserGetPayload<{
  select: {
    id: true;
    activated: true;
    userProfile: { select: { name: true; surname: true; id: true } };
  };
}>;

export type AccessJwtClaims = AccessRegisteredClaims & AccessCustomClaims;

// Refresh Jwt

type RefreshRegisteredClaims = Pick<RegisteredJwtClaims, 'exp' | 'jti' | 'iat'>;

type RefreshCustomClaims = Prisma.UserGetPayload<{
  select: { id: true };
}>;

export type RefreshJwtClaims = RefreshRegisteredClaims & RefreshCustomClaims;
