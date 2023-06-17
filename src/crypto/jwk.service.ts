import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import * as jose from 'jose';
import { JWK_CONFIG } from 'src/config';
import { jwkConfig } from 'src/config/jwk.config';

@Injectable()
export class JwkService {
  constructor(private readonly configService: ConfigService) {}
  private config = this.configService.get<jwkConfig>(JWK_CONFIG);
  private readonly logger = new Logger(JwkService.name);

  async onModuleInit() {
    if (!this.isKeysExists()) {
      await this.generateAccessJWKSFiles();
    }
  }

  private isKeysExists() {
    const {
      accessJwkConfig: { privatePemFile, publicPemFile },
    } = this.config;

    const files = [privatePemFile, publicPemFile];
    return files.every((file) => existsSync(file));
  }
  private async generateAccessJWKSFiles() {
    const {
      accessJwkConfig: { privatePemFile, publicPemFile, algorithm },
      dir,
    } = this.config;
    this.logger.log('Generate Jwk...');
    const { privateKey, publicKey } = await jose.generateKeyPair(algorithm);
    const privatePemKey = await jose.exportPKCS8(privateKey);
    const publicPemKey = await jose.exportSPKI(publicKey);
    await mkdir(dir, { recursive: true });
    await writeFile(privatePemFile, privatePemKey, {
      encoding: 'utf-8',
    });
    await writeFile(publicPemFile, publicPemKey, {
      encoding: 'utf-8',
    });
  }

  public async getAccessPrivateJWK() {
    const {
      accessJwkConfig: { privatePemFile, algorithm },
    } = this.config;
    const file = await readFile(privatePemFile, {
      encoding: 'utf-8',
    });
    return await jose.importPKCS8(file, algorithm);
  }

  public async getAccessPublicJWK() {
    const {
      accessJwkConfig: { publicPemFile, algorithm },
    } = this.config;
    const file = await readFile(publicPemFile, {
      encoding: 'utf-8',
    });
    return await jose.importSPKI(file, algorithm);
  }
}
