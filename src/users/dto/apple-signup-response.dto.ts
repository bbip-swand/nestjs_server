import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AppleSignupResponseDto {
  @Expose()
  @ApiProperty({ type: String, description: 'Access Token' })
  readonly accessToken: string;
}
