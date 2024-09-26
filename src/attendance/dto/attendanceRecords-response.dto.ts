import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AttendanceRecordsResponseDto {
  @Expose()
  @ApiProperty({ type: Number, description: '출석 세션(회차)' })
  session: number;

  @Expose()
  @ApiProperty({ type: String, description: '스터디원 이름' })
  userName: string;

  @Expose()
  @ApiProperty({ type: String, description: '스터디원 프로필 사진' })
  profileImageUrl: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: '출석 상태',
    example: 'ATTENDED | ABSENT',
  })
  status: string;
}
