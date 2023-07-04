import { Exclude, Expose } from 'class-transformer';
import { AvatarFile } from '../types';
import { ApiProperty } from '@nestjs/swagger';
import { IsImage } from 'src/utils/validation/isImage';
import { Allow } from 'class-validator';

export class AvatarFileDTO implements AvatarFile {
  @Expose()
  @IsImage()
  @Allow()
  @ApiProperty({ type: 'string', format: 'binary' })
  avatar: Express.Multer.File;

  @Exclude({ toClassOnly: true })
  private _avatarPath: string;

  public get path(): string {
    return this._avatarPath;
  }

  public set path(avatarPath: string) {
    this._avatarPath = avatarPath;
  }
}
