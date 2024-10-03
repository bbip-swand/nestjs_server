import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class isNewUserResponseDto {
  @Expose()
  @ApiProperty({ type: Boolean })
  isNewUser: boolean;
}
