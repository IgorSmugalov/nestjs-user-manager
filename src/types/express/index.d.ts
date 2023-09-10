import { AuthenticatedUserDTO, RefreshJwtClaimsDTO } from 'src/auth';

export {};

declare global {
  namespace Express {
    export interface Request {
      user: AuthenticatedUserDTO | null;
      refreshedUser: RefreshJwtClaimsDTO | null;
    }
  }
}
