import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class pendingstudyResponseDto {
  @Expose()
  @ApiProperty({ description: '스터디 ID', type: String })
  studyId: string;

  @Expose()
  @ApiProperty({ description: '스터디 이름', type: String })
  studyName: string;

  @Expose()
  @ApiProperty({ description: '스터디 주차', type: Number })
  studyWeek: number;

  @Expose()
  @ApiProperty({ description: '스터디 진행 시간', type: String })
  studyTime: string;

  @Expose()
  @ApiProperty({ description: 'd-day)', type: Number })
  leftDays: number;

  @Expose()
  @ApiProperty({ description: '스터디 진행장소', type: String })
  place: string;
}
