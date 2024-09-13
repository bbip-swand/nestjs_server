import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudyInfo } from 'src/models/study-info.entity';
import { User } from 'src/models/user.entity';
import { Repository } from 'typeorm';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(StudyInfo)
    private studyInfoRepository: Repository<StudyInfo>,
  ) {
    // console.log(this.cacheManger.store);
  }

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

    if (studyLeaderId !== user.dbUserId) {
      throw new HttpException('Not Study Leader', HttpStatus.FORBIDDEN);
    }

    const key = `attendance:${createAttendanceDto.studyId}`;
    const currentTimeKST = new Date().toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
    });
    const authCode = this.generateAuthCode();

    return await this.cacheManager.set(key, {
      code: authCode,
      startTime: currentTimeKST,
      ttl: 600,
    });
  }

  private generateAuthCode(): string {
    const authCode = Math.floor(1000 + Math.random() * 9000);
    return authCode.toString();
  }
  // postTest() {
  //   return this.cacheManger.set('test', 1234);
  // }

  // getTest() {
  //   return this.cacheManger.get('test');
  // }
}
