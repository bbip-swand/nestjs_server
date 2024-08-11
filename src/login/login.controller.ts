import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { LoginService } from './login.service';
import { access } from 'fs';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('auth/apple')
  @ApiOperation({ summary: 'Apple 로그인' })
  async login(@Body() @Request() req) {
    const idToken = req.body;
    return await this.loginService.appleLogin(idToken);
  }

  @Get()
  findAll() {
    return this.loginService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loginService.findOne(+id);
  }
}
