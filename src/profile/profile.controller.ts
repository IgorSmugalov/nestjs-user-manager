import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { ProfileIdDTO } from './dto/params.dto';
import { UseRequestValidation } from 'src/lib/validation/use-request-validation.decorator';
import { ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { ParseProfileFormData } from './decorators/parse-profile-form-data.decorator';
import { ProfileDTO } from './dto/profile.dto';

@Controller('profile')
@ApiTags('Profile')
@UseRequestValidation()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  @ApiParam({ type: ProfileIdDTO, name: 'id' })
  @ApiOkResponse({ type: ProfileDTO })
  async findOne(@Param() dto: ProfileIdDTO) {
    return await this.profileService.getProfile(dto, { throwOnNotFound: true });
  }

  @Patch(':id')
  @ParseProfileFormData()
  @ApiBody({ type: UpdateProfileDTO })
  @ApiParam({ type: ProfileIdDTO, name: 'id' })
  @ApiOkResponse({ type: ProfileDTO })
  async update(
    @Param() idDto: ProfileIdDTO,
    @Body() updateDto: UpdateProfileDTO,
  ) {
    return await this.profileService.update(updateDto, idDto);
  }

  @Delete(':id/avatar')
  @ApiParam({ type: ProfileIdDTO, name: 'id' })
  @ApiOkResponse({ type: ProfileDTO })
  async deleteAvatar(@Param() idDto: ProfileIdDTO) {
    return await this.profileService.deleteAvatar(idDto);
  }
}
