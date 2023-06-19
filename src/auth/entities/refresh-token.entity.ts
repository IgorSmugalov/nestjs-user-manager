import { RefreshToken } from '@prisma/client';
import { Expose } from 'class-transformer';

export class RefreshTokenEntity implements RefreshToken {
  @Expose()
  id: string;
  @Expose()
  expiresAt: Date;
  @Expose()
  issuedAt: Date;
  @Expose()
  UserId: string;
}
