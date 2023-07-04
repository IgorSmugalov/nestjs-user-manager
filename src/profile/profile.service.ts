import { Injectable } from '@nestjs/common';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileIdDTO } from './dto/params.dto';
import { AssetsService } from 'src/assets/assets.service';
import { IGetByIdOptions, IProfileService } from './types';
import { ProfileDTO } from './dto/profile.dto';
import {
  AvatarDoesNotExistException,
  ProfileAlreadyNotExistException,
  ProfileDoesNotExistException,
} from './profile.exceptions';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProfileService implements IProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly assetsService: AssetsService,
  ) {}

  public async getProfile(
    input: Prisma.ProfileWhereUniqueInput,
    options?: IGetByIdOptions,
  ) {
    const profile = await this.prisma.profile.findUnique({
      where: this.profileUniqueInput(input),
    });
    if (!profile && options?.throwOnNotFound)
      throw new ProfileDoesNotExistException();
    if (profile && options?.throwOnFound)
      throw new ProfileAlreadyNotExistException();
    return ProfileDTO.fromPrisma(profile, this.assetsService);
  }

  public async update(updateDto: UpdateProfileDTO, dtoId: ProfileIdDTO) {
    await this.getProfile(dtoId, { throwOnNotFound: true });
    if (updateDto.avatar) {
      updateDto.path = await this.assetsService.saveAvatar(
        updateDto.avatar.buffer,
        dtoId.id,
      );
    }
    const profile = await this.prisma.profile.update(
      updateDto.updateProfileInput(dtoId.id),
    );
    return ProfileDTO.fromPrisma(profile, this.assetsService);
  }

  public async deleteAvatar(dto: ProfileIdDTO) {
    const { avatar } = await this.getProfile(dto, { throwOnNotFound: true });
    if (!avatar) throw new AvatarDoesNotExistException();
    await this.assetsService.deleteAvatar(avatar);
    const profile = await this.prisma.profile.update({
      where: { id: dto.id },
      data: { avatar: null },
    });
    return ProfileDTO.fromPrisma(profile, this.assetsService);
  }

  private profileUniqueInput(input: Prisma.ProfileWhereUniqueInput) {
    const { id } = input;
    return Prisma.validator<Prisma.UserWhereUniqueInput>()({
      id,
    });
  }
}
