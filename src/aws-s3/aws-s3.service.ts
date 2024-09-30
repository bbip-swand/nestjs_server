import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Archive } from 'src/models/archive.entity';
import { StudyInfo } from 'src/models/study-info.entity';
import { StudyMember } from 'src/models/study-member.entity';
import { User } from 'src/models/user.entity';
import { Not, Repository } from 'typeorm';
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
    private readonly firebaseService: FirebaseService,
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
    const { fileName, fileKey, studyId } = dto;
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: `Archive/${fileKey}`,
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
    const studyMembers: StudyMember[] = await this.studyMemberRepository.find({
      where: {
        dbStudyInfoId: studyInfo.dbStudyInfoId,
        dbUserId: Not(user.dbUserId),
      },
      relations: ['relUser'],
    });
    const fcmTokens = studyMembers.map(
      (studyMember) => studyMember.relUser.fcmToken,
    );
    await this.firebaseService.multiFcm(
      fcmTokens,
      '자료가 업로드 되었습니다.',
      studyInfo.studyName,
    );
    await this.archiveRepository.save({
      fileName,
      fileKey,
      relStudyInfo: studyInfo,
      uploader: studyMember,
    });
    return signedUrl;
  }

  async getPresignedUrl({
    fileName,
    fileKey,
  }: {
    fileName: string;
    fileKey: string;
  }) {
    const getObjectCommand = new GetObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: `Archive/${fileKey}`,
      ResponseContentDisposition: `attachment; filename="${fileName}"`,
    });
    const fileUrl = await getSignedUrl(this.s3Client, getObjectCommand, {
      expiresIn: 60 * 60 * 24 * 7,
    });
    const headObjectCommand = new HeadObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: `Archive/${fileKey}`,
    });
    const data = await this.s3Client.send(headObjectCommand);
    const ContentLength = data.ContentLength;
    function formatBytes(bytes) {
      if (bytes === 0) return '0 Bytes';
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      const size = parseFloat((bytes / Math.pow(1024, i)).toFixed(1));
      return `${size}${sizes[i]}`;
    }
    const fileSize = formatBytes(ContentLength);
    return {
      fileUrl,
      fileSize,
    };
  }
}
