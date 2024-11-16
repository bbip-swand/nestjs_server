import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment-timezone';
import { Calendar } from 'src/models/calendar.entity';
import { StudyInfo } from 'src/models/study-info.entity';
import { StudyMember } from 'src/models/study-member.entity';
import { User } from 'src/models/user.entity';
import { Between, In, Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Calendar)
    private calendarRepository: Repository<Calendar>,
    @InjectRepository(StudyInfo)
    private studyInfoRepository: Repository<StudyInfo>,
    @InjectRepository(StudyMember)
    private studyMemberRepository: Repository<StudyMember>,
  ) {}

  async getUpcomingSchedule(user: User) {
    const studyIds = (
      await this.studyMemberRepository.find({
        where: { dbUserId: user.dbUserId },
        select: ['dbStudyInfoId'],
      })
    ).map((study) => study.dbStudyInfoId);

    const schedules = await this.calendarRepository.find({
      where: { dbStudyInfoId: In(studyIds) },
      order: { startDate: 'ASC' }, // 임박한 일정부터 오름차순으로 정렬
    });

    const now = moment().tz('UTC').add(9, 'hours');
    const filteredSchedules = schedules.filter((schedule) => {
      return (
        schedule.isHomeView === true &&
        // now.isSameOrAfter(schedule.startDate) &&
        now.isSameOrBefore(schedule.endDate)
      );
    });
    const response = await Promise.all(
      filteredSchedules.map(async (schedule) => {
        const studyName = await this.studyInfoRepository.findOne({
          where: { dbStudyInfoId: schedule.dbStudyInfoId },
        });
        return {
          ...schedule,
          studyName: studyName.studyName,
        };
      }),
    );
    return response;
  }

  async getScheduleList(date: string, user: any) {
    const studyIds = (
      await this.studyMemberRepository.find({
        where: { dbUserId: user.dbUserId },
        select: ['dbStudyInfoId'],
      })
    ).map((study) => study.dbStudyInfoId);
    const startDate = moment.tz(date, 'UTC').startOf('day').toDate();
    const endDate = moment.tz(date, 'UTC').endOf('day').toDate();
    const schedules = await this.calendarRepository.find({
      where: {
        startDate: Between(startDate, endDate),
        dbStudyInfoId: In(studyIds),
      },
    });
    if (!schedules) {
      throw new HttpException('Schedule not found', HttpStatus.NOT_FOUND);
    }
    const response = await Promise.all(
      schedules.map(async (schedule) => {
        const studyName = await this.studyInfoRepository.findOne({
          where: { dbStudyInfoId: schedule.dbStudyInfoId },
        });
        return {
          ...schedule,
          studyName: studyName.studyName,
        };
      }),
    );

    return response;
  }

  async createSchedule(createScheduleDto: CreateScheduleDto, user: User) {
    const { studyId, ...scheduleInfo } = createScheduleDto;
    const studyInfo = await this.studyInfoRepository.findOne({
      where: { studyId: studyId },
    });

    if (!studyInfo) {
      throw new HttpException('Study not found', HttpStatus.NOT_FOUND);
    }
    if (studyInfo.studyLeaderId !== user.dbUserId) {
      throw new HttpException('Not a leader', HttpStatus.FORBIDDEN);
    }
    const { startDate, endDate, ...filteredScheduleInfo } = scheduleInfo;
    const start = moment.tz(startDate, 'UTC').format();
    const end = moment.tz(endDate, 'UTC').format();

    const schedule = this.calendarRepository.save({
      studyName: studyInfo.studyName,
      startDate: start,
      endDate: end,
      ...filteredScheduleInfo,
      relstudyInfo: studyInfo,
    });
    return schedule;
  }

  async updateSchedule(
    scheduleId: string,
    updateScheduleDto: CreateScheduleDto,
    user: User,
  ) {
    const schedule = await this.calendarRepository.findOne({
      where: { scheduleId: scheduleId },
      relations: ['relstudyInfo'],
    });
    if (!schedule) {
      throw new HttpException('Schedule not found', HttpStatus.NOT_FOUND);
    }
    if (schedule.relstudyInfo.studyLeaderId !== user.dbUserId) {
      throw new HttpException('Not a leader', HttpStatus.FORBIDDEN);
    }
    const { startDate, endDate, ...filteredScheduleInfo } = updateScheduleDto;
    schedule.startDate = moment.tz(startDate, 'UTC').toDate();
    schedule.endDate = moment.tz(endDate, 'UTC').toDate();
    schedule.title = filteredScheduleInfo.title;
    schedule.isHomeView = filteredScheduleInfo.isHomeView;
    schedule.icon = filteredScheduleInfo?.icon;

    const updatedSchedule = this.calendarRepository.save(schedule);
    return updatedSchedule;
  }

  async getCalendarListByMonth(year: number, month: number, user: User) {
    const startDate = moment
      .tz({ year, month: month - 1 }, 'UTC')
      .startOf('month')
      .toDate();
    const endDate = moment
      .tz({ year, month: month - 1 }, 'UTC')
      .endOf('month')
      .toDate();
    const studyIds = (
      await this.studyMemberRepository.find({
        where: { dbUserId: user.dbUserId },
        select: ['dbStudyInfoId'],
      })
    ).map((study) => study.dbStudyInfoId);
    const schedules = await this.calendarRepository.find({
      where: {
        dbStudyInfoId: In(studyIds),
        startDate: Between(startDate, endDate),
      },
    });
    const response = await Promise.all(
      schedules.map(async (schedule) => {
        const studyName = await this.studyInfoRepository.findOne({
          where: { dbStudyInfoId: schedule.dbStudyInfoId },
        });
        return {
          ...schedule,
          studyName: studyName.studyName,
        };
      }),
    );
    return response;
  }
}
