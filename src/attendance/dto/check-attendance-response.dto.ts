import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CheckAttendanceResponseDto {
  @Expose()
  @ApiProperty({ type: Number, description: '출석 코드' })
  code: number;

  @Expose()
  @ApiProperty({ type: String, description: '출석 시작 시간' })
  startTime: string;

  @Expose()
  @ApiProperty({ type: Number, description: '출석 코드 만료 시간(sec)' })
  ttl: number;

  @Expose()
  @ApiProperty({ type: String, description: '출석 생성한 스터디 uuid' })
  studyId: string;
}
