import { Body, Post, Request } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MemberJwtController } from 'src/utils/decorators/jwt-controller';
import { RestMethod } from 'src/utils/decorators/rest-method';
import { StudyInfoDto } from './dto/create-study.dto';
import { StudyService } from './study.service';

@MemberJwtController('study')
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

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
