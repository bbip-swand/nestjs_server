import { Body, Post, Put, Request } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MemberJwtController } from 'src/utils/decorators/jwt-controller';
import { RestMethod } from 'src/utils/decorators/rest-method';
import { SkipJwtAuthGuard } from 'src/utils/guards/skip-jwt-auth-guard';
import { AppleSignupRequestDto } from './dto/apple-signup-request.dto';
import { AppleSignupResponseDto } from './dto/apple-signup-response.dto';
import { userInfoRequestDto } from './dto/user-info-request.dto';
import { UsersService } from './users.service';

@MemberJwtController('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup/apple')
  @SkipJwtAuthGuard
  @ApiOperation({ summary: 'Apple 회원가입' })
  @RestMethod({
    request: AppleSignupRequestDto,
    response: AppleSignupResponseDto,
  })
  async appleSignup(
    @Body() dto: AppleSignupRequestDto,
    // ): Promise<AppleSignupResponseDto> {
  ) {
    const result = await this.usersService.appleSignup(dto);
    return result;
  }

  @Post('info')
  @ApiOperation({ summary: '유저 정보 생성' })
  @RestMethod({
    request: userInfoRequestDto,
  })
  async createUserInfo(@Body() dto: userInfoRequestDto, @Request() req) {
    const result = await this.usersService.createUserInfo(dto, req.user);
    return result;
  }

  @Put('info')
  @ApiOperation({ summary: '유저 정보 수정' })
  @RestMethod({
    request: userInfoRequestDto,
  })
  async updateUserInfo(@Body() dto: userInfoRequestDto, @Request() req) {
    const result = await this.usersService.updateUserInfo(dto, req.user);
    return result;
  }
}
