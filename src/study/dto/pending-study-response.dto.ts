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
  @ApiProperty({
    description: '스터디 시작 날짜',
    type: String,
    example: '2024-10-02',
  })
  startDate: string;

  @Expose()
  @ApiProperty({
    description: '스터디 진행 시간',
    type: String,
    example: '14:00 - 16:00',
  })
  studyTime: string;

  @Expose()
  @ApiProperty({ description: 'd-day', type: Number })
  leftDays: number;

  @Expose()
  @ApiProperty({ description: '스터디 진행장소', type: String })
  place: string;
}
