import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateScheduleDto {
  @Expose()
  @ApiProperty({ description: '스터디 uuid', type: String })
  studyId: string;

  @Expose()
  @ApiProperty({ description: '일정 제목', type: String })
  title: string;

  @Expose()
  @ApiProperty({
    description: '시작일',
    type: Date,
    example: '2024-09-16T00:00:00.000Z',
  })
  startDate: Date;

  @Expose()
  @ApiProperty({
    description: '종료일',
    type: Date,
    example: '2024-09-17T00:00:00.000Z',
  })
  endDate: Date;

  @Expose()
  @ApiProperty({ description: '홈뷰 여부', type: Boolean })
  isHomeView: boolean;

  @Expose()
  @ApiProperty({ description: '아이콘', type: Number })
  icon?: number;
}
