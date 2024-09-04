import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetPresignedUrlRequestDto {
  @Expose()
  @ApiProperty({
    example: 'image.jpg',
    description: '파일명',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;
}
