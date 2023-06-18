import { UserAuthData } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwkService } from 'src/crypto/jwk.service';
import { KeyLike, SignJWT, jwtVerify } from 'jose';
import { plainToInstance } from 'class-transformer';
import { JWT_CONFIG } from 'src/config';
import { jwtConfig } from 'src/config/jwt.config';
import { AccessJwtClaimsDTO } from './dto/jwt-claims.dto';

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
    const payload = plainToInstance(AccessJwtClaimsDTO, data, {
      strategy: 'excludeAll',
      exposeUnsetFields: false,
    });
    return await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: this.config.accessJwtConfig.algorithm })
      .setExpirationTime(this.config.accessJwtConfig.expires)
      .sign(this.accessJWTPrivateKey);
  }

  public async jwtVerify(token: string): Promise<AccessJwtClaimsDTO | null> {
    try {
      const { payload } = await jwtVerify(token, this.accessJWTPublicKey);
      const jwtUserData = plainToInstance(AccessJwtClaimsDTO, payload, {
        strategy: 'excludeAll',
        exposeUnsetFields: false,
      });
      return jwtUserData;
    } catch {
      return null;
    }
  }
}
