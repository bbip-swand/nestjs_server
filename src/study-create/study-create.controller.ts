import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudyCreateService } from './study-create.service';
import { CreateStudyCreateDto } from './dto/create-study-create.dto';
import { UpdateStudyCreateDto } from './dto/update-study-create.dto';

@Controller('study-create')
export class StudyCreateController {
  constructor(private readonly studyCreateService: StudyCreateService) {}

  @Post()
  create(@Body() createStudyCreateDto: CreateStudyCreateDto) {
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
  update(@Param('id') id: string, @Body() updateStudyCreateDto: UpdateStudyCreateDto) {
    return this.studyCreateService.update(+id, updateStudyCreateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studyCreateService.remove(+id);
  }
}
