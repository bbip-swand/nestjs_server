import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AppleLoginResponseDto {
  @Expose()
  @ApiProperty({ type: String, description: 'Access Token' })
  readonly accessToken: string;
}
