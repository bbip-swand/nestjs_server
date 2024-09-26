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
    type: String,
    example: '2024-09-15 15:00:00',
  })
  startDate: string;

  @Expose()
  @ApiProperty({
    description: '종료일',
    type: String,
    example: '2024-09-15 18:00:00',
  })
  endDate: string;

  @Expose()
  @ApiProperty({ description: '홈뷰 여부', type: Boolean })
  isHomeView: boolean;

  @Expose()
  @ApiProperty({ description: '아이콘', type: Number })
  icon?: number;
}
