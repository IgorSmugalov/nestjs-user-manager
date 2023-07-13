import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, Profile, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Exact } from 'type-fest';
import {
  ProfileAlreadyExistException,
  ProfileDoesNotExistsException,
} from './profile.exceptions';
import {
  CreateProfileInput,
  GetUniqueProfileInput,
  UpdateProfileRepositoryInput,
} from './types';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create Profile and connect him to User Entity, return Profile
   * @param {User} user new User entity without Profile
   * @param {GetUniqueProfileInput} input data for creating new Profile entity
   * @returns {Promise<Profile>} Profile entity
   **/
  public async save(
    user: User,
    input: CreateProfileInput,
  ): Promise<Profile | never> {
    const { name, surname } = input;
    const { id } = user;
    try {
      return await this.prisma.profile.create({
        data: { name, surname, User: { connect: { id } } },
      });
    } catch (error) {
      this.parseError(error);
    }
  }

  /**
   * Find and return one Profile or throw Profile Does Not Exists Exception
   * @param {GetUniqueProfileInput} where - Accept only one unique search key!
   * @returns {Promise<Profile>} Profile entity
   * @throws {ProfileDoesNotExistsException}
   **/
  public async getUnique<T extends Exact<GetUniqueProfileInput, T>>(
    where: T,
  ): Promise<Profile | never> {
    let profile: Profile | null;
    try {
      profile = await this.prisma.profile.findUnique({ where });
    } catch (error) {
      this.parseError(error);
    }
    if (profile) return profile;
    throw new ProfileDoesNotExistsException();
  }

  /**
   * Update one
   * @param {GetUniqueProfileInput} where - Accept only one unique search key!
   * @param {UpdateProfileRepositoryInput} input Data for update profile
   * @returns {Promise<Profile>} Profile entity
   * @throws {ProfileDoesNotExistsException}
   */
  public async updateUnique<T extends Exact<GetUniqueProfileInput, T>>(
    where: T,
    input: UpdateProfileRepositoryInput,
  ): Promise<Profile> {
    const { avatar, name, surname } = input;
    try {
      return await this.prisma.profile.update({
        where,
        data: { avatar, name, surname },
      });
    } catch (error) {
      this.parseError(error);
    }
  }

  private parseError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new ProfileAlreadyExistException();
        case 'P2025':
          throw new ProfileDoesNotExistsException();
        default:
          throw new InternalServerErrorException(error.code);
      }
    }
    throw new InternalServerErrorException(error?.code ?? error?.message);
  }
}
