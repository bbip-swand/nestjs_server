import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudyManageService } from './study-manage.service';
import { CreateStudyManageDto } from './dto/create-study-manage.dto';
import { UpdateStudyManageDto } from './dto/update-study-manage.dto';

@Controller('study-manage')
export class StudyManageController {
  constructor(private readonly studyManageService: StudyManageService) {}

  @Post()
  create(@Body() createStudyManageDto: CreateStudyManageDto) {
    return this.studyManageService.create(createStudyManageDto);
  }

  @Get()
  findAll() {
    return this.studyManageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studyManageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudyManageDto: UpdateStudyManageDto) {
    return this.studyManageService.update(+id, updateStudyManageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studyManageService.remove(+id);
  }
}
