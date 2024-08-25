import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Request,
} from '@nestjs/common';
import { StudyCreateService } from './study-create.service';
import { CreateStudyCreateDto } from './dto/create-study-create.dto';
import { UpdateStudyCreateDto } from './dto/update-study-create.dto';
import { MemberJwtController } from 'src/utils/decorators/jwt-controller';
import { ApiOperation } from '@nestjs/swagger';
import { RestMethod } from 'src/utils/decorators/rest-method';

@MemberJwtController('createStudy')
export class StudyCreateController {
  constructor(private readonly studyCreateService: StudyCreateService) {}

  @Post('create')
  @ApiOperation({ summary: '스터디 생성' })
  @RestMethod({
    request: CreateStudyCreateDto,
  })
  createStudy(
    @Body() createStudyCreateDto: CreateStudyCreateDto,
    @Request() req,
  ) {
    //스터디 생성
    return this.studyCreateService.create(createStudyCreateDto);
  }

  @Get()
  findAll() {
    return this.studyCreateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studyCreateService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStudyCreateDto: UpdateStudyCreateDto,
  ) {
    return this.studyCreateService.update(+id, updateStudyCreateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studyCreateService.remove(+id);
  }
}
