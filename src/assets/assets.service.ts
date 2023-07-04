import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { path } from 'app-root-path';
import { mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import * as sharp from 'sharp';
import { PATH_CONFIG } from 'src/config';
import { IPathConfig } from 'src/config/path.congfig';

@Injectable()
export class AssetsService {
  constructor(private readonly configService: ConfigService) {}
  private readonly config = this.configService.get<IPathConfig>(PATH_CONFIG);

  private async onModuleInit() {
    await mkdir(join(path, this.config.assetsPath, this.config.avatarDir), {
      recursive: true,
    });
  }

  public async saveAvatar(file: Buffer, fileName: string): Promise<string> {
    const filename = fileName + '.jpg';
    await sharp(file)
      .jpeg()
      .toFile(
        join(path, this.config.assetsPath, this.config.avatarDir, filename),
      );
    return filename;
  }

  public getAvatarPath(fileName: string): string {
    return join(this.config.assetsPath, this.config.avatarDir, fileName);
  }

  public deleteAvatar(fileName: string) {
    const pathArr = fileName.split('/');
    const file = pathArr[pathArr.length - 1];
    return unlink(
      join(path, this.config.assetsPath, this.config.avatarDir, file),
    );
  }
}
