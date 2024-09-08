import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AppleSignupRequestDto {
  @Expose()
  @ApiProperty({ type: String })
  readonly identityToken: string;

  @Expose()
  @ApiProperty({ type: String })
  readonly authorizationCode: string;

  @Expose()
  @ApiProperty({ type: String })
  readonly fcmToken: string;
}
