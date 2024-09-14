import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudyInfo } from 'src/models/study-info.entity';
import { User } from 'src/models/user.entity';
import { Repository } from 'typeorm';
import { CreateAttendanceDto } from './dto/create-attendance-request.dto';
import { StudyMember } from 'src/models/study-member.entity';
import { ApplyAttendanceRequestDto } from './dto/apply-attendance-request.dto';
import { Attendance } from 'src/models/attendance.entity';

interface AttendanceInfo {
  week: number;
  code: number;
  startTime: string;
  ttl: number;
  dbStudyInfoId: number;
}

@Injectable()
export class AttendanceService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(StudyInfo)
    private studyInfoRepository: Repository<StudyInfo>,
    @InjectRepository(StudyMember)
    private studyMemberRepository: Repository<StudyMember>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async createAttendance(createAttendanceDto: CreateAttendanceDto, user: User) {
    const studyInfo = await this.studyInfoRepository.findOne({
      where: {
        studyId: createAttendanceDto.studyId,
      },
    });

    if (!studyInfo) {
      throw new HttpException('Study Info Found', HttpStatus.NOT_FOUND);
    }
    const studyLeaderId = studyInfo?.studyLeaderId;
    const dbStudyInfoId = studyInfo?.dbStudyInfoId;

    if (studyLeaderId !== user.dbUserId) {
      throw new HttpException('Not Study Leader', HttpStatus.FORBIDDEN);
    }

    const key = `attendance:${createAttendanceDto.studyId}`;
    const currentTimeKST = new Date().toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
    });
    const authCode = this.generateAuthCode();

    return await this.cacheManager.set(key, {
      week: createAttendanceDto.week,
      code: authCode,
      startTime: currentTimeKST,
      ttl: 600,
      dbStudyInfoId: dbStudyInfoId,
    });
  }

  async checkAttendanceStatus(user: User) {
    const studyIds = await this.findStudyIdByUserId(user.dbUserId);
    let studyId;
    for (studyId of studyIds) {
      const key = `attendance:${studyId}`;
      const attendanceInfo = await this.cacheManager.get(key);
      if (attendanceInfo) {
        attendanceInfo['studyId'] = studyId;
        return attendanceInfo;
      }
    }
    throw new HttpException('attendance Not Found', HttpStatus.NOT_FOUND); //출석 정보 없음
  }

  async applyAttendanceCode(
    applyAttendanceDto: ApplyAttendanceRequestDto,
    user: any,
  ) {
    const key = 'attendance:' + applyAttendanceDto.studyId;
    const attendanceInfo: AttendanceInfo = await this.cacheManager.get(key);
    if (!attendanceInfo) {
      throw new HttpException('Attendance Timeout', HttpStatus.FORBIDDEN);
    }
    if (attendanceInfo.code !== applyAttendanceDto.code) {
      throw new HttpException('Invalid Code', HttpStatus.UNAUTHORIZED); //인증 실패
    } else if (attendanceInfo.code === applyAttendanceDto.code) {
      const studyInfo = await this.studyMemberRepository.findOne({
        where: {
          dbStudyInfoId: attendanceInfo.dbStudyInfoId,
        },
      });
      await this.attendanceRepository.save({
        dbUserId: user.dbUserId,
        dbStudyInfoId: attendanceInfo.dbStudyInfoId,
        dbStudyMemberId: studyInfo.dbStudyMemberId,
        week: attendanceInfo.week,
        status: 'ATTENDED',
      });
      return { message: 'Success' };
    }
  }

  private generateAuthCode(): number {
    const authCode = Math.floor(1000 + Math.random() * 9000);
    return authCode;
  }

  private async findStudyIdByUserId(dbUserId: number): Promise<string[]> {
    const studyIds = await this.studyMemberRepository.find({
      where: { dbUserId },
      relations: ['relStudyInfo'], // 관계된 StudyInfo 데이터 로드
    });
    return studyIds.map((study) => study.relStudyInfo.studyId);
  }
}
