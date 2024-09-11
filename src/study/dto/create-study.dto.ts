import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StudyInfoDto {
  @Expose()
  @ApiProperty({ description: '스터디 이름', type: String })
  studyName: string;

  @Expose()
  @ApiProperty({ description: '스터디 사진 url(S3)', type: String })
  studyImageUrl: string;

  @Expose()
  @ApiProperty({ description: '스터디 분야', type: Number })
  studyField: number;

  @Expose()
  @ApiProperty({ description: '총 진행 주차', type: Number })
  totalWeeks: number;

  @Expose()
  @ApiProperty({
    description: '스터디 시작 날짜',
    type: Date,
    example: '2024-08-12',
  })
  studyStartDate: Date;

  @Expose()
  @ApiProperty({
    description: '스터디 끝나는 날짜',
    type: Date,
    example: '2024-10-12',
  })
  studyEndDate: Date;

  @Expose()
  @ApiProperty({
    description: '진행 요일',
    type: [String],
    example: ['월', '수'],
  })
  daysOfWeek: string[];

  @Expose()
  @ApiProperty({ description: '스터디 설명', type: String })
  studyDescription: string;

  @Expose()
  @ApiProperty({
    description: '스터디 주차별 내용',
    type: [String],
    example: ['1주차 내용', '2주차 내용', '3주차 내용'],
  })
  studyContents: string[];
}
