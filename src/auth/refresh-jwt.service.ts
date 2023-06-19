import { RefreshToken, UserAuthData } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwkService } from 'src/crypto/jwk.service';
import { KeyLike, SignJWT, jwtVerify } from 'jose';
import { plainToInstance } from 'class-transformer';
import { JWT_CONFIG } from 'src/config';
import { IJwtSetConfig } from 'src/config/jwt.config';
import { RefreshJwtClaimsDTO } from './dto/refresh-jwt-claims.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { validateOrReject } from 'class-validator';

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
    payload.iat = Math.round(Date.now() / 1000);
    payload.exp = payload.iat + this.config.expiresAfter;
    const token = new SignJWT({ ...payload })
      .setProtectedHeader({ alg: this.config.algorithm })
      .sign(this.privateJwk);
    await this.addJwtToWhitelist(payload);
    await this.limitateJwtsCountForUser(payload.id);
    return await token;
  }

  public async verifyJwt(token: string): Promise<RefreshJwtClaimsDTO | null> {
    try {
      const { payload } = await jwtVerify(token, this.publicJwk);
      const decodedPayload = plainToInstance(RefreshJwtClaimsDTO, payload);
      await validateOrReject(decodedPayload);
      const wasWhitelisted = await this.removeJwtFromWhitelist(decodedPayload);
      if (!wasWhitelisted) return null;
      return decodedPayload;
    } catch {
      return null;
    }
  }

  public async addJwtToWhitelist(claims: RefreshJwtClaimsDTO): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        id: claims.jti,
        issuedAt: new Date(claims.iat * 1000),
        expiresAt: new Date(claims.exp * 1000),
        userAuthDataId: claims.id,
      },
    });
  }

  public async removeJwtFromWhitelist(
    claims: RefreshJwtClaimsDTO,
  ): Promise<RefreshToken | null> {
    try {
      return await this.prisma.refreshToken.delete({
        where: { id: claims.jti },
      });
    } catch {
      return null;
    }
  }

  private async limitateJwtsCountForUser(
    userAuthDataId: string,
  ): Promise<void> {
    const firstRedundantToken = await this.prisma.refreshToken.findFirst({
      where: { userAuthDataId },
      orderBy: { issuedAt: 'desc' },
      skip: 5,
    });
    if (!firstRedundantToken) return;
    await this.prisma.refreshToken.deleteMany({
      where: {
        userAuthDataId,
        issuedAt: { lte: firstRedundantToken.issuedAt },
      },
    });
  }
}
