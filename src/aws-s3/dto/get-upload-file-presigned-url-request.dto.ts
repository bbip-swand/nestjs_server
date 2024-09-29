import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetUploadFilePresignedUrlRequestDto {
  @Expose()
  @ApiProperty({
    example: 'image.jpg',
    description: '파일명',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @Expose()
  @ApiProperty({
    description: '스터디 아이디',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  studyId: string;
}
