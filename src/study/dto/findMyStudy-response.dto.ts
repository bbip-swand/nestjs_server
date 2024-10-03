import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class findMyStudyResponseDto {
  @Expose()
  @ApiProperty({ description: '스터디 id', type: String })
  studyId: string;

  @Expose()
  @ApiProperty({ description: '스터디 이름', type: String })
  studyName: string;
}
