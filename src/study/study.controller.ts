import {
  Body,
  Get,
  Param,
  Post,
  Put,
  Request,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MemberJwtController } from 'src/utils/decorators/jwt-controller';
import { RestMethod } from 'src/utils/decorators/rest-method';
import { SkipJwtAuthGuard } from 'src/utils/guards/skip-jwt-auth-guard';
import { StudyService } from './study.service';
import { CreateStudyDto } from './dto/create-study.dto';
import { IndividualStudyResponseDto } from './dto/individual-study-response.dto';
import { pendingstudyResponseDto } from './dto/pending-study-response.dto';
import { StudyInviteResponseDto } from './dto/study-invite-response.dto';
import { StudyBriefInfoResponseDto } from './dto/studyBriefInfo-response.dto';
import { StudyInfoDto } from './dto/studyInfo-response.dto';
import { UpdatePlaceRequestDto } from './dto/update-place-request.dto';
import { UpdateStudyInfoDto } from './dto/update-studyInfo.dto';
import { LeaveStudyDto } from './dto/leave-study.dto';

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
  findOne(@Param('studyId') studyId: string, @Request() req) {
    return this.studyService.findOne(studyId, req.user);
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

  @Get('/pending')
  @ApiOperation({ summary: '가장 임박한 스터디 조회' })
  @RestMethod({
    response: pendingstudyResponseDto,
  })
  findPendingStudy(@Request() req) {
    return this.studyService.findPendingStudy(req.user);
  }

  @Post('create')
  @ApiOperation({ summary: '스터디 생성' })
  @RestMethod({
    request: CreateStudyDto,
  })
  createStudy(@Body() studyInfoDto: CreateStudyDto, @Request() req) {
    return this.studyService.createStudyInfo(studyInfoDto, req.user);
  }

  @Post('/join/:studyId')
  @ApiOperation({ summary: '스터디 참여' })
  joinStudy(@Param('studyId') studyId: string, @Request() req) {
    return this.studyService.joinStudy(studyId, req.user);
  }

  @Put('/place/:studyId')
  @ApiOperation({ summary: '스터디 장소 수정' })
  @RestMethod({
    request: UpdatePlaceRequestDto,
  })
  updatePlace(
    @Param('studyId') studyId: string,
    @Request() req,
    @Body() dto: UpdatePlaceRequestDto,
  ) {
    return this.studyService.updatePlace(studyId, req.user, dto);
  }

  @Put('/update/:studyId')
  @ApiOperation({
    summary: '스터디 정보 수정',
    description: '스터디 장만 정보 수정 가능',
  })
  @RestMethod({
    request: UpdateStudyInfoDto,
  })
  updateStudyInfo(
    @Param('studyId') studyId: string,
    @Request() req,
    @Body() dto: UpdateStudyInfoDto,
  ) {
    return this.studyService.updateStudyInfo(studyId, req.user, dto);
  }

  @Delete('/leave/:studyId')
  @ApiOperation({
    summary: '스터디 탈퇴',
    description:
      '스터디장이 스터디를 탈퇴하게 되면 스터디가 삭제됩니다. 그 외 스터디원의 탈퇴는 스터디원만 삭제됩니다.',
  })
  @RestMethod({
    request: LeaveStudyDto,
    response: '탈퇴 완료',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '스터디/스터디원 정보가 존재하지 않습니다.',
    schema: {
      example: {
        statusCode: 404,
        message: '스터디/스터디원 정보가 존재하지 않습니다.',
      },
    },
  })
  leaveStudy(@Param('studyId') studyId: string, @Request() req) {
    return this.studyService.leaveStudy(studyId, req.user);
  }
}
