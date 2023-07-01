import { ApiProperty } from '@nestjs/swagger';
import { CreateProfileInput } from '../types';
import { Expose } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { IsImage } from 'src/utils/validation/isImage';
import { MaxFileSize } from 'src/utils/validation/maxFileSize.validator';

export class CreateProfileDTO implements CreateProfileInput {
  @Expose()
  @IsString()
  @MinLength(2)
  @ApiProperty()
  name: string;

  @Expose()
  @IsString()
  @MinLength(2)
  @ApiProperty()
  surname: string;

  @Expose()
  @IsImage()
  @MaxFileSize(1024 * 1024 * 1)
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary' })
  avatar: Express.Multer.File;
}
