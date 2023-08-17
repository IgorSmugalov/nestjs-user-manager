import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
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
import { User as AuthenticatedUser } from 'src/auth/decorators/user.decorator';
import { AuthenticatedUserDTO } from 'src/auth/dto/authenticated-user.dto';
import { SERVER_CONFIG } from 'src/config/const';
import { IServerConfig } from 'src/config/server.congfig';
import { IncorrectPasswordException } from 'src/crypto/exceptions/password.exceptions';
import { UseResponseSerializer } from 'src/lib/serialization/use-response-serializer.decorator';
import { UseRequestValidation } from 'src/lib/validation/use-request-validation.decorator';
import {
  UserActivationKeyDTO,
  UserEmailDTO,
  UserIdDTO,
  UserRecoveryPasswordKeyDTO,
} from './dto';
import { ActivationUserResponseDTO } from './dto/activation-user-response.dto';
import { RecoveryPasswordDTO } from './dto/recovery-password.dto';
import { SignUpDTO } from './dto/sign-up.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserResponseDTO } from './dto/user-response.dto';
import {
  ActivationKeyNotValidException,
  EmailAlreadyInUseException,
  PasswordRecoveryKeyNotValidException,
  UserAlreadyActivatedException,
  UserAlreadyExistsException,
  UserDoesNotExistsException,
} from './user.exceptions';
import { UserService } from './user.service';
import { UserActivationKey } from './user.types';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}
  private readonly serverConfig =
    this.configService.get<IServerConfig>(SERVER_CONFIG);

  @ApiTags('User')
  @Post('sign-up')
  @UseRequestValidation()
  @UseResponseSerializer(UserResponseDTO)
  @ApiBody({ type: SignUpDTO })
  @ApiCreatedResponse({ type: UserResponseDTO })
  @ApiException(() => UserAlreadyExistsException)
  async register(@Body() signUpDto: SignUpDTO): Promise<User> {
    return await this.userService.signUp(signUpDto);
  }

  @ApiTags('User')
  @Get(':id')
  @UseRequestValidation()
  @UseResponseSerializer(UserResponseDTO)
  @ApiOkResponse({ type: UserResponseDTO })
  @ApiException(() => UserDoesNotExistsException)
  async getById(@Param() userId: UserIdDTO): Promise<User> {
    return await this.userService.getUnique(userId);
  }

  @Patch(':id')
  @UseRequestValidation()
  @UseResponseSerializer(UserResponseDTO)
  @ApiOkResponse({ type: UserResponseDTO })
  @ApiException(() => [UserDoesNotExistsException, EmailAlreadyInUseException])
  async updateUser(
    @Param() idDto: UserIdDTO,
    @Body() updateDto: UpdateUserDTO,
  ) {
    return this.userService.updateUser(idDto, updateDto);
  }

  @ApiTags('User/activation')
  @Post('activate/:activationKey')
  @UseRequestValidation()
  @UseResponseSerializer(ActivationUserResponseDTO)
  @ApiCreatedResponse({ type: ActivationUserResponseDTO })
  @ApiException(() => ActivationKeyNotValidException)
  async activate(@Param() activationDTO: UserActivationKeyDTO): Promise<User> {
    return await this.userService.acivateByKey(activationDTO);
  }

  @ApiTags('User/activation')
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

  @ApiTags('User/password')
  @Post('update-password')
  @UseRequestValidation()
  @UseResponseSerializer(UserResponseDTO)
  @ApiBody({ type: UpdatePasswordDTO })
  @ApiCreatedResponse({ type: UserResponseDTO })
  @ApiException(() => [UserDoesNotExistsException, IncorrectPasswordException])
  async updatePassword(
    @AuthenticatedUser() userDto: AuthenticatedUserDTO,
    @Body() updateDto: UpdatePasswordDTO,
  ): Promise<User> {
    return await this.userService.updatePassword(userDto, updateDto);
  }

  @ApiTags('User/password')
  @Post('pass-recovery-init/:email')
  @UseRequestValidation()
  @UseResponseSerializer(UserEmailDTO)
  @ApiCreatedResponse({ type: UserEmailDTO })
  @ApiException(() => UserDoesNotExistsException)
  async initPasswordRecovering(@Param() emailDto: UserEmailDTO): Promise<User> {
    return await this.userService.initPasswordRecovering(emailDto);
  }

  @ApiTags('User/password')
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

  @ApiTags('User/password')
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

  // Temporary: for activation link from email -> redirect from GET to POST api, in future this logic can be moved to frontend
  @ApiTags('User/activation')
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
}
