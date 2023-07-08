import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
import { UseRequestValidation } from 'src/utils/validation/use-request-validation.decorator';
import {
  UserActivationKeyDTO,
  UserEmailDTO,
  UserRecoveryPasswordKeyDTO,
} from './dto/params.dto';
import { UserService } from './user.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  ActivationKeyNotValidException,
  PasswordRecoveryKeyNotValidException,
  UserAlreadyActivatedException,
  UserAlreadyExistsException,
  UserDoesNotExistsException,
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
import { RecoveryPasswordDTO } from './dto/recovery-password.dto';
import { UseResponseSerializer } from 'src/utils/serialization/use-response-serializer.decorator';
import { User } from '@prisma/client';
import { UserRecoveryPasswordKey } from './types';

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
    return await this.userService.create(userCredentialsDTO);
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
  async activationProxy(@Param() activationDTO: UserActivationKeyDTO) {
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

  @Post('pass-recovery-init/:email')
  @UseRequestValidation()
  @UseResponseSerializer(UserEmailDTO)
  @ApiParam({ name: 'email', type: UserEmailDTO })
  @ApiException(() => UserDoesNotExistsException)
  @ApiCreatedResponse({ type: UserEmailDTO })
  async initPasswordRecovering(@Param() emailDto: UserEmailDTO): Promise<User> {
    return await this.userService.initPasswordRecovering(emailDto);
  }

  @Get('pass-recovery-proxy/:recoveryPasswordKey')
  @UseRequestValidation()
  @ApiParam({ name: 'recoveryPasswordKey', type: UserActivationKeyDTO })
  @ApiException(() => [ActivationKeyNotValidException])
  @ApiCreatedResponse({ type: ActivationUserResponseDTO })
  async passwordRecoveringProxy(@Param() recoveryDTO: UserRecoveryPasswordKey) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(
          `${this.serverConfig.protocol}://${this.serverConfig.host}:${this.serverConfig.port}/user/pass-recovery`,
          { data: recoveryDTO },
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(error.response.data, error.response.status);
          }),
        ),
    );
    return data;
  }

  @Get('pass-recovery')
  @UseRequestValidation()
  @UseResponseSerializer(UserRecoveryPasswordKeyDTO)
  @ApiBody({ type: UserRecoveryPasswordKeyDTO })
  @ApiException(() => PasswordRecoveryKeyNotValidException)
  @ApiOkResponse({ type: UserRecoveryPasswordKeyDTO })
  async checkPasswordRecoveryKey(
    @Body() keyDto: UserRecoveryPasswordKeyDTO,
  ): Promise<User> {
    return await this.userService.validatePasswordRecoveryKey(keyDto);
  }

  @Post('pass-recovery')
  @UseRequestValidation()
  @UseResponseSerializer(UserEmailDTO)
  @ApiBody({ type: RecoveryPasswordDTO })
  @ApiException(() => PasswordRecoveryKeyNotValidException)
  @ApiCreatedResponse({ type: UserEmailDTO })
  async finishPasswordRecovering(
    @Body() recoveryDto: RecoveryPasswordDTO,
  ): Promise<User> {
    return await this.userService.finishPasswordRecovering(recoveryDto);
  }
}
