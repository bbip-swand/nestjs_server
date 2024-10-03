import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class userInfoRequestDto {
  @Expose()
  @ApiProperty({ type: String })
  name: string;

  @Expose()
  @ApiProperty({ type: String, example: 'null' })
  profileImageUrl?: string;

  @Expose()
  @ApiProperty({
    type: [String],
    description: 'Array of locations in the format [도, 시, 구]',
    example: ['경기도', '수원시', '영통구'],
  })
  location?: string[];

  @Expose()
  @ApiProperty({ type: Number, isArray: true })
  interest?: number[];

  @Expose()
  @ApiProperty({ type: Number })
  occupation?: number;

  @Expose()
  @ApiProperty({ type: Number })
  birthYear?: number;
}
