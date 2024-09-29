import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FcmRequestDto {
  @Expose()
  @ApiProperty({
    name: 'fcmToken',
    type: 'string',
    description: 'FCM 토큰을 입력하세요.',
    required: true,
  })
  readonly fcmToken: string;
}
