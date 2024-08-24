import { Injectable } from '@nestjs/common';
import { CreateStudyManageDto } from './dto/create-study-manage.dto';
import { UpdateStudyManageDto } from './dto/update-study-manage.dto';

@Injectable()
export class StudyManageService {
  create(createStudyManageDto: CreateStudyManageDto) {
    return 'This action adds a new studyManage';
  }

  findAll() {
    return `This action returns all studyManage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studyManage`;
  }

  update(id: number, updateStudyManageDto: UpdateStudyManageDto) {
    return `This action updates a #${id} studyManage`;
  }

  remove(id: number) {
    return `This action removes a #${id} studyManage`;
  }
}
