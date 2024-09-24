import { Expose, Transform } from 'class-transformer';

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
  @Transform(({ value }) => value.map((v: string) => Number(v)), {
    toPlainOnly: true,
  })
  daysOfWeek: string[];

  @Expose()
  studyDescription: string;

  @Expose()
  studyContents: string[];
}
