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
  session: number;
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
    const studyMembers = await this.studyMemberRepository.find({
      where: {
        dbStudyInfoId: studyInfo?.dbStudyInfoId,
      },
    });
    //모든 스터디 멤버들의 출결 상황 ABSENT로 초기화
    for (const studyMember of studyMembers) {
      await this.attendanceRepository.save({
        dbUserId: studyMember.dbUserId,
        dbStudyInfoId: studyInfo.dbStudyInfoId,
        dbStudyMemberId: studyMember.dbStudyMemberId,
        session: createAttendanceDto.session,
      });
    }
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
    //해당 스터디의 스터디원들의 현재 주차의 출석을 결석으로 생성
    await this.cacheManager.set(key, {
      session: createAttendanceDto.session,
      code: authCode,
      startTime: currentTimeKST,
      ttl: 602,
      dbStudyInfoId: dbStudyInfoId,
    });
    return {
      code: authCode,
    };
  }

  async checkAttendanceStatus(user: User) {
    const studyIds = await this.findStudyIdByUserId(user.dbUserId);
    let studyId;
    for (studyId of studyIds) {
      const key = `attendance:${studyId}`;
      const attendanceInfo = await this.cacheManager.get(key);
      if (attendanceInfo) {
        attendanceInfo['studyId'] = studyId;
        attendanceInfo['studyName'] = await this.studyInfoRepository
          .findOne({
            where: { studyId },
          })
          .then((studyInfo) => studyInfo?.studyName);
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
      //해당 스터디원의 해당 회차의 출석을 출석으로 변경
      await this.attendanceRepository.update(
        {
          dbUserId: user.dbUserId,
          dbStudyInfoId: studyInfo.dbStudyInfoId,
          session: attendanceInfo.session,
        },
        {
          status: 'ATTENDED',
        },
      );
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
