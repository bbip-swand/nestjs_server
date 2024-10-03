import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment-timezone';
import { Attendance } from 'src/models/attendance.entity';
import { StudyInfo } from 'src/models/study-info.entity';
import { StudyMember } from 'src/models/study-member.entity';
import { UserInfo } from 'src/models/user-info.entity';
import { User } from 'src/models/user.entity';
import { WeeklyStudyContent } from 'src/models/weekly-study-content.entity';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { v4 } from 'uuid';
import { CreateStudyDto } from './dto/create-study.dto';
import { pendingstudyResponseDto } from './dto/pending-study-response.dto';
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
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async findOne(studyId: string, user: User) {
    const studyInfo: StudyInfo = await this.studyInfoRepository.findOne({
      where: { studyId },
    });
    if (!studyInfo) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const recentAttendance = await this.attendanceRepository.find({
      where: { dbStudyInfoId: studyInfo.dbStudyInfoId },
      order: { session: 'DESC' },
      take: 1,
    });
    let session: number;
    if (recentAttendance.length === 0) {
      session = 1;
    } else {
      session = recentAttendance[0].session + 1;
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
    const isManager = studyInfo.studyLeaderId === user.dbUserId;
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
    const todayDayOfWeek: number =
      currentDate.day() === 0 ? 6 : currentDate.day() - 1;
    const endDate = moment(studyInfo.studyEndDate);
    const nowTime = moment(currentDate, 'HH:mm');
    const studyDateAndTimes = studyInfo.daysOfWeek
      .map((dayOfWeek, index) => {
        let studyDate;
        if (+dayOfWeek > todayDayOfWeek) {
          studyDate = currentDate
            .clone()
            .add(+dayOfWeek - todayDayOfWeek, 'days');
        } else if (+dayOfWeek < todayDayOfWeek) {
          studyDate = currentDate
            .clone()
            .add(+dayOfWeek + 7 - todayDayOfWeek, 'days');
        } else {
          studyDate = nowTime.isAfter(
            moment(studyInfo.studyTimes[index].startTime, 'HH:mm'),
          )
            ? currentDate.clone().add(1, 'weeks')
            : currentDate.clone();
        }
        const leftDays = studyDate.diff(todayDate, 'days');
        return {
          studyDate,
          dayOfWeek,
          studyTime: studyInfo.studyTimes[index],
          leftDays,
        };
      })
      .filter((studyDateAndTime) =>
        endDate.isAfter(studyDateAndTime.studyDate),
      );
    let pendingDate;

    studyDateAndTimes.sort((a, b) => {
      if (a.leftDays === b.leftDays) {
        const aTime = moment(a.studyTime.startTime, 'HH:mm');
        const bTime = moment(b.studyTime.startTime, 'HH:mm');
        return aTime.isBefore(bTime) ? -1 : 1;
      }
      return a.leftDays - b.leftDays;
    });
    const daysOfWeekKor = ['월', '화', '수', '목', '금', '토', '일'];
    if (studyDateAndTimes.length === 0) {
      pendingDate = '남은 스터디 일정이 없습니다.';
    } else {
      const pendingStudy = studyDateAndTimes[0];
      pendingDate = pendingStudy.studyDate.format(
        `M월 D일 (${daysOfWeekKor[+pendingStudy.dayOfWeek]}) / ${pendingStudy.studyTime.startTime} ~ ${pendingStudy.studyTime.endTime}`,
      );
    }
    const result = {
      ...studyInfo,
      studyContents: weeklyStudyContents.map(
        (weeklyStudyContent) => weeklyStudyContent.content,
      ),
      studyMembers: studyMembersInfo,
      currentWeek: currentWeekContent[0].week,
      pendingDate,
      place: currentWeekContent[0].place,
      session,
      isManager,
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
              const weekNumber = now.diff(startDate, 'weeks') + 1;
              const studyDate = now
                .clone()
                .add(dayOfWeek - todayDayOfWeek, 'days');

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

  async findPendingStudy(user: User): Promise<pendingstudyResponseDto> {
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
      relations: ['relWeeklyStudyContent'],
    });
    const todayDayOfWeek: number = now.day() === 0 ? 6 : now.day() - 1;
    const nowTime = moment(now, 'HH:mm');

    const individualStudyDateAndTime = studyInfos.flatMap((studyInfo) => {
      const startDate = moment(studyInfo.studyStartDate);
      const endDate = moment(studyInfo.studyEndDate);
      const weekNumber = now.diff(startDate, 'weeks') + 1;
      const studyDateAndTimes = studyInfo.daysOfWeek.flatMap(
        (dayOfWeek, index) => {
          let studyDate;
          if (+dayOfWeek > todayDayOfWeek) {
            studyDate = now.clone().add(+dayOfWeek - todayDayOfWeek, 'days');
          } else if (+dayOfWeek < todayDayOfWeek) {
            studyDate = now
              .clone()
              .add(+dayOfWeek + 7 - todayDayOfWeek, 'days');
          } else {
            studyDate = nowTime.isAfter(
              moment(studyInfo.studyTimes[index].startTime, 'HH:mm'),
            )
              ? now.clone().add(1, 'weeks')
              : now.clone();
          }
          const leftDays = studyDate.diff(todayDate, 'days');
          return {
            studyDate,
            dayOfWeek,
            studyTime: studyInfo.studyTimes[index],
            leftDays,
          };
        },
      );
      return studyDateAndTimes
        .map((studyDateAndTime) => {
          return {
            studyId: studyInfo.studyId,
            studyName: studyInfo.studyName,
            studyWeek: weekNumber,
            startDate: studyInfo.studyStartDate,
            studyDate: studyDateAndTime.studyDate.format('YYYY-MM-DD'),
            studyTime: studyDateAndTime.studyTime,
            leftDays: studyDateAndTime.leftDays,
            place: studyInfo.relWeeklyStudyContent[weekNumber - 1].place,
          };
        })
        .filter((studyDateAndTime) =>
          endDate.isAfter(studyDateAndTime.studyDate),
        );
    });
    if (individualStudyDateAndTime.length === 0) {
      throw new HttpException(
        '진행 중인 스터디가 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    individualStudyDateAndTime.sort((a, b) => {
      if (a.leftDays === b.leftDays) {
        const aTime = moment(a.studyTime.startTime, 'HH:mm');
        const bTime = moment(b.studyTime.startTime, 'HH:mm');
        return aTime.isBefore(bTime) ? -1 : 1;
      }
      return a.leftDays - b.leftDays;
    });
    const pendingStudy = individualStudyDateAndTime[0];
    return pendingStudy;
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
    const dayDiff = endDate.diff(startDate, 'days') + 1;
    const weekDiff = endDate.diff(startDate, 'weeks') + 1;
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
    if (!studyMember || !studyMember.isManager) {
      throw new HttpException('Not a manager', HttpStatus.UNAUTHORIZED);
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
