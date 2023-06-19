import { UserAuthData } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwkService } from 'src/crypto/jwk.service';
import { KeyLike, SignJWT, jwtVerify } from 'jose';
import { plainToInstance } from 'class-transformer';
import { JWT_CONFIG } from 'src/config';
import { IJwtSetConfig } from 'src/config/jwt.config';
import { RefreshJwtClaimsDTO } from './dto/refresh-jwt-claims.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RefreshJwtService {
  private privateJwk: KeyLike;
  private publicJwk: KeyLike;
  constructor(
    private readonly jwkService: JwkService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}
  private readonly config =
    this.configService.get<IJwtSetConfig>(JWT_CONFIG).refreshJwtConfig;

  async onModuleInit() {
    this.privateJwk = await this.jwkService.getPrivateJwk('refresh');
    this.publicJwk = await this.jwkService.getPublicJwk('refresh');
  }

  public async signJwt(data: UserAuthData): Promise<string> {
    const payload = plainToInstance(RefreshJwtClaimsDTO, data, {
      strategy: 'excludeAll',
      exposeUnsetFields: false,
    });
    return await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: this.config.algorithm })
      .setExpirationTime(this.config.expires)
      .sign(this.privateJwk);
  }

  public async verifyJwt(token: string): Promise<RefreshJwtClaimsDTO | null> {
    try {
      const { payload } = await jwtVerify(token, this.publicJwk);
      const decodedPayload = plainToInstance(RefreshJwtClaimsDTO, payload);
      return decodedPayload;
    } catch {
      return null;
    }
  }
}
