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

export class IndividualStudyResponseDto {
  @Expose()
  @ApiProperty({ description: '스터디 ID', type: String })
  studyId: string;

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
    type: String,
  })
  studyField: string;

  @Expose()
  @ApiProperty({ description: '스터디 날짜', type: String })
  studyDate: string;

  @Expose()
  @ApiProperty({
    description: '요일 (0: 월, 1: 화, 2: 수, 3: 목, 4: 금, 5: 토, 6: 일)',
    type: Number,
  })
  dayOfWeek: number;

  @Expose()
  @ApiProperty({ description: '스터디 시간', type: StudyTimeDto })
  studyTime: {
    startTime: string;
    endTime: string;
  };

  @Expose()
  @ApiProperty({ description: '스터디 내용', type: String })
  studyContent: string;
}
