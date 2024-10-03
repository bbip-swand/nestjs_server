import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CheckAttendanceResponseDto {
  @Expose()
  @ApiProperty({ type: String, description: '스터디명' })
  studyName: string;

  @Expose()
  @ApiProperty({ type: String, description: '출석 생성한 스터디 uuid' })
  studyId: string;

  @Expose()
  @ApiProperty({ type: Number, description: '출석 세션(회차)' })
  session: number;

  @Expose()
  @ApiProperty({ type: String, description: '출석 시작 시간' })
  startTime: string;

  @Expose()
  @ApiProperty({ type: Number, description: '출석 코드 만료 시간(sec)' })
  ttl: number;

  @Expose()
  @ApiProperty({ type: Number, description: '출석 인증 코드' })
  code?: number;

  @Expose()
  @ApiProperty({ description: '스터디장 여부', type: Boolean })
  isManager: boolean;

  @Expose()
  @ApiProperty({ description: '출석 인증 여부', type: Boolean })
  status: boolean;
}
