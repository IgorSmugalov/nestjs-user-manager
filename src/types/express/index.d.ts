import { AccessJwtClaimsDTO } from 'src/auth/dto/jwt-claims-access.dto';
import { RefreshJwtClaimsDTO } from 'src/auth/dto/jwt-claims-refresh.dto';

export {};

declare global {
  namespace Express {
    export interface Request {
      user: AccessJwtClaimsDTO | null;
      refreshedUser: RefreshJwtClaimsDTO | null;
    }
  }
}
