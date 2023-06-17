import { AccessJwtPayloadDTO } from 'src/auth/dto/access-jwt-payload.dto';

export {};

declare global {
  namespace Express {
    export interface Request {
      user: AccessJwtPayloadDTO | null;
    }
  }
}
