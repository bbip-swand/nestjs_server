import { Body, Post, Request } from '@nestjs/common';
import { MemberJwtController } from 'src/utils/decorators/jwt-controller';
import { RestMethod } from 'src/utils/decorators/rest-method';
import { AwsS3Service } from './aws-s3.service';
import { GetPresignedUrlRequestDto } from './dto/get-presigned-url-request.dto';
import { GetUploadFilePresignedUrlRequestDto } from './dto/get-upload-file-presigned-url-request.dto';

@MemberJwtController('aws-s3')
export class AwsS3Controller {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  @Post('upload-image/presigned-url')
  @RestMethod({
    request: GetPresignedUrlRequestDto,
  })
  async getImagePresignedUrl(@Body() dto: GetPresignedUrlRequestDto) {
    const result = await this.awsS3Service.getImagePresignedUrl(dto.fileName);
    return result;
  }

  @Post('upload-file/presigned-url')
  @RestMethod({
    request: GetUploadFilePresignedUrlRequestDto,
  })
  async getFilePresignedUrl(
    @Body() dto: GetUploadFilePresignedUrlRequestDto,
    @Request() req,
  ) {
    const result = await this.awsS3Service.getFilePresignedUrl(dto, req.user);
    return result;
  }
}
