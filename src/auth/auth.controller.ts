import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RestMethod } from 'src/utils/decorators/rest-method';
import { LocalAuthGuard } from 'src/utils/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { AppleLoginRequestDto } from './dto/apple-login-request.dto';
import { AppleLoginResponseDto } from './dto/apple-login-response';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/apple')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Apple 로그인' })
  @RestMethod({
    request: AppleLoginRequestDto,
    response: AppleLoginResponseDto,
  })
  async appleLogin(@Body() body: AppleLoginRequestDto, @Request() req) {
    // ): Promise<AppleLoginResponseDto> {
    return await this.authService.appleLogin(req.user);
  }
}
