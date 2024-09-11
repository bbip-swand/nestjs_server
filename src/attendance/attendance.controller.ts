import { Get, Post, Request } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { MemberJwtController } from 'src/utils/decorators/jwt-controller';
import { ApiOperation } from '@nestjs/swagger';

@MemberJwtController('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('create')
  @ApiOperation({ summary: '출석 생성' })
  createAttendance(@Request() req) {
    return this.attendanceService.createAttendance(req.user);
  }
}
