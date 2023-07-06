import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDTO } from './dto/credentials.dto';
import { Response } from 'express';
import { UseRequestValidation } from 'src/utils/validation/use-request-validation.decorator';
import { RefreshedAccess } from './decorators/refreshed-access.decorator';
import { RefreshedUser } from './decorators/refreshed-user.decorator';
import { RefreshJwtClaimsDTO } from './dto/jwt-claims-refresh.dto';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { TokensDTO } from './dto/auth-data.dto';
import { OnlyPublicAccess } from './decorators/public-access.decorator';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { IncorrectCredentialsException } from './auth.exceptions';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @OnlyPublicAccess()
  @UseRequestValidation()
  @ApiBody({ type: CredentialsDTO })
  @ApiCreatedResponse({ type: TokensDTO })
  @ApiException(() => IncorrectCredentialsException)
  async login(
    @Body() userCredentialsDTO: CredentialsDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.auth.authByCredentials(userCredentialsDTO);
    this.auth.setAuthCookie(res, tokens.refreshToken);
    return new TokensDTO(tokens);
  }

  @Post('refresh')
  @RefreshedAccess()
  @UseRequestValidation()
  @ApiCreatedResponse({ type: TokensDTO })
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
  async logout(
    @RefreshedUser() user: RefreshJwtClaimsDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    this.auth.clearAuthCookie(res);
    await this.auth.logout(user);
    return 'ok';
  }
}
