import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

class StudyTimeDto {
  @Expose()
  @ApiProperty({ description: '스터디 시작 시간', type: String })
  startTime: string;

  @Expose()
  @ApiProperty({ description: '스터디 끝나는 시간', type: String })
  endTime: string;
}

export class StudyInfoDto {
  @Expose()
  @ApiProperty({ description: '스터디 이름', type: String })
  studyName: string;

  @Expose()
  @ApiProperty({ description: '스터디 사진 url(S3)', type: String })
  studyImageUrl: string;

  @Expose()
  @ApiProperty({
    description:
      '스터디 분야(0: 전공과목, 1: 자기계발, 2: 어학(토익 등), 3: 자격증, 4: 면접, 5: 개발, 6: 디자인, 7: 취미, 8: 기타)',
    type: Number,
  })
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
    description: '진행 요일 (0: 월, 1: 화, 2: 수, 3: 목, 4: 금, 5: 토, 6: 일)',
    type: [Number],
    example: [0, 2],
  })
  daysOfWeek: number[];

  @Expose()
  @ApiProperty({
    description: '요일별 스터디 시간',
    type: [StudyTimeDto],
    example: [
      {
        startTime: '17:00',
        endTime: '19:00',
      },
      {
        startTime: '19:00',
        endTime: '21:00',
      },
    ],
  })
  studyTimes: { startTime: string; endTime: string }[];

  @Expose()
  @ApiProperty({ description: '스터디 설명', type: String })
  studyDescription: string;

  @Expose()
  @ApiProperty({
    description: '스터디 회차별 내용',
    type: [String],
    example: ['1회차 내용', '2회차 내용', '3회차 내용'],
  })
  studyContents: string[];
}
