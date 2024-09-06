import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AppleLoginResponseDto {
  @Expose()
  @ApiProperty({ type: String, description: 'Access Token' })
  readonly accessToken: string;

  @Expose()
  @ApiProperty({
    type: Boolean,
    description: '사용자 정보가 생성되었는지 여부',
  })
  readonly isUserInfoGenerated: boolean;
}
