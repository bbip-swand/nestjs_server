import { Injectable } from '@nestjs/common';
import { UpdateStudyCreateDto } from './dto/update-study-create.dto';
import { User } from 'src/models/user.entity';
import { StudyInfoDto } from './dto/create-study.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudyInfo } from 'src/models/study-info.entity';
import { Repository } from 'typeorm';
import { WeeklyStudyContent } from 'src/models/weekly-study-content.entity';

@Injectable()
export class StudyCreateService {
  constructor(
    @InjectRepository(StudyInfo)
    private studyInfoRepository: Repository<StudyInfo>,
    @InjectRepository(WeeklyStudyContent)
    private weeklyStudyContentRepository: Repository<WeeklyStudyContent>,
  ) {}

  async createStudyInfo(
    createStudyCreateDto: StudyInfoDto,
    user: User,
  ): Promise<StudyInfo> {
    const { studyContents, ...studyInfo } = createStudyCreateDto;
    // 트랜잭션 시작 - table이 2개이므로 all or nothing 처리
    const newStudyInfo: StudyInfo = await this.studyInfoRepository.save({
      dbUserId: user.dbUserId,
      ...studyInfo,
    });
    let week: number = 1;
    for (const studyContent of studyContents) {
      await this.weeklyStudyContentRepository.save({
        dbStudyInfoId: newStudyInfo.dbStudyInfoId,
        week: week++,
        content: studyContent,
      });
    }
    return newStudyInfo;
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
