import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UpdatePlaceRequestDto {
  @Expose()
  @ApiProperty({ description: '세션', type: Number })
  session: number;

  @Expose()
  @ApiProperty({ description: '스터디 장소', type: String })
  place: string;
}
