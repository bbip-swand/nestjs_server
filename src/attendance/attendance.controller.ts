import { Body, Get, Post, Request } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { MemberJwtController } from 'src/utils/decorators/jwt-controller';
import { ApiOperation } from '@nestjs/swagger';
import { RestMethod } from 'src/utils/decorators/rest-method';
import { CreateAttendanceDto } from './dto/create-attendance-request.dto';
import { CheckAttendanceResponseDto } from './dto/check-attendance-response.dto';
import { ApplyAttendanceRequestDto } from './dto/apply-attendance-request.dto';

@MemberJwtController('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('create')
  @ApiOperation({ summary: '출석 생성' })
  @RestMethod({
    request: CreateAttendanceDto,
  })
  createAttendance(
    @Body() createAttendanceDto: CreateAttendanceDto,
    @Request() req,
  ) {
    return this.attendanceService.createAttendance(
      createAttendanceDto,
      req.user,
    );
  }

  @Get('status')
  @ApiOperation({
    summary: '출석 인증 존재여부 확인',
    description: '홈화면에서 새로고침 시 불러옴',
  })
  @RestMethod({
    response: CheckAttendanceResponseDto,
  })
  checkAttendanceStatus(@Request() req) {
    return this.attendanceService.checkAttendanceStatus(req.user);
  }

  @Post('apply')
  @ApiOperation({ summary: '출석 인증 코드 입력' })
  @RestMethod({
    request: ApplyAttendanceRequestDto,
  })
  applyAttendanceCode(
    @Body() applyAttendanceDto: ApplyAttendanceRequestDto,
    @Request() req,
  ) {
    return this.attendanceService.applyAttendanceCode(
      applyAttendanceDto,
      req.user,
    );
  }
}
