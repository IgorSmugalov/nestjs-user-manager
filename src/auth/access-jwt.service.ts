import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwkService } from 'src/crypto/jwk.service';
import { KeyLike, SignJWT, jwtVerify } from 'jose';
import { JWT_CONFIG } from 'src/config';
import { IJwtSetConfig } from 'src/config/jwt.config';
import { AccessJwtClaimsDTO } from './dto/access-jwt-claims.dto';

@Injectable()
export class AccessJwtService {
  private privateJwk: KeyLike;
  private publicJwk: KeyLike;
  constructor(
    private readonly jwkService: JwkService,
    private readonly configService: ConfigService,
  ) {}
  private readonly config =
    this.configService.get<IJwtSetConfig>(JWT_CONFIG).accessJwtConfig;

  async onModuleInit() {
    this.privateJwk = await this.jwkService.getPrivateJwk('access');
    this.publicJwk = await this.jwkService.getPublicJwk('access');
  }

  public async signJwt(data: User): Promise<string> {
    const claims = AccessJwtClaimsDTO.fromUser(data);
    return await new SignJWT({ ...claims })
      .setExpirationTime(claims.iat + this.config.expiresAfter)
      .setProtectedHeader({ alg: this.config.algorithm })
      .sign(this.privateJwk);
  }

  public async verifyJwt(token: string): Promise<AccessJwtClaimsDTO | null> {
    try {
      const { payload } = await jwtVerify(token, this.publicJwk);
      return AccessJwtClaimsDTO.fromToken(payload);
    } catch {
      return null;
    }
  }
}
