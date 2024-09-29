import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetUploadFilePresignedUrlRequestDto {
  @Expose()
  @ApiProperty({
    example: 'file.pptx',
    description: '파일명',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @Expose()
  @ApiProperty({
    example: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a',
    description: '파일키 (uuid)',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  fileKey: string;

  @Expose()
  @ApiProperty({
    description: '스터디 아이디',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  studyId: string;
}
