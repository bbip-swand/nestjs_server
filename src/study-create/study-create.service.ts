import { Injectable } from '@nestjs/common';
import { CreateStudyCreateDto } from './dto/create-study-create.dto';
import { UpdateStudyCreateDto } from './dto/update-study-create.dto';

@Injectable()
export class StudyCreateService {
  create(createStudyCreateDto: CreateStudyCreateDto) {
    return 'This action adds a new studyCreate';
  }

  findAll() {
    return `This action returns all studyCreate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studyCreate`;
  }

  update(id: number, updateStudyCreateDto: UpdateStudyCreateDto) {
    return `This action updates a #${id} studyCreate`;
  }

  remove(id: number) {
    return `This action removes a #${id} studyCreate`;
  }
}
