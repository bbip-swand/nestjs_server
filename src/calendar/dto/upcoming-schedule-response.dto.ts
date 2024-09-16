import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UpcomingScheduleResponseDto {
  @Expose()
  @ApiProperty({
    description: '일정 ID',
    type: String,
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: '스터디 이름',
    type: String,
  })
  studyName: string;

  @Expose()
  @ApiProperty({
    description: '스터디 uuid',
    type: String,
  })
  studyId: string;

  @Expose()
  @ApiProperty({
    description: '스터디 ID',
    type: Number,
  })
  dbStudyInfoId: number;

  @Expose()
  @ApiProperty({
    description: '일정 제목',
    type: String,
  })
  title: string;

  @Expose()
  @ApiProperty({
    description: '시작일',
    type: String,
  })
  startDate: string;

  @Expose()
  @ApiProperty({
    description: '종료일',
    type: String,
  })
  endDate: string;

  @Expose()
  @ApiProperty({
    description: '홈뷰 여부',
    type: Boolean,
  })
  isHomeView: boolean;

  @Expose()
  @ApiProperty({
    description: '아이콘',
    type: Number,
  })
  icon: number;
}
