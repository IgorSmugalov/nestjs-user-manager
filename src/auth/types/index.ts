import { UserAuthData } from '@prisma/client';
import * as jose from 'jose';

type BasicAccessJwtClaims = Pick<jose.JWTPayload, 'exp'>;

export type AuthUserAccessJwtClaims = Pick<
  UserAuthData,
  'id' | 'userProfileId' | 'activated'
>;

export type AccessJwtClaimsSet = BasicAccessJwtClaims & AuthUserAccessJwtClaims;
