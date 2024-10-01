import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment-timezone';
import { StudyInfo } from 'src/models/study-info.entity';
import { StudyMember } from 'src/models/study-member.entity';
import { UserInfo } from 'src/models/user-info.entity';
import { User } from 'src/models/user.entity';
import { WeeklyStudyContent } from 'src/models/weekly-study-content.entity';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { v4 } from 'uuid';
import { CreateStudyDto } from './dto/create-study.dto';
import { StudyBriefInfoResponseDto } from './dto/studyBriefInfo-response.dto';
import { UpdatePlaceRequestDto } from './dto/update-place-request.dto';

@Injectable()
export class StudyService {
  constructor(
    @InjectRepository(StudyInfo)
    private studyInfoRepository: Repository<StudyInfo>,
    @InjectRepository(WeeklyStudyContent)
    private weeklyStudyContentRepository: Repository<WeeklyStudyContent>,
    @InjectRepository(StudyMember)
    private studyMemberRepository: Repository<StudyMember>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
  ) {}

  async findOne(studyId: string) {
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

    const studyMembers = await this.studyMemberRepository.find({
      where: { dbStudyInfoId: studyInfo.dbStudyInfoId },
    });
    const studyMembersInfo = await Promise.all(
      studyMembers.map(async (studyMember) => {
        const userInfo = await this.userInfoRepository.findOne({
          where: { dbUserId: studyMember.dbUserId },
        });
        return {
          memberName: userInfo.name,
          isManager: studyMember.isManager,
          memberImageUrl: userInfo.profileImageUrl,
          interest: userInfo.interest,
        };
      }),
    );
    const todayDate: Date = new Date(moment().utc().add(9, 'hours').format());
    const currentWeekContent = await this.weeklyStudyContentRepository.find({
      where: {
        dbStudyInfoId: studyInfo.dbStudyInfoId,
        studyStartDate: LessThanOrEqual(todayDate),
      },
      order: {
        studyStartDate: 'DESC',
      },
      take: 1,
    });

    const currentDate = moment.tz('Asia/Seoul');
    const startDate = moment(studyInfo.studyStartDate);
    const endDate = moment(studyInfo.studyEndDate);
    const todayDayOfWeek: number =
      currentDate.day() === 0 ? 6 : currentDate.day() - 1;
    const nowTime = moment(currentDate, 'HH:mm');
    // const currentDate = moment().utc().add(9, 'hours');
    const currentWeek = currentDate.diff(startDate, 'weeks') + 1;

    const isThisWeekStudyExist = studyInfo.daysOfWeek.some(
      (dayOfWeek, index) =>
        +dayOfWeek > todayDayOfWeek ||
        (+dayOfWeek === todayDayOfWeek &&
          !nowTime.isAfter(
            moment(studyInfo.studyTimes[index].startTime, 'HH:mm'),
          )),
    );
    const startDateDayOfWeek = startDate.day() === 0 ? 6 : startDate.day() - 1;
    const daysOfWeekKor = ['월', '화', '수', '목', '금', '토', '일'];
    let pendingDate = '';
    let pendingDateIndex = -1;
    if (isThisWeekStudyExist) {
      const filteredTimePair = studyInfo.daysOfWeek
        .map((dayOfWeek, index) => ({
          dayOfWeek,
          studyTime: studyInfo.studyTimes[index],
        }))
        .filter(
          (timePair) =>
            +timePair.dayOfWeek > todayDayOfWeek ||
            (+timePair.dayOfWeek === todayDayOfWeek &&
              !nowTime.isAfter(moment(timePair.studyTime.startTime, 'HH:mm'))),
        )[0];
      pendingDate = moment(startDate)
        .add(currentWeek - 1, 'weeks')
        .add((+filteredTimePair.dayOfWeek + 7 - startDateDayOfWeek) % 7, 'days')
        .format(`M월 D일 (${daysOfWeekKor[+filteredTimePair.dayOfWeek]})`);
      pendingDateIndex = studyInfo.daysOfWeek.indexOf(
        filteredTimePair.dayOfWeek,
      );
    } else {
      const pendingMoment = startDate
        .clone()
        .add(currentWeek, 'weeks')
        .add((+studyInfo.daysOfWeek[0] + 7 - startDateDayOfWeek) % 7, 'days');
      pendingDate = pendingMoment.format(
        `M월 D일 (${daysOfWeekKor[+studyInfo.daysOfWeek[0]]})`,
      );
      pendingDateIndex = studyInfo.daysOfWeek.indexOf(studyInfo.daysOfWeek[0]);
    }
    const result = {
      ...studyInfo,
      studyContents: weeklyStudyContents.map(
        (weeklyStudyContent) => weeklyStudyContent.content,
      ),
      studyMembers: studyMembersInfo,
      currentWeek: currentWeekContent[0].week,
      pendingDate,
      pendingDateIndex,
      place: currentWeekContent[0].place,
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
                +timePair.dayOfWeek > todayDayOfWeek ||
                (+timePair.dayOfWeek === todayDayOfWeek &&
                  !nowTime.isAfter(
                    moment(timePair.studyTime.startTime, 'HH:mm'),
                  )),
            );

          return {
            ...studyInfo,
            daysOfWeek: filteredTimePairs.map(
              (timePair) => +timePair.dayOfWeek,
            ),
            studyTimes: filteredTimePairs.map((timePair) => timePair.studyTime),
          };
        })
        .filter((studyInfo) => studyInfo.daysOfWeek.length > 0)
        .flatMap(async (studyInfo) => {
          const startDate = moment(studyInfo.studyStartDate);

          return await Promise.all(
            studyInfo.daysOfWeek.map(async (dayOfWeek, index) => {
              const studyDateDayOfWeek =
                startDate.day() === 0 ? 6 : startDate.day() - 1;
              const studyDate = startDate
                .clone()
                .add(dayOfWeek + 7 - studyDateDayOfWeek, 'days');
              const weekNumber = studyDate.diff(startDate, 'weeks') + 1;

              const studyContent =
                await this.weeklyStudyContentRepository.findOne({
                  where: {
                    dbStudyInfoId: studyInfo.dbStudyInfoId,
                    week: weekNumber,
                  },
                });
              return {
                studyId: studyInfo.studyId,
                studyName: studyInfo.studyName,
                studyWeek: weekNumber,
                studyImageUrl: studyInfo.studyImageUrl,
                studyField: studyInfo.studyField,
                studyDate: studyDate.format('YYYY-MM-DD'),
                dayOfWeek: dayOfWeek,
                studyTime: studyInfo.studyTimes[index],
                studyContent: studyContent.content,
                place: studyContent.place,
              };
            }),
          );
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

  async findMyStudyList(user: User) {
    const now = moment.tz('Asia/Seoul');
    const todayDate: Date = new Date(now.format('YYYY-MM-DD'));
    const studyInfos: StudyInfo[] = await this.studyInfoRepository.find({
      where: {
        studyLeaderId: user.dbUserId,
        studyStartDate: LessThanOrEqual(todayDate),
        studyEndDate: MoreThanOrEqual(todayDate),
      },
    });
    const result = studyInfos.map((studyInfo) => {
      return {
        studyId: studyInfo.studyId,
        studyName: studyInfo.studyName,
      };
    });
    return result;
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
    createStudyCreateDto: CreateStudyDto,
    user: User,
  ): Promise<StudyInfo> {
    const { studyContents, ...studyInfo } = createStudyCreateDto;
    const inviteCode = v4();
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
    const dayDiff = endDate.diff(startDate, 'days');
    const weekDiff = endDate.diff(startDate, 'weeks');
    if (
      studyInfo.totalWeeks * 7 !== dayDiff ||
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
      studyInviteCode: inviteCode,
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
    const studyMember: StudyMember = await this.studyMemberRepository.findOne({
      where: {
        dbUserId: user.dbUserId,
        dbStudyInfoId: studyinfo.dbStudyInfoId,
      },
    });
    if (studyMember) {
      throw new HttpException('Already Exists', HttpStatus.BAD_REQUEST);
    }
    const newStudyMember = await this.studyMemberRepository.save({
      dbUserId: user.dbUserId,
      dbStudyInfoId: studyinfo.dbStudyInfoId,
    });
    return newStudyMember;
  }

  async updatePlace(studyId: string, user: User, dto: UpdatePlaceRequestDto) {
    const studyInfo: StudyInfo = await this.studyInfoRepository.findOne({
      where: { studyId },
    });
    if (!studyInfo) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const studyMember: StudyMember = await this.studyMemberRepository.findOne({
      where: {
        dbUserId: user.dbUserId,
        dbStudyInfoId: studyInfo.dbStudyInfoId,
      },
    });
    if (studyMember || !studyMember.isManager) {
      throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
    }
    try {
      const { place, session } = dto;
      await this.weeklyStudyContentRepository.update(
        { dbStudyInfoId: studyInfo.dbStudyInfoId, week: session },
        { place },
      );
      return { place };
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
