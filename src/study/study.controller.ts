import { Body, Get, Param, Post, Request } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MemberJwtController } from 'src/utils/decorators/jwt-controller';
import { RestMethod } from 'src/utils/decorators/rest-method';
import { StudyInfoDto } from './dto/create-study.dto';
import { StudyService } from './study.service';

@MemberJwtController('study')
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  @Get('/:studyId')
  @ApiOperation({ summary: '스터디 단건 조회' })
  findOne(@Param('studyId') studyId: string) {
    return this.studyService.findOne(studyId);
  }

  @Post('create')
  @ApiOperation({ summary: '스터디 생성' })
  @RestMethod({
    request: StudyInfoDto,
  })
  createStudy(@Body() studyInfoDto: StudyInfoDto, @Request() req) {
    // eslint-disable-next-line prettier/prettier
    return this.studyService.createStudyInfo(studyInfoDto, req.user);
  }
}
