import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

class StudyTimeDto {
  @Expose()
  @ApiProperty({ description: '스터디 시작 시간', type: String })
  startTime: string;

  @Expose()
  @ApiProperty({ description: '스터디 끝나는 시간', type: String })
  endTime: string;
}

export class StudyBriefInfoResponseDto {
  @Expose()
  @ApiProperty({ description: '스터디 ID', type: String })
  studyId: string;

  @Expose()
  @ApiProperty({ description: '스터디 이름', type: String })
  studyName: string;

  @Expose()
  @ApiProperty({ description: '스터디장 여부', type: Boolean })
  isManager: boolean;

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
    example: '2024-09-01',
  })
  studyStartDate: Date;

  @Expose()
  @ApiProperty({
    description: '스터디 끝나는 날짜',
    type: Date,
    example: '2024-09-28',
  })
  studyEndDate: Date;

  @Expose()
  @ApiProperty({
    description: '진행 요일 (0: 월, 1: 화, 2: 수, 3: 목, 4: 금, 5: 토, 6: 일)',
    type: [Number],
    example: [0, 2],
  })
  @Transform(({ value }) => value.map((v: string) => Number(v)), {
    toPlainOnly: true,
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
  @ApiProperty({
    description: '금주 주차, 종료된 스터일 경우 -1',
    type: Number,
  })
  currentWeek: number;
}
