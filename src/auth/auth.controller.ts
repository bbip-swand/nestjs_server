import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RestMethod } from 'src/utils/decorators/rest-method';
// import { LocalAuthGuard } from 'src/utils/guards/local-auth.guard';
import { SkipJwtAuthGuard } from 'src/utils/guards/skip-jwt-auth-guard';
import { AuthService } from './auth.service';
import { AppleLoginRequestDto } from './dto/apple-login-request.dto';
import { AppleLoginResponseDto } from './dto/apple-login-response.dto';
import { LocalAuthGuard } from './local.strategy';
// import { LocalAuthGuard } from './local.strategy';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/apple')
  @UseGuards(LocalAuthGuard())
  @SkipJwtAuthGuard
  @ApiOperation({ summary: 'Apple 로그인' })
  @RestMethod({
    request: AppleLoginRequestDto,
    response: AppleLoginResponseDto,
  })
  async appleLogin(@Request() req): Promise<AppleLoginResponseDto> {
    const result = await this.authService.appleLogin(req.user);
    return result;
  }
}
