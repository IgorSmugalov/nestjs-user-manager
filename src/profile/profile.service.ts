import { Injectable } from '@nestjs/common';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileIdDTO } from './dto/params.dto';
import * as sharp from 'sharp';
import { ConfigService } from '@nestjs/config';
import { IPathConfig } from 'src/config/path.congfig';
import { PATH_CONFIG } from 'src/config';
import { join } from 'path';
import { path } from 'app-root-path';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  private readonly config = this.configService.get<IPathConfig>(PATH_CONFIG);

  public async getById(dto: ProfileIdDTO) {
    return await this.prisma.profile.findUnique({ where: dto });
  }

  public async update(updateDto: UpdateProfileDTO, { id }: ProfileIdDTO) {
    let avatar: string | undefined;
    if (updateDto.avatar) {
      avatar = await this.uploadAvatar(updateDto.avatar.buffer, id);
    }
    return await this.prisma.profile.update({
      where: { id },
      data: { ...updateDto, avatar },
    });
  }

  public async uploadAvatar(buffer: Buffer, userId: string): Promise<string> {
    const filename = userId + '.jpg';
    await sharp(buffer)
      .jpeg()
      .toFile(
        join(path, this.config.assetsPath, this.config.avatarDir, filename),
      );
    return filename;
  }

  public getAvatarFilePath(fileName: string): string {
    return join(this.config.assetsPath, this.config.avatarDir, fileName);
  }
}

//TODO: check and add folders for avatars if it's not exists
