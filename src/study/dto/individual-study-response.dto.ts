import { Expose } from 'class-transformer';

export class IndividualStudyResponseDto {
  @Expose()
  studyId: string;

  @Expose()
  studyName: string;

  @Expose()
  studyImageUrl: string;

  @Expose()
  studyField: string;

  @Expose()
  studyDate: string;

  @Expose()
  dayOfWeek: number;

  @Expose()
  studyTime: {
    startTime: string;
    endTime: string;
  };

  @Expose()
  studyContent: string;
}
