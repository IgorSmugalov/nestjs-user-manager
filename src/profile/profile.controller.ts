import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { ProfileIdDTO } from './dto/params.dto';
import { UseRequestValidation } from 'src/utils/validation/use-request-validation.decorator';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { ParseProfileFormData } from './decorators/ParseProfileFormData.decorator';

@Controller('profile')
@UseRequestValidation()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  @ApiParam({ type: ProfileIdDTO, name: 'id' })
  async findOne(@Param() dto: ProfileIdDTO) {
    console.log(dto);
    return await this.profileService.getById(dto);
  }

  @Patch(':id')
  @ParseProfileFormData()
  @ApiBody({ type: UpdateProfileDTO })
  @ApiParam({ type: ProfileIdDTO, name: 'id' })
  async update(
    @Param() idDto: ProfileIdDTO,
    @Body() updateProfileDto: UpdateProfileDTO,
  ) {
    return await this.profileService.update(updateProfileDto, idDto);
  }
}
