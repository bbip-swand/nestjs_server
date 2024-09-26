import { Body, Get, Param, Post, Request } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MemberJwtController } from 'src/utils/decorators/jwt-controller';
import { RestMethod } from 'src/utils/decorators/rest-method';
import { SkipJwtAuthGuard } from 'src/utils/guards/skip-jwt-auth-guard';
import { CreateStudyDto } from './dto/create-study.dto';
import { IndividualStudyResponseDto } from './dto/individual-study-response.dto';
import { StudyInviteResponseDto } from './dto/study-invite-response.dto';
import { StudyBriefInfoResponseDto } from './dto/studyBriefInfo-response.dto';
import { StudyService } from './study.service';
import { StudyInfoDto } from './dto/studyInfo-response.dto';

@MemberJwtController('study')
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  @Get('/this-week')
  @ApiOperation({ summary: '금주 스터디 목록 조회' })
  @RestMethod({
    response: IndividualStudyResponseDto,
  })
  async findThisWeekStudyList(@Request() req) {
    return this.studyService.findThisWeekStudyList(req.user);
  }

  @Get('/search/:studyId')
  @ApiOperation({ summary: '스터디 단건 조회' })
  @RestMethod({
    response: StudyInfoDto,
  })
  findOne(@Param('studyId') studyId: string) {
    return this.studyService.findOne(studyId);
  }

  @Get('/invite-info/:inviteCode')
  @SkipJwtAuthGuard
  @ApiOperation({ summary: '스터디 초대 정보 조회' })
  @RestMethod({
    response: StudyInviteResponseDto,
  })
  findByInviteCode(@Param('inviteCode') inviteCode: string) {
    return this.studyService.findByInviteCode(inviteCode);
  }

  @Get('/inviteCode/:studyId')
  @ApiOperation({ summary: '스터디 초대 코드 조회' })
  getInviteCode(@Param('studyId') studyId: string, @Request() req) {
    return this.studyService.getInviteCode(studyId, req.user);
  }

  @Get('/ongoing')
  @ApiOperation({ summary: '진행중인 스터디 목록 조회' })
  @RestMethod({
    response: StudyBriefInfoResponseDto,
  })
  findOngoingStudyList(@Request() req) {
    return this.studyService.findOngoingStudyList(req.user);
  }

  @Get('/finished')
  @ApiOperation({ summary: '종료된 스터디 목록 조회' })
  @RestMethod({
    response: StudyBriefInfoResponseDto,
  })
  findFinishedStudyList(@Request() req) {
    return this.studyService.findFinishedStudyList(req.user);
  }

  @Post('create')
  @ApiOperation({ summary: '스터디 생성' })
  @RestMethod({
    request: CreateStudyDto,
  })
  createStudy(@Body() studyInfoDto: CreateStudyDto, @Request() req) {
    // eslint-disable-next-line prettier/prettier
    return this.studyService.createStudyInfo(studyInfoDto, req.user);
  }

  @Post('/join/:studyId')
  @ApiOperation({ summary: '스터디 참여' })
  joinStudy(@Param('studyId') studyId: string, @Request() req) {
    return this.studyService.joinStudy(studyId, req.user);
  }
}
