import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateAttendanceResponseDto {
  @Expose()
  @ApiProperty({ type: Number, description: '출석코드' })
  readonly code: number;
}
