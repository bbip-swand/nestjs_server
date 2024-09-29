import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Archive } from 'src/models/archive.entity';
import { StudyInfo } from 'src/models/study-info.entity';
import { StudyMember } from 'src/models/study-member.entity';
import { User } from 'src/models/user.entity';
import { Repository } from 'typeorm';
import { GetUploadFilePresignedUrlRequestDto } from './dto/get-upload-file-presigned-url-request.dto';

@Injectable()
export class AwsS3Service {
  constructor(
    @Inject('AWS_S3_SERVICE')
    private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
    @InjectRepository(Archive)
    private archiveRepository: Repository<Archive>,
    @InjectRepository(StudyInfo)
    private studyInfoRepository: Repository<StudyInfo>,
    @InjectRepository(StudyMember)
    private studyMemberRepository: Repository<StudyMember>,
  ) {}

  async getImagePresignedUrl(fileName: string) {
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: `images/${fileName}`,
      ContentType: 'image/*',
    });
    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60,
    });
    return signedUrl;
  }

  async getFilePresignedUrl(
    dto: GetUploadFilePresignedUrlRequestDto,
    user: User,
  ) {
    const { fileName, studyId } = dto;
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: `Archive/${fileName}`,
    });
    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60,
    });
    const studyInfo = await this.studyInfoRepository.findOne({
      where: { studyId },
    });
    if (!studyInfo) {
      throw new Error('Study not found');
    }
    const studyMember = await this.studyMemberRepository.findOne({
      where: {
        dbUserId: user.dbUserId,
        dbStudyInfoId: studyInfo.dbStudyInfoId,
      },
    });
    if (!studyMember) {
      throw new Error('User is not a member of the study');
    }
    await this.archiveRepository.save({
      fileName,
      relStudyInfo: studyInfo,
      uploader: studyMember,
    });
    return signedUrl;
  }
}
