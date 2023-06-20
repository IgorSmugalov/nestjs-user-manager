import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Res,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDTO } from './dto/user-credentials.dto';
import { AuthResultDTO } from './dto/auth-result.dto';
import { Response } from 'express';
import { UseRequestValidation } from 'src/utils/validation/use-request-validation.decorator';
import { UseRefreshJwtGuard } from './decorators/use-refresh-jwt-guard.decorator';
import { RefreshedUser } from './decorators/refreshed-user.decorator';
import { RefreshJwtClaimsDTO } from './dto/refresh-jwt-claims.dto';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UseResponseSerializer } from 'src/utils/serialization/use-response-serializer.decorator';

@Controller('auth')
@ApiTags('Auth')
@UseRequestValidation()
@UseResponseSerializer()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: UserCredentialsDTO })
  @ApiCreatedResponse({ type: AuthResultDTO })
  async registerUser(
    @Body() userCredentialsDTO: UserCredentialsDTO,
  ): Promise<AuthResultDTO> {
    return new AuthResultDTO(
      await this.authService.registerUser(userCredentialsDTO),
    );
  }

  @Post('login')
  @ApiBody({ type: UserCredentialsDTO })
  @ApiCreatedResponse({ type: AuthResultDTO })
  async loginUser(
    @Body() userCredentialsDTO: UserCredentialsDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResultDTO> {
    const tokens = await this.authService.authByCredentials(userCredentialsDTO);
    this.authService.setAuthCookie(res, tokens.refreshToken);
    return new AuthResultDTO(tokens);
  }

  @Post('refresh')
  @UseRefreshJwtGuard()
  @ApiCreatedResponse({ type: AuthResultDTO })
  async refreshTokens(
    @RefreshedUser() user: RefreshJwtClaimsDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResultDTO> {
    const tokens = await this.authService.authByRefreshToken(user);
    this.authService.setAuthCookie(res, tokens.refreshToken);
    return tokens;
  }

  @Post('logout')
  @UseRefreshJwtGuard()
  async logout(
    @RefreshedUser() user: RefreshJwtClaimsDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    this.authService.clearauthCookie(res);
    return;
  }
}
