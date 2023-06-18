import { AccessJwtClaimsDTO } from 'src/auth/dto/jwt-claims.dto';

export {};

declare global {
  namespace Express {
    export interface Request {
      user: AccessJwtClaimsDTO | null;
    }
  }
}
