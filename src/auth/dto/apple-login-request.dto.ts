import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AppleLoginRequestDto {
  @Expose()
  @ApiProperty({ type: String })
  readonly identityToken: string;
}
