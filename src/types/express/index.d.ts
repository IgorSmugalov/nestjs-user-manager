import { AccessJwtClaimsDTO } from 'src/auth/dto/access-jwt-claims.dto';
import { RefreshJwtClaimsDTO } from 'src/auth/dto/refresh-jwt-claims.dto';

export {};

declare global {
  namespace Express {
    export interface Request {
      user: AccessJwtClaimsDTO | null;
      refreshedUser: RefreshJwtClaimsDTO | null;
    }
  }
}
