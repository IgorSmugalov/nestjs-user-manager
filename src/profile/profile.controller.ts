import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { ProfileIdDTO } from './dto/params.dto';
import { UseRequestValidation } from 'src/lib/validation/use-request-validation.decorator';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ParseProfileFormData } from './decorators/parse-profile-form-data.decorator';
import { ProfileDTO } from './dto/profile.dto';
import { UseResponseSerializer } from 'src/lib/serialization/use-response-serializer.decorator';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { ProfileDoesNotExistsException } from './profile.exceptions';
import { AvatarPathInterceptor } from './interceptors/define-avatar-urn.interceptor';

@Controller('profile')
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  @UseRequestValidation()
  @UseResponseSerializer(ProfileDTO, [AvatarPathInterceptor])
  @ApiOkResponse({ type: ProfileDTO })
  @ApiException(() => ProfileDoesNotExistsException)
  async findOne(@Param() dto: ProfileIdDTO) {
    return await this.profileService.getById(dto);
  }

  @Patch(':id')
  @ParseProfileFormData()
  @UseRequestValidation()
  @UseResponseSerializer(ProfileDTO, [AvatarPathInterceptor])
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProfileDTO })
  @ApiOkResponse({ type: ProfileDTO })
  @ApiException(() => ProfileDoesNotExistsException)
  async update(
    @Param() idDto: ProfileIdDTO,
    @Body() updateDto: UpdateProfileDTO,
  ) {
    return await this.profileService.update(idDto, updateDto);
  }
}
