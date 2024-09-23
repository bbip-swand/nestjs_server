import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment-timezone';
import { StudyInfo } from 'src/models/study-info.entity';
import { StudyMember } from 'src/models/study-member.entity';
import { User } from 'src/models/user.entity';
import { WeeklyStudyContent } from 'src/models/weekly-study-content.entity';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { StudyInfoDto } from './dto/create-study.dto';
import { StudyBriefInfoResponseDto } from './dto/studyBriefInfo-response.dto';

@Injectable()
export class StudyService {
  constructor(
    @InjectRepository(StudyInfo)
    private studyInfoRepository: Repository<StudyInfo>,
    @InjectRepository(WeeklyStudyContent)
    private weeklyStudyContentRepository: Repository<WeeklyStudyContent>,
    @InjectRepository(StudyMember)
    private studyMemberRepository: Repository<StudyMember>,
  ) {}

  async findOne(studyId: string): Promise<StudyInfo> {
    const studyInfo: StudyInfo = await this.studyInfoRepository.findOne({
      where: { studyId },
    });
    if (!studyInfo) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

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

  async findThisWeekStudyList(user: User) {
    const studyMembers: StudyMember[] = await this.studyMemberRepository.find({
      where: { dbUserId: user.dbUserId },
    });
    const studyIds: number[] = studyMembers.map(
      (studyMember) => studyMember.dbStudyInfoId,
    );

    const now = moment.tz('Asia/Seoul');
    const todayDate: Date = new Date(now.format('YYYY-MM-DD'));
    const studyInfos: StudyInfo[] = await this.studyInfoRepository.find({
      where: {
        dbStudyInfoId: In(studyIds),
        studyStartDate: LessThanOrEqual(todayDate),
        studyEndDate: MoreThanOrEqual(todayDate),
      },
    });

    const todayDayOfWeek: number = now.day() === 0 ? 6 : now.day() - 1;
    const nowTime = moment(now, 'HH:mm');

    const filteredStudyInfos = await Promise.all(
      studyInfos
        .map((studyInfo) => {
          const filteredTimePairs = studyInfo.daysOfWeek
            .map((dayOfWeek, index) => ({
              dayOfWeek,
              studyTime: studyInfo.studyTimes[index],
            }))
            .filter(
              (timePair) =>
                timePair.dayOfWeek >= todayDayOfWeek &&
                !nowTime.isAfter(moment(timePair.studyTime.startTime, 'HH:mm')),
            );

          return {
            ...studyInfo,
            daysOfWeek: filteredTimePairs.map((timePair) => timePair.dayOfWeek),
            studyTimes: filteredTimePairs.map((timePair) => timePair.studyTime),
          };
        })
        .filter((studyInfo) => studyInfo.daysOfWeek.length > 0)
        .flatMap(async (studyInfo) => {
          const startDate = moment(studyInfo.studyStartDate);
          const weekNumber = now.diff(startDate, 'weeks') + 1;

          const studyContent = await this.weeklyStudyContentRepository.findOne({
            where: {
              dbStudyInfoId: studyInfo.dbStudyInfoId,
              week: weekNumber,
            },
          });

          return studyInfo.daysOfWeek.map((dayOfWeek, index) => {
            const studyDate = startDate
              .clone()
              .add(weekNumber - 1, 'weeks')
              .day(dayOfWeek === 6 ? 0 : dayOfWeek + 1)
              .format('YYYY-MM-DD');
            return {
              studyId: studyInfo.studyId,
              studyName: studyInfo.studyName,
              studyImageUrl: studyInfo.studyImageUrl,
              studyField: studyInfo.studyField,
              studyDate,
              dayOfWeek: +dayOfWeek,
              studyTime: studyInfo.studyTimes[index],
              studyContent: studyContent.content,
            };
          });
        }),
    );
    const flattenedStudyInfos = filteredStudyInfos.flat();

    return flattenedStudyInfos;
  }

  async findByInviteCode(inviteCode: string): Promise<StudyInfo> {
    const studyInfo: StudyInfo = await this.studyInfoRepository.findOne({
      where: { studyInviteCode: inviteCode },
    });
    if (!studyInfo) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
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

  async findFinishedStudyList(user: any): Promise<StudyBriefInfoResponseDto[]> {
    const studyMembers: StudyMember[] = await this.studyMemberRepository.find({
      where: { dbUserId: user.dbUserId },
    });
    const studyIds: number[] = studyMembers.map(
      (studyMember) => studyMember.dbStudyInfoId,
    );
    const now = moment.tz('Asia/Seoul');
    const todayDate: Date = new Date(now.format('YYYY-MM-DD'));
    const studyInfos: StudyInfo[] = await this.studyInfoRepository.find({
      where: {
        dbStudyInfoId: In(studyIds),
        studyEndDate: LessThanOrEqual(todayDate),
      },
    });
    if (!studyInfos) {
      throw new HttpException(
        '종료된 스터디가 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    const response: StudyBriefInfoResponseDto[] = studyInfos.map(
      (studyInfo) => {
        return {
          studyId: studyInfo.studyId,
          studyName: studyInfo.studyName,
          studyImageUrl: studyInfo.studyImageUrl,
          studyField: studyInfo.studyField,
          totalWeeks: studyInfo.totalWeeks,
          studyStartDate: studyInfo.studyStartDate,
          studyEndDate: studyInfo.studyEndDate,
          daysOfWeek: studyInfo.daysOfWeek,
          studyTimes: studyInfo.studyTimes,
          currentWeek: -1,
        };
      },
    );
    return response;
  }

  async findOngoingStudyList(user: User): Promise<StudyBriefInfoResponseDto[]> {
    const studyMembers = await this.studyMemberRepository.find({
      where: { dbUserId: user.dbUserId },
    });
    if (!studyMembers) {
      throw new HttpException(
        '가입된 스터디가 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    const studyIds: number[] = studyMembers.map(
      (studyMember) => studyMember.dbStudyInfoId,
    );
    const now = moment.tz('Asia/Seoul');
    const todayDate: Date = new Date(now.format('YYYY-MM-DD'));
    const studyInfos: StudyInfo[] = await this.studyInfoRepository.find({
      where: {
        dbStudyInfoId: In(studyIds),
        studyStartDate: LessThanOrEqual(todayDate),
        studyEndDate: MoreThanOrEqual(todayDate),
      },
    });
    if (!studyInfos) {
      throw new HttpException(
        '진행 중인 스터디가 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    } else {
      console.log(studyInfos);
    }
    const currentWeek = await Promise.all(
      studyInfos.map(async (studyInfo) => {
        const currentWeekContent = await this.weeklyStudyContentRepository.find(
          {
            where: {
              dbStudyInfoId: studyInfo.dbStudyInfoId,
              studyStartDate: LessThanOrEqual(todayDate),
            },
            order: {
              studyStartDate: 'DESC',
            },
            take: 1,
          },
        );
        return currentWeekContent[0].week;
      }),
    );

    const response: StudyBriefInfoResponseDto[] = studyInfos.map(
      (studyInfo, index) => {
        return {
          studyId: studyInfo.studyId,
          studyName: studyInfo.studyName,
          studyImageUrl: studyInfo.studyImageUrl,
          studyField: studyInfo.studyField,
          totalWeeks: studyInfo.totalWeeks,
          studyStartDate: studyInfo.studyStartDate,
          studyEndDate: studyInfo.studyEndDate,
          daysOfWeek: studyInfo.daysOfWeek,
          studyTimes: studyInfo.studyTimes,
          currentWeek: currentWeek[index],
        };
      },
    );
    return response;
  }

  async createStudyInfo(
    createStudyCreateDto: StudyInfoDto,
    user: User,
  ): Promise<StudyInfo> {
    const { studyContents, ...studyInfo } = createStudyCreateDto;
    if (!studyInfo.studyImageUrl || studyInfo.studyImageUrl === '') {
      studyInfo.studyImageUrl = null;
    }
    if (
      studyInfo.daysOfWeek.length === 0 ||
      studyInfo.studyTimes.length === 0 ||
      studyInfo.daysOfWeek.length !== studyInfo.studyTimes.length
    ) {
      throw new HttpException(
        '주차별 횟수와 시간 횟수가 맞지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const startDate = moment(studyInfo.studyStartDate);
    const endDate = moment(studyInfo.studyEndDate);
    const weekDiff = endDate.diff(startDate, 'weeks');
    if (
      studyInfo.totalWeeks === 0 ||
      studyInfo.totalWeeks !== weekDiff ||
      studyInfo.totalWeeks > 52
    ) {
      throw new HttpException('전체 주차 오류', HttpStatus.BAD_REQUEST);
    }
    if (studyContents.length !== studyInfo.totalWeeks) {
      throw new HttpException(
        '스터디 세부사항을 완벽히 작성해주세요',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newStudyInfo: StudyInfo = await this.studyInfoRepository.save({
      studyLeaderId: user.dbUserId,
      ...studyInfo,
    });

    let week: number = 1;
    for (const studyContent of studyContents) {
      const studyWeekday = startDate
        .clone()
        .add(week - 1, 'weeks')
        .format('YYYY-MM-DD');

      await this.weeklyStudyContentRepository.save({
        dbStudyInfoId: newStudyInfo.dbStudyInfoId,
        week: week++,
        studyStartDate: studyWeekday,
        content: studyContent,
      });
    }

    await this.studyMemberRepository.save({
      dbUserId: user.dbUserId,
      dbStudyInfoId: newStudyInfo.dbStudyInfoId,
      isManager: true,
    });
    return newStudyInfo;
  }

  async joinStudy(studyId: string, user: any) {
    const studyinfo: StudyInfo = await this.studyInfoRepository.findOne({
      where: { studyId: studyId },
    });
    if (!studyinfo) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const studyMember = await this.studyMemberRepository.save({
      dbUserId: user.dbUserId,
      dbStudyInfoId: studyinfo.dbStudyInfoId,
    });
    return studyMember;
  }
}
