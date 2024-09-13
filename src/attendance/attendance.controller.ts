import { Body, Get, Post, Request } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { MemberJwtController } from 'src/utils/decorators/jwt-controller';
import { ApiOperation } from '@nestjs/swagger';
import { SkipJwtAuthGuard } from 'src/utils/guards/skip-jwt-auth-guard';
import { RestMethod } from 'src/utils/decorators/rest-method';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

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

  // @Post('test')
  // @SkipJwtAuthGuard
  // test() {
  //   return this.attendanceService.postTest();
  // }

  // @Get('test')
  // @SkipJwtAuthGuard
  // getTest() {
  //   return this.attendanceService.getTest();
  // }
}
