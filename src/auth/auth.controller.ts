import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDTO } from './dto/credentials.dto';
import { Response } from 'express';
import { UseRequestValidation } from 'src/lib/validation/use-request-validation.decorator';
import { RefreshedAccess } from './decorators/refreshed-access.decorator';
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
import { AuthSignInResponseDTO } from './dto/auth-sign-in-response.dto';
import { AuthSignOutResponseDTO } from './dto/auth-sign-out-response.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @UseRequestValidation()
  @UseResponseSerializer(AuthSignInResponseDTO)
  @ApiBody({ type: CredentialsDTO })
  @ApiCreatedResponse({ type: AuthSignInResponseDTO })
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
  @RefreshedAccess()
  @UseRequestValidation()
  @UseResponseSerializer(AuthSignInResponseDTO)
  @ApiCreatedResponse({ type: AuthSignInResponseDTO })
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

  @Post('logout')
  @RefreshedAccess()
  @UseRequestValidation()
  @UseResponseSerializer(AuthSignOutResponseDTO)
  @ApiCreatedResponse({ type: AuthSignOutResponseDTO })
  async logout(
    @RefreshedUser() user: RefreshJwtClaimsDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    this.auth.clearAuthCookie(res);
    return await this.auth.logout(user);
  }
}
