import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDTO } from './dto/credentials.dto';
import { Response } from 'express';
import { UseRequestValidation } from 'src/lib/validation/use-request-validation.decorator';
import { UseRefreshCookieGuard } from './decorators/use-refresh-cookie-guard.decorator';
import { RefreshedUser } from './decorators/refreshed-user.decorator';
import { RefreshJwtClaimsDTO } from './dto/jwt-claims-refresh.dto';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  IncorrectCredentialsException,
  IncorrectRefreshTokenException,
  UserNotActivatedException,
} from './auth.exceptions';
import { UseResponseSerializer } from 'src/lib/serialization/use-response-serializer.decorator';
import { SignInResponseDTO } from './dto/sign-in-response.dto';
import { SignOutResponseDTO } from './dto/sign-out-response.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('sign-in')
  @UseRequestValidation()
  @UseResponseSerializer(SignInResponseDTO)
  @ApiBody({ type: CredentialsDTO })
  @ApiCreatedResponse({ type: SignInResponseDTO })
  @ApiException(() => [
    IncorrectCredentialsException,
    IncorrectRefreshTokenException,
    UserNotActivatedException,
  ])
  async login(
    @Body() userCredentialsDTO: CredentialsDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.auth.authByCredentials(userCredentialsDTO);
    this.auth.setAuthCookie(res, tokens.refreshToken);
    return tokens;
  }

  @Post('refresh')
  @UseRefreshCookieGuard()
  @UseRequestValidation()
  @UseResponseSerializer(SignInResponseDTO)
  @ApiCreatedResponse({ type: SignInResponseDTO })
  @ApiException(() => [
    IncorrectRefreshTokenException,
    UserNotActivatedException,
  ])
  async refresh(
    @RefreshedUser() user: RefreshJwtClaimsDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authResult = await this.auth.authByRefreshToken(user);
    this.auth.setAuthCookie(res, authResult.refreshToken);
    return authResult;
  }

  @Post('sign-out')
  @UseRefreshCookieGuard()
  @UseRequestValidation()
  @UseResponseSerializer(SignOutResponseDTO)
  @ApiCreatedResponse({ type: SignOutResponseDTO })
  async logout(
    @RefreshedUser() user: RefreshJwtClaimsDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    this.auth.clearAuthCookie(res);
    return await this.auth.logout(user);
  }
}
