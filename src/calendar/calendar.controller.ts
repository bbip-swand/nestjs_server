import { Body, Get, Param, Post, Put, Query, Request } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MemberJwtController } from 'src/utils/decorators/jwt-controller';
import { RestMethod } from 'src/utils/decorators/rest-method';
import { CalendarService } from './calendar.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleInfoResponseDto } from './dto/scheduleInfo-response.dto';

@MemberJwtController('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('list')
  @ApiOperation({
    summary: '연도 및 월별 캘린더 일정 조회',
    description: '메인 캘린더 뷰에서 호출, 아무것도 없을 시 [] 반환',
  })
  @ApiQuery({ name: 'year' })
  @ApiQuery({ name: 'month' })
  @RestMethod({
    response: ScheduleInfoResponseDto,
  })
  async getCalendarListByMonth(
    @Query('year') year: number,
    @Query('month') month: number,
    @Request() req,
  ) {
    return this.calendarService.getCalendarListByMonth(year, month, req.user);
  }

  // @Get('list/:date')
  // @ApiOperation({
  //   summary: '특정 날짜 일정 목록 조회',
  //   description: 'date예시 : 2024-09-16, 아무것도 없을 시 [] 반환',
  // })
  // @RestMethod({
  //   response: ScheduleInfoResponseDto,
  // })
  // async getScheduleList(@Param('date') date: string, @Request() req) {
  //   return this.calendarService.getScheduleList(date, req.user);
  // }

  @Get('schedule/upcoming')
  @ApiOperation({
    summary: '다가오는 일정 조회',
    description: '메인 홈에서 호출, 없으면 [] 반환',
  })
  @RestMethod({
    response: ScheduleInfoResponseDto,
  })
  async getUpcomingSchedule(@Request() req) {
    return this.calendarService.getUpcomingSchedule(req.user);
  }

  @Post('create')
  @ApiOperation({ summary: '일정 생성' })
  @RestMethod({
    request: CreateScheduleDto,
  })
  async createSchedule(
    @Request() req,
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    return this.calendarService.createSchedule(createScheduleDto, req.user);
  }

  @Put('update/:scheduleId')
  @ApiOperation({ summary: '일정 수정' })
  @RestMethod({
    request: CreateScheduleDto,
  })
  async updateSchedule(
    @Param('scheduleId') scheduleId: string,
    @Body() updateScheduleDto: CreateScheduleDto,
    @Request() req,
  ) {
    return this.calendarService.updateSchedule(
      scheduleId,
      updateScheduleDto,
      req.user,
    );
  }
}
