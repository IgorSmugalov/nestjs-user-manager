import { Expose } from 'class-transformer';
import { AvatarFile } from '../types';
import { IsImage } from 'src/lib/validation/isImage.validator';
import { ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AvatarFileDTO implements AvatarFile {
  @Expose()
  @IsImage()
  @ValidateIf((_, value) => value !== '')
  @ApiProperty({ type: 'string', format: 'binary' })
  avatar: '' | string | Express.Multer.File;
}
