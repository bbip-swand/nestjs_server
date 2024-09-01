import { Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { StudyCreateService } from './study-create.service';
import { UpdateStudyCreateDto } from './dto/update-study-create.dto';
import { MemberJwtController } from 'src/utils/decorators/jwt-controller';
import { ApiOperation } from '@nestjs/swagger';
import { RestMethod } from 'src/utils/decorators/rest-method';
import { StudyInfoDto } from './dto/create-study.dto';

@MemberJwtController('createStudy')
export class StudyCreateController {
  constructor(private readonly studyCreateService: StudyCreateService) {}

  @Post('create')
  @ApiOperation({ summary: '스터디 생성' })
  @RestMethod({
    request: StudyInfoDto,
  })
  createStudy(@Body() studyInfoDto: StudyInfoDto, @Request() req) {
    // eslint-disable-next-line prettier/prettier
    return this.studyCreateService.createStudyInfo(studyInfoDto, req.user);
  }
}
