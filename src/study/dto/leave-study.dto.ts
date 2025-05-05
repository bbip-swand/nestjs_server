import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LeaveStudyDto {
  @Expose()
  @ApiProperty({ description: '스터디 ID', type: String })
  studyId: string;
}
