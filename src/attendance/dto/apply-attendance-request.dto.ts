import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ApplyAttendanceRequestDto {
  @Expose()
  @ApiProperty({ type: String, description: '출석 인증할 스터디 uuid' })
  studyId: string;

  @Expose()
  @ApiProperty({ type: Number, description: '출석 인증 코드' })
  code: number;
}
