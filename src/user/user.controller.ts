import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
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
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { IServerConfig } from 'src/config/server.congfig';
import { SERVER_CONFIG } from 'src/config/const';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    private userService: UserService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}
  private readonly serverConfig =
    this.configService.get<IServerConfig>(SERVER_CONFIG);

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

  @Get('email-activation-proxy/:activationKey')
  @UseRequestValidation()
  @ApiParam({ name: 'activationKey', type: UserActivationKeyDTO })
  @ApiException(() => [ActivationKeyNotValidException])
  @ApiCreatedResponse({ type: ActivationUserResponseDTO })
  async redirect(@Param() activationDTO: UserActivationKeyDTO) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(
          `${this.serverConfig.protocol}://${this.serverConfig.host}:${this.serverConfig.port}/user/activate/${activationDTO.activationKey}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(error.response.data, error.response.status);
          }),
        ),
    );
    return data;
  }
}
