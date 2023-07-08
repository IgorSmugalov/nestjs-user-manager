import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { OnlyPublicAccess } from 'src/auth/decorators/public-access.decorator';
import { SERVER_CONFIG } from 'src/config/const';
import { IServerConfig } from 'src/config/server.congfig';
import { UseResponseSerializer } from 'src/utils/serialization/use-response-serializer.decorator';
import { UseRequestValidation } from 'src/utils/validation/use-request-validation.decorator';
import { ActivationUserResponseDTO } from './dto/activation-user-response.dto';
import { CreateUserAndProfileDTO } from './dto/create-user-and-profile.dto';
import {
  UserActivationKeyDTO,
  UserEmailDTO,
  UserIdDTO,
  UserRecoveryPasswordKeyDTO,
} from './dto/params.dto';
import { RecoveryPasswordDTO } from './dto/recovery-password.dto';
import { UserResponseDTO } from './dto/user-response.dto';
import { UserActivationKey, UserRecoveryPasswordKey } from './types';
import {
  ActivationKeyNotValidException,
  PasswordRecoveryKeyNotValidException,
  UserAlreadyActivatedException,
  UserAlreadyExistsException,
  UserDoesNotExistsException,
} from './user.exceptions';
import { UserService } from './user.service';

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
  @UseResponseSerializer(UserResponseDTO)
  @ApiBody({ type: CreateUserAndProfileDTO })
  @ApiException(() => UserAlreadyExistsException)
  @ApiCreatedResponse({ type: UserResponseDTO })
  async register(@Body() createDto: CreateUserAndProfileDTO): Promise<User> {
    return await this.userService.create(createDto);
  }

  @Get(':id')
  @UseRequestValidation()
  @UseResponseSerializer(UserResponseDTO)
  @ApiParam({ name: 'id', type: CreateUserAndProfileDTO })
  @ApiException(() => UserAlreadyExistsException)
  @ApiOkResponse({ type: UserResponseDTO })
  async getById(@Param() userId: UserIdDTO): Promise<User> {
    return await this.userService.get(userId, { throwOnNotFound: true });
  }

  @Post('activate/:activationKey')
  @UseRequestValidation()
  @UseResponseSerializer(ActivationUserResponseDTO)
  @ApiParam({ name: 'activationKey', type: UserActivationKeyDTO })
  @ApiCreatedResponse({ type: ActivationUserResponseDTO })
  @ApiException(() => ActivationKeyNotValidException)
  async activate(@Param() activationDTO: UserActivationKeyDTO): Promise<User> {
    return await this.userService.acivateByKey(activationDTO);
  }

  @Post('renew-activation-key/:email')
  @UseRequestValidation()
  @UseResponseSerializer(ActivationUserResponseDTO)
  @ApiParam({ name: 'email', type: UserEmailDTO })
  @ApiCreatedResponse({ type: ActivationUserResponseDTO })
  @ApiException(() => UserAlreadyActivatedException)
  async renewActivationKey(@Param() emailDto: UserEmailDTO) {
    return await this.userService.renewActivationKey(emailDto);
  }

  @Get('email-activation-proxy/:activationKey')
  @UseRequestValidation()
  @ApiParam({ name: 'activationKey', type: UserActivationKeyDTO })
  @ApiOkResponse({ type: ActivationUserResponseDTO })
  @ApiException(() => ActivationKeyNotValidException)
  async activationProxy(
    @Param() activationDTO: UserActivationKeyDTO,
  ): Promise<UserActivationKey> {
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
  @ApiCreatedResponse({ type: UserEmailDTO })
  @ApiException(() => UserDoesNotExistsException)
  async initPasswordRecovering(@Param() emailDto: UserEmailDTO): Promise<User> {
    return await this.userService.initPasswordRecovering(emailDto);
  }

  @Get('pass-recovery-proxy/:recoveryPasswordKey')
  @UseRequestValidation()
  @UseResponseSerializer(UserRecoveryPasswordKeyDTO)
  @ApiParam({ name: 'recoveryPasswordKey', type: UserActivationKeyDTO })
  @ApiOkResponse({ type: ActivationUserResponseDTO })
  @ApiException(() => ActivationKeyNotValidException)
  async passwordRecoveringProxy(
    @Param() recoveryDTO: UserRecoveryPasswordKey,
  ): Promise<UserRecoveryPasswordKey> {
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
  @ApiOkResponse({ type: UserRecoveryPasswordKeyDTO })
  @ApiException(() => PasswordRecoveryKeyNotValidException)
  async checkPasswordRecoveryKey(
    @Body() keyDto: UserRecoveryPasswordKeyDTO,
  ): Promise<User> {
    return await this.userService.validatePasswordRecoveryKey(keyDto);
  }

  @Post('pass-recovery')
  @UseRequestValidation()
  @UseResponseSerializer(UserEmailDTO)
  @ApiBody({ type: RecoveryPasswordDTO })
  @ApiCreatedResponse({ type: UserEmailDTO })
  @ApiException(() => PasswordRecoveryKeyNotValidException)
  async finishPasswordRecovering(
    @Body() recoveryDto: RecoveryPasswordDTO,
  ): Promise<User> {
    return await this.userService.finishPasswordRecovering(recoveryDto);
  }
}
