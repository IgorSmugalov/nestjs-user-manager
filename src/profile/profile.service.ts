import { Injectable } from '@nestjs/common';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { ProfileIdDTO } from './dto/params.dto';
import { Profile, User } from '@prisma/client';
import { ProfileRepository } from './profile.repository';
import { CreateProfileInput } from './types';
import { ConfigService } from '@nestjs/config';
import { IPathConfig } from 'src/config/path.congfig';
import { PATH_CONFIG } from 'src/config/const';
import { mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { path } from 'app-root-path';
import * as sharp from 'sharp';
import { existsSync } from 'fs';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly configService: ConfigService,
  ) {}
  private readonly config = this.configService.get<IPathConfig>(PATH_CONFIG);

  async onModuleInit() {
    await mkdir(join(path, this.config.assetsPath, this.config.avatarDir), {
      recursive: true,
    });
  }

  /**
   * Create Profile and connect him to User Entity, return Profile
   * @param {User} user new User entity without Profile
   * @param {GetUniqueProfileInput} input data for creating new Profile entity
   * @returns {Promise<Profile>} Profile entity
   **/
  public async create(user: User, input: CreateProfileInput): Promise<Profile> {
    return await this.profileRepository.save(user, input);
  }

  /**
   * Get one Profile by Id or throw if it's not exists
   * @param {GetPartialUniqueUserInput} dto Accept only one unique User search key!
   * @return {Promise<Profile>} Profile entity
   * @throws {ProfileDoesNotExistsException}
   **/
  public async getById(dto: ProfileIdDTO): Promise<Profile> {
    return await this.profileRepository.getUnique({ id: dto.id });
  }

  /**
   * Update one Profile by Id or throw if it's not exists
   * @param {ProfileIdDTO} dtoId Accept only one unique User search key!
   * @param {UpdateProfileDTO} updateDto
   * @return {Promise<Profile>} Profile entity
   * @throws {ProfileDoesNotExistsException}
   **/
  public async update(
    dtoId: ProfileIdDTO,
    updateDto: UpdateProfileDTO,
  ): Promise<Profile> {
    let fileName: Profile['avatar'] | null = dtoId.id + '.jpg';
    if (typeof updateDto.avatar === 'object') {
      this.writeAvatar(updateDto.avatar.buffer, fileName);
    }
    if (updateDto.avatar === '') {
      this.deleteAvatar(fileName);
      fileName = null;
    }
    return await this.profileRepository.updateUnique(dtoId, {
      ...updateDto,
      avatar: fileName,
    });
  }

  private async writeAvatar(fileBuffer: Buffer, fileName: string) {
    await sharp(fileBuffer).jpeg().toFile(this.defineAvatarPath(fileName));
  }

  private async deleteAvatar(fileName: string) {
    const filePath = this.defineAvatarPath(fileName);
    if (existsSync(filePath)) await unlink(filePath);
  }

  private defineAvatarPath(fileName: string) {
    return join(path, this.config.assetsPath, this.config.avatarDir, fileName);
  }

  public defineAvatarURN(fileName: string) {
    return join(this.config.assetsPath, this.config.avatarDir, fileName);
  }
}
