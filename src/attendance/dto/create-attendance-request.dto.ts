import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateAttendanceDto {
  @Expose()
  @ApiProperty({ type: String, description: '출석 생성할 스터디 uuid' })
  readonly studyId: string;

  @Expose()
  @ApiProperty({ type: Number, description: '출석 회차' })
  readonly session: number;
}
