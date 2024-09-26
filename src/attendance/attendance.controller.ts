import { Body, Get, HttpStatus, Param, Post, Request } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { MemberJwtController } from 'src/utils/decorators/jwt-controller';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RestMethod } from 'src/utils/decorators/rest-method';
import { CreateAttendanceDto } from './dto/create-attendance-request.dto';
import { CheckAttendanceResponseDto } from './dto/check-attendance-response.dto';
import { ApplyAttendanceRequestDto } from './dto/apply-attendance-request.dto';
import { CreateAttendanceResponseDto } from './dto/create-attendance-response.dto';
import { AttendanceRecordsResponseDto } from './dto/attendanceRecords-response.dto';

@MemberJwtController('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('create')
  @ApiOperation({ summary: '출석 생성' })
  @RestMethod({
    request: CreateAttendanceDto,
    response: CreateAttendanceResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Study Info Not Found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Study Info Not Found',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not Study Leader',
    schema: {
      example: {
        statusCode: 403,
        message: 'Not Study Leader',
      },
    },
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
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '출결 진행중 아닐때 반환',
    schema: {
      example: {
        statusCode: 404,
        message: 'Attendance Not Found',
      },
    },
  })
  checkAttendanceStatus(@Request() req) {
    return this.attendanceService.checkAttendanceStatus(req.user);
  }

  @Get('records/:studyId')
  @ApiOperation({
    summary: '출석 현황 조회',
    description: '스터디 홈에서 출석 현황을 조회할 때 사용하는 api',
  })
  @RestMethod({
    response: AttendanceRecordsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '출결 기록이 없을 때 반환',
    schema: {
      example: {
        statusCode: 404,
        message: 'No attendance records found',
      },
    },
  })
  checkAttendanceRecords(@Param('studyId') studyId: string, @Request() req) {
    return this.attendanceService.checkAttendanceRecords(studyId, req.user);
  }

  @Post('apply')
  @ApiOperation({ summary: '출석 인증 코드 입력' })
  @RestMethod({
    request: ApplyAttendanceRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    schema: {
      example: {
        message: 'Success',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Attendance Timeout',
    schema: {
      example: {
        statusCode: 403,
        message: 'Attendance Timeout',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid Code',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid Code',
      },
    },
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
