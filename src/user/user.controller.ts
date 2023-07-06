import { Body, Controller, Param, Post } from '@nestjs/common';
import { UseRequestValidation } from 'src/utils/validation/use-request-validation.decorator';
import { UserActivationKeyDTO, UserEmailDTO } from './dto/params.dto';
import { UserService } from './user.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  ActivationKeyNotValidException,
  UserAlreadyActivatedException,
  UserAlreadyExistsException,
} from './user.exceptions';
import { OnlyPublicAccess } from 'src/auth/decorators/public-access.decorator';
import { CreateUserAndProfileDTO } from './dto/create-user-and-profile.dto';
import { CreateUserResponseDTO } from './dto/create-user-response.dto';
import { ActivationUserResponseDTO } from './dto/activation-user-response.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  @OnlyPublicAccess()
  @UseRequestValidation()
  @ApiBody({ type: CreateUserAndProfileDTO })
  @ApiCreatedResponse({ type: CreateUserResponseDTO })
  @ApiException(() => UserAlreadyExistsException)
  async register(
    @Body() userCredentialsDTO: CreateUserAndProfileDTO,
  ): Promise<CreateUserResponseDTO> {
    return await this.userService.registerUser(userCredentialsDTO);
  }

  @Post('activate/:activationKey')
  @ApiParam({ name: 'activationKey', type: UserActivationKeyDTO })
  @ApiException(() => [ActivationKeyNotValidException])
  @ApiCreatedResponse({ type: ActivationUserResponseDTO })
  @UseRequestValidation()
  async activate(@Param() activationDTO: UserActivationKeyDTO) {
    return await this.userService.acivateByKey(activationDTO);
  }

  @Post('renew-activation-key/:email')
  @ApiParam({ name: 'email', type: UserEmailDTO })
  @ApiException(() => [UserAlreadyActivatedException])
  @ApiCreatedResponse({ type: ActivationUserResponseDTO })
  @UseRequestValidation()
  async renewActivationKey(@Param() emailDto: UserEmailDTO) {
    return await this.userService.renewActivationKey(emailDto);
  }
}
