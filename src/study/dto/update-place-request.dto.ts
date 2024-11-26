import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UpdatePlaceRequestDto {
  @Expose()
  @ApiProperty({ description: '주차', type: Number })
  week: number;

  @Expose()
  @ApiProperty({ description: '스터디 장소', type: String })
  place: string;
}
