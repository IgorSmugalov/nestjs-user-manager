import { UserAuthData } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwkService } from 'src/crypto/jwk.service';
import { KeyLike, SignJWT, jwtVerify } from 'jose';
import { plainToInstance } from 'class-transformer';
import { AccessJwtPayloadDTO } from './dto/access-jwt-payload.dto';
import { JWT_CONFIG } from 'src/config';
import { jwtConfig } from 'src/config/jwt.config';

@Injectable()
export class JwtService {
  private accessJWTPrivateKey: KeyLike;
  private accessJWTPublicKey: KeyLike;

  constructor(
    private configService: ConfigService,
    private jwkService: JwkService,
  ) {}

  async onModuleInit() {
    this.accessJWTPrivateKey = await this.jwkService.getAccessPrivateJWK();
    this.accessJWTPublicKey = await this.jwkService.getAccessPublicJWK();
  }

  private config = this.configService.get<jwtConfig>(JWT_CONFIG);

  public async signAccessJWT(data: UserAuthData): Promise<string> {
    const user = plainToInstance(AccessJwtPayloadDTO, data, {
      strategy: 'excludeAll',
    });
    return await new SignJWT({ user })
      .setProtectedHeader({ alg: this.config.accessJwtConfig.algorithm })
      .setExpirationTime(this.config.accessJwtConfig.expires)
      .sign(this.accessJWTPrivateKey);
  }

  public async jwtVerify(token: string): Promise<AccessJwtPayloadDTO | null> {
    try {
      const { payload } = await jwtVerify(token, this.accessJWTPublicKey);
      const jwtUserData = plainToInstance(AccessJwtPayloadDTO, payload?.user, {
        excludeExtraneousValues: true,
      });
      return jwtUserData;
    } catch {
      return null;
    }
  }
}
