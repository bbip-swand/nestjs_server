import { Body, Get, Post, Put, Request } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MemberJwtController } from 'src/utils/decorators/jwt-controller';
import { RestMethod } from 'src/utils/decorators/rest-method';
import { SkipJwtAuthGuard } from 'src/utils/guards/skip-jwt-auth-guard';
import { UsersService } from './users.service';
import {
  AppleSignupRequestDto,
  AppleSignupResponseDto,
  FcmRequestDto,
  isNewUserResponseDto,
  userInfoRequestDto,
} from './dto';

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

  @Post('resign/apple')
  @ApiOperation({ summary: 'Apple 회원탈퇴' })
  async appleResign(@Request() req) {
    const result = await this.usersService.appleResign(req.user);
    return result;
  }

  @Post('fcmToken')
  @ApiOperation({ summary: 'Get FCM Token' })
  @RestMethod({
    request: FcmRequestDto,
  })
  async getFcmToken(@Body() dto: FcmRequestDto, @Request() req) {
    const result = await this.usersService.updateFcmToken(
      req.user.dbUserId,
      dto.fcmToken,
    );
    return result;
  }

  @Get('info')
  @ApiOperation({ summary: '유저 정보 조회' })
  @RestMethod({
    response: userInfoRequestDto,
  })
  async getUserInfo(@Request() req) {
    const result = await this.usersService.getUserInfo(req.user);
    return result;
  }

  @Post('create/info')
  @ApiOperation({
    summary: '유저 정보 생성',
    description: 'location이 2개만 온다면, 2개만 보내도 됨(null 필요 x)',
  })
  @RestMethod({
    request: userInfoRequestDto,
  })
  async createUserInfo(@Body() dto: userInfoRequestDto, @Request() req) {
    const result = await this.usersService.createUserInfo(dto, req.user);
    return result;
  }

  @Put('update/info')
  @ApiOperation({
    summary: '유저 정보 수정',
    description: 'location이 2개만 온다면, 2개만 보내도 됨(null 필요 x)',
  })
  @RestMethod({
    request: userInfoRequestDto,
  })
  async updateUserInfo(@Body() dto: userInfoRequestDto, @Request() req) {
    const result = await this.usersService.updateUserInfo(dto, req.user);
    return result;
  }

  @Get('check/new-user')
  @ApiOperation({ summary: '신규 유저인지 확인' })
  @RestMethod({
    response: isNewUserResponseDto,
  })
  async checkNewUser(@Request() req) {
    const result = await this.usersService.checkNewUser(req.user);
    return result;
  }
}
