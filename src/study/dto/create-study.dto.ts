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
  @ApiProperty({ description: '스터디 시작 날짜', type: Date })
  studyStartDate: Date;

  @Expose()
  @ApiProperty({ description: '스터디 끝나는 날짜', type: Date })
  studyEndDate: Date;

  @Expose()
  @ApiProperty({
    description: '진행 요일',
    type: [String],
  })
  daysOfWeek: string[];

  @Expose()
  @ApiProperty({ description: '스터디 설명', type: String })
  studyDescription: string;

  @Expose()
  @ApiProperty({ description: '스터디 주차별 내용', type: [String] })
  studyContents: string[];
}
