import { AuthenticatedUserDTO } from 'src/auth/dto/authenticated-user.dto';
import { RefreshJwtClaimsDTO } from 'src/auth/dto/jwt-claims-refresh.dto';

export {};

declare global {
  namespace Express {
    export interface Request {
      user: AuthenticatedUserDTO | null;
      refreshedUser: RefreshJwtClaimsDTO | null;
    }
  }
}
