import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDTO } from './dto/credentials.dto';
import { Response } from 'express';
import { UseRequestValidation } from 'src/utils/validation/use-request-validation.decorator';
import { UseRefreshJwtGuard } from './decorators/use-refresh-jwt-guard.decorator';
import { RefreshedUser } from './decorators/refreshed-user.decorator';
import { RefreshJwtClaimsDTO } from './dto/jwt-claims-refresh.dto';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserAndProfileDTO } from 'src/user/dto/create-user-and-profile.dto';
import { TokensDTO } from './dto/auth-data.dto';

@Controller('auth')
@ApiTags('Auth')
@UseRequestValidation()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiBody({ type: CreateUserAndProfileDTO })
  @ApiCreatedResponse({ type: TokensDTO })
  async register(
    @Body() userCredentialsDTO: CreateUserAndProfileDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TokensDTO> {
    const authResult = await this.auth.registerUser(userCredentialsDTO);
    this.auth.setAuthCookie(res, authResult.refreshToken);
    return authResult;
  }

  @Post('login')
  @ApiBody({ type: CredentialsDTO })
  @ApiCreatedResponse({ type: TokensDTO })
  async login(
    @Body() userCredentialsDTO: CredentialsDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.auth.authByCredentials(userCredentialsDTO);
    this.auth.setAuthCookie(res, tokens.refreshToken);
    return new TokensDTO(tokens);
  }

  @Post('refresh')
  @UseRefreshJwtGuard()
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
  @UseRefreshJwtGuard()
  async logout(@Res({ passthrough: true }) res: Response): Promise<void> {
    this.auth.clearAuthCookie(res);
    return;
  }
}
