import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileIdDTO } from './dto/params.dto';
import { AssetsService } from 'src/assets/assets.service';
import { IGetByIdOptions, IProfileService } from './types';
import { ProfileEntity } from './entities/profile.entity';

@Injectable()
export class ProfileService implements IProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly assetsService: AssetsService,
  ) {}

  public async getById(dto: ProfileIdDTO, options?: IGetByIdOptions) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: dto.id },
    });
    if (!profile && options?.throwOnNotFound)
      throw new BadRequestException('Profile not exists'); //TODO: Rework Exception
    if (profile && options?.throwOnFound)
      throw new BadRequestException('Profile already exists'); //TODO: Rework Exception
    return ProfileEntity.fromPrisma(profile, this.assetsService);
  }

  public async update(updateDto: UpdateProfileDTO, dtoId: ProfileIdDTO) {
    const { id } = await this.getById(dtoId, { throwOnNotFound: true });
    let avatar: string | undefined;
    if (updateDto.avatar) {
      avatar = await this.assetsService.uploadAvatar(
        updateDto.avatar.buffer,
        id,
      );
    }
    const profile = await this.prisma.profile.update({
      where: { id },
      data: { ...updateDto, avatar },
    });
    return ProfileEntity.fromPrisma(profile, this.assetsService);
  }

  public async deleteAvatar(dto: ProfileIdDTO) {
    const { avatar } = await this.getById(dto, { throwOnNotFound: true });
    if (!avatar) throw new BadRequestException('User does not have avatar'); //TODO: Rework Exception
    await this.assetsService.deleteAvatar(avatar);
    const profile = await this.prisma.profile.update({
      where: { id: dto.id },
      data: { avatar: null },
    });
    return ProfileEntity.fromPrisma(profile, this.assetsService);
  }
}
