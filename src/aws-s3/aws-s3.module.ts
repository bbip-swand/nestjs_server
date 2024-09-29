import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Archive } from 'src/models/archive.entity';
import { StudyInfo } from 'src/models/study-info.entity';
import { StudyMember } from 'src/models/study-member.entity';
import { AwsS3Controller } from './aws-s3.controller';
import { AwsS3Service } from './aws-s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Archive, StudyInfo, StudyMember])],
  controllers: [AwsS3Controller],
  providers: [
    {
      provide: 'AWS_S3_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          region: configService.get('AWS_S3_REGION'),
          credentials: {
            accessKeyId: configService.get('AWS_S3_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_S3_SECRET_ACCESS_KEY'),
          },
        });
      },
    },
    AwsS3Service,
  ],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
