import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  @ApiOperation({ summary: 'Apple 로그인' })
  async login(@Body() @Request() req) {
    const accessToken = req.body;

    const { user } = await this.loginService.appleLogin(accessToken);

    return;
    // return this.loginService.appleLogin(createLoginDto);
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
