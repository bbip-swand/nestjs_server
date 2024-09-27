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

export class StudyMembersDto {
  @Expose()
  @ApiProperty({ description: '스터디 멤버 이름', type: String })
  memberName: string;

  @Expose()
  @ApiProperty({ description: '스터디장 여부', type: Number })
  isManager: number;

  @Expose()
  @ApiProperty({ description: '스터디 멤버 사진 url(S3)', type: String })
  memberImageUrl: string;

  @Expose()
  @ApiProperty({ description: '관심분야', type: [Number] })
  interest: number[];
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
  @ApiProperty({ description: '현재 추자', type: Number })
  currentWeek: number;

  @Expose()
  @ApiProperty({ description: '이번주 스터디 진행 날짜', type: String })
  pendingDate: string;

  @Expose()
  @ApiProperty({ description: '이번 주 스터디 진행 시간', type: Number })
  pendingDateIndex: number;

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
  @ApiProperty({ description: '스터디 설명', type: String })
  studyDescription: string;

  @Expose()
  @ApiProperty({
    description: '스터디 회차별 내용',
    type: [String],
    example: ['1주차 내용', '2주차 내용', '3주차 내용'],
  })
  studyContents: string[];

  @Expose()
  @ApiProperty({ description: '스터디 멤버 정보', type: [StudyMembersDto] })
  studyMembers: StudyMembersDto[];
}
