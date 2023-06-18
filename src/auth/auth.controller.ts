import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDTO } from './dto/user-credentials.dto';
import { User } from './decorators/user.decorator';
import { LoginResultDTO } from './dto/login-result.dto';
import { AccessJwtClaimsDTO } from './dto/jwt-claims.dto';
import { UseJwtAuthGuard } from './decorators/use-jwt-auth-guard.decorator';

@Controller('auth')
// @UseRequestValidation()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(
    @Body() userCredentialsDTO: UserCredentialsDTO,
  ): Promise<LoginResultDTO> {
    return await this.authService.registerUser(userCredentialsDTO);
  }

  @Post('login')
  async loginUser(
    @Body() userCredentialsDTO: UserCredentialsDTO,
  ): Promise<LoginResultDTO> {
    return await this.authService.loginByCredentials(userCredentialsDTO);
  }

  // Example & test
  @UseJwtAuthGuard()
  @Post('access-jwt-guard/')
  async checkAuthGuard(@User() user: AccessJwtClaimsDTO): Promise<any> {
    return user;
  }
}
