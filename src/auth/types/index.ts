import { Prisma, Profile } from '@prisma/client';
import { RegisteredJwtClaims } from '../dto/jwt-claims-registered.dto';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

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

export type AuthResponseUserPart = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    activated: true;
    createdAt: true;
    updatedAt: true;
    userProfileId: true;
  };
}>;

export type AuthResult = {
  user: AuthResponseUserPart;
  profile: Profile;
  tokens: Tokens;
};
