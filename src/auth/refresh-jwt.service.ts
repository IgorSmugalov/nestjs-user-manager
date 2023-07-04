import { RefreshToken, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwkService } from 'src/crypto/jwk.service';
import { KeyLike, SignJWT, jwtVerify } from 'jose';
import { JWT_CONFIG } from 'src/config';
import { IJwtSetConfig } from 'src/config/jwt.config';
import { RefreshJwtClaimsDTO } from './dto/jwt-claims-refresh.dto';
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

  public async signJwt(data: User): Promise<string> {
    const claims = RefreshJwtClaimsDTO.fromUser(data);
    claims.exp = claims.iat + this.config.expiresAfter;
    await this.addJwtToWhitelist(claims);
    await this.limitateJwtsCountForUser(claims.id);
    return await new SignJWT({ ...claims })
      .setProtectedHeader({ alg: this.config.algorithm })
      .sign(this.privateJwk);
  }

  public async verifyJwt(token: string): Promise<RefreshJwtClaimsDTO | null> {
    try {
      const { payload } = await jwtVerify(token, this.publicJwk);
      const decodedPayload = RefreshJwtClaimsDTO.fromToken(payload);
      await validateOrReject(decodedPayload);
      const wasWhitelisted = await this.isJwtInWhitelist(decodedPayload);
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
        UserId: claims.id,
      },
    });
  }

  public async isJwtInWhitelist(claims: RefreshJwtClaimsDTO): Promise<boolean> {
    const token = await this.prisma.refreshToken.findUnique({
      where: { id: claims.jti },
    });
    return Boolean(token);
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

  private async limitateJwtsCountForUser(UserId: string): Promise<void> {
    const firstRedundantToken = await this.prisma.refreshToken.findFirst({
      where: { UserId },
      orderBy: { issuedAt: 'desc' },
      skip: 5,
    });
    if (!firstRedundantToken) return;
    await this.prisma.refreshToken.deleteMany({
      where: {
        UserId,
        issuedAt: { lte: firstRedundantToken.issuedAt },
      },
    });
  }
}
