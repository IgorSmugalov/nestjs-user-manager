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
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { SERVER_CONFIG } from 'src/config/const';
import { IServerConfig } from 'src/config/server.congfig';
import { UseResponseSerializer } from 'src/lib/serialization/use-response-serializer.decorator';
import { UseRequestValidation } from 'src/lib/validation/use-request-validation.decorator';
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
import { UserActivationKey } from './types';
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
  @UseRequestValidation()
  @UseResponseSerializer(UserResponseDTO)
  @ApiBody({ type: CreateUserAndProfileDTO })
  @ApiCreatedResponse({ type: UserResponseDTO })
  @ApiException(() => UserAlreadyExistsException)
  async register(@Body() createDto: CreateUserAndProfileDTO): Promise<User> {
    return await this.userService.create(createDto);
  }

  @Get(':id')
  @UseRequestValidation()
  @UseResponseSerializer(UserResponseDTO)
  @ApiOkResponse({ type: UserResponseDTO })
  @ApiException(() => UserDoesNotExistsException)
  async getById(@Param() userId: UserIdDTO): Promise<User> {
    return await this.userService.get(userId, { throwOnNotFound: true });
  }

  @Post('activate/:activationKey')
  @UseRequestValidation()
  @UseResponseSerializer(ActivationUserResponseDTO)
  @ApiCreatedResponse({ type: ActivationUserResponseDTO })
  @ApiException(() => ActivationKeyNotValidException)
  async activate(@Param() activationDTO: UserActivationKeyDTO): Promise<User> {
    return await this.userService.acivateByKey(activationDTO);
  }

  @Post('renew-activation-key/:email')
  @UseRequestValidation()
  @UseResponseSerializer(ActivationUserResponseDTO)
  @ApiCreatedResponse({ type: ActivationUserResponseDTO })
  @ApiException(() => [
    UserAlreadyActivatedException,
    UserDoesNotExistsException,
  ])
  async renewActivationKey(@Param() emailDto: UserEmailDTO) {
    return await this.userService.renewActivationKey(emailDto);
  }

  @Get('email-activation-proxy/:activationKey')
  @UseRequestValidation()
  @UseResponseSerializer(ActivationUserResponseDTO)
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
  @ApiCreatedResponse({ type: UserEmailDTO })
  @ApiException(() => UserDoesNotExistsException)
  async initPasswordRecovering(@Param() emailDto: UserEmailDTO): Promise<User> {
    return await this.userService.initPasswordRecovering(emailDto);
  }

  @Get('pass-recovery/:recoveryPasswordKey')
  @UseRequestValidation()
  @UseResponseSerializer(UserRecoveryPasswordKeyDTO)
  @ApiOkResponse({ type: UserRecoveryPasswordKeyDTO })
  @ApiException(() => PasswordRecoveryKeyNotValidException)
  async checkPasswordRecoveryKey(
    @Param() keyDto: UserRecoveryPasswordKeyDTO,
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
