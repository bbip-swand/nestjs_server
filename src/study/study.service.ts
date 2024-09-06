import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudyInfo } from 'src/models/study-info.entity';
import { User } from 'src/models/user.entity';
import { WeeklyStudyContent } from 'src/models/weekly-study-content.entity';
import { Repository } from 'typeorm';
import { StudyInfoDto } from './dto/create-study.dto';

@Injectable()
export class StudyService {
  constructor(
    @InjectRepository(StudyInfo)
    private studyInfoRepository: Repository<StudyInfo>,
    @InjectRepository(WeeklyStudyContent)
    private weeklyStudyContentRepository: Repository<WeeklyStudyContent>,
  ) {}

  async findOne(studyId: string): Promise<StudyInfo> {
    const studyInfo: StudyInfo = await this.studyInfoRepository.findOne({
      where: { studyId },
    });

    const weeklyStudyContents: WeeklyStudyContent[] =
      await this.weeklyStudyContentRepository.find({
        where: { dbStudyInfoId: studyInfo.dbStudyInfoId },
      });

    const result = {
      ...studyInfo,
      studyContents: weeklyStudyContents.map(
        (weeklyStudyContent) => weeklyStudyContent.content,
      ),
    };

    return result;
  }

  async createStudyInfo(
    createStudyCreateDto: StudyInfoDto,
    user: User,
  ): Promise<StudyInfo> {
    const { studyContents, ...studyInfo } = createStudyCreateDto;
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
}
