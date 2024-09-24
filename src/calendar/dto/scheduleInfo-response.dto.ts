import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ScheduleInfoResponseDto {
  @Expose()
  @ApiProperty({
    description: '일정 uuid',
    type: String,
    example: 'e87bbb6c-d9db-44e1-af1f-9327307201f9',
  })
  scheduleId: string;

  @Expose()
  @ApiProperty({
    description: '스터디 이름',
    type: String,
    example: 'JLPT 스터디',
  })
  studyName: string;

  @Expose()
  @ApiProperty({
    description: '일정 제목',
    type: String,
    example: 'JLPT 시험',
  })
  title: string;

  @Expose()
  @ApiProperty({
    description: '시작일',
    type: Date,
    example: '2021-09-16T00:00:00.000Z',
  })
  startDate: Date;

  @Expose()
  @ApiProperty({
    description: '종료일',
    type: Date,
    example: '2021-09-17T00:00:00.000Z',
  })
  endDate: Date;

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
