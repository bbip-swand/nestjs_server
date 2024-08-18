import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class userInfoRequestDto {
  @Expose()
  @ApiProperty({ type: String })
  name: string;

  @Expose()
  @ApiProperty({ type: String })
  profileImageUrl?: string;

  @Expose()
  @ApiProperty({ type: String })
  location1?: string;

  @Expose()
  @ApiProperty({ type: String })
  location2?: string;

  @Expose()
  @ApiProperty({ type: String })
  location3?: string;

  @Expose()
  @ApiProperty({ type: String })
  interest?: string;

  @Expose()
  @ApiProperty({ type: String })
  occupation?: string;

  @Expose()
  @ApiProperty({ type: Number })
  birthYear?: number;
}
