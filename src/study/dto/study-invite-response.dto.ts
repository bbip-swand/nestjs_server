import { Expose } from 'class-transformer';

export class StudyInviteResponseDto {
  @Expose()
  studyId: string;

  @Expose()
  studyName: string;

  @Expose()
  studyImageUrl: string;

  @Expose()
  studyField: string;

  @Expose()
  totalWeeks: number;

  @Expose()
  studyStartDate: Date;

  @Expose()
  studyEndDate: Date;

  @Expose()
  daysOfWeek: string[];

  @Expose()
  studyDescription: string;

  @Expose()
  studyContents: string[];
}
