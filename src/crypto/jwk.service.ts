import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { JWK_CONFIG } from 'src/config';
import { JwkSetType } from './types';
import {
  exportPKCS8,
  exportSPKI,
  generateKeyPair,
  importPKCS8,
  importSPKI,
} from 'jose';
import { IJwkSetConfig } from 'src/config/jwk.config';

@Injectable()
export class JwkService {
  private readonly config = this.configService.get<IJwkSetConfig>(JWK_CONFIG);
  private readonly logger = new Logger(JwkService.name);
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    if (!this.isKeysExists('access') || !this.isKeysExists('refresh')) {
      await this.generateJwkSet('access');
      await this.generateJwkSet('refresh');
    }
  }

  private isKeysExists(keyType: JwkSetType) {
    const { privatePemFile, publicPemFile } =
      this.config[`${keyType}JwkConfig`];
    return [privatePemFile, publicPemFile].every((file) => existsSync(file));
  }

  private async generateJwkSet(keyType: JwkSetType) {
    this.logger.log(`Generate ${keyType} Jwk Set...`);
    const { privatePemFile, publicPemFile, algorithm } =
      this.config[`${keyType}JwkConfig`];
    const { privateKey, publicKey } = await generateKeyPair(algorithm);
    const [exportedPrivate, exportedPublic] = [
      await exportPKCS8(privateKey),
      await exportSPKI(publicKey),
    ];
    await mkdir(this.config.dir, { recursive: true });
    await this.writePem(privatePemFile, exportedPrivate);
    await this.writePem(publicPemFile, exportedPublic);
  }

  public async getPrivateJwk(keyType: JwkSetType) {
    const { privatePemFile, algorithm } = this.config[`${keyType}JwkConfig`];
    const file = await this.readPem(privatePemFile);
    return await importPKCS8(file, algorithm);
  }

  public async getPublicJwk(keyType: JwkSetType) {
    const { publicPemFile, algorithm } = this.config[`${keyType}JwkConfig`];
    const file = await this.readPem(publicPemFile);
    return await importSPKI(file, algorithm);
  }

  private async writePem(file: string, key: string) {
    await writeFile(file, key, { encoding: 'utf-8' });
  }

  private async readPem(file: string) {
    return await readFile(file, { encoding: 'utf-8' });
  }
}
