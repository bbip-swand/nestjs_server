import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { Archive } from 'src/models/archive.entity';
import { StudyInfo } from 'src/models/study-info.entity';
import { StudyMember } from 'src/models/study-member.entity';
import { User } from 'src/models/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArchiveService {
  constructor(
    @InjectRepository(Archive)
    private archiveRepository: Repository<Archive>,
    @InjectRepository(StudyInfo)
    private studyInfoRepository: Repository<StudyInfo>,
    @InjectRepository(StudyMember)
    private studyMemberRepository: Repository<StudyMember>,
    private readonly AwsS3Service: AwsS3Service,
  ) {}

  async getArchive(studyId: string, user: User) {
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
      throw new Error('Study not found');
    }
    const dbStudyInfoId = studyInfo.dbStudyInfoId;
    const archives: Archive[] = await this.archiveRepository.find({
      where: {
        relStudyInfo: {
          dbStudyInfoId,
        },
      },
      order: { createdAt: 'DESC' },
    });
    const result = await Promise.all(
      archives.map(async (archive) => {
        const { fileUrl, fileSize } = await this.AwsS3Service.getPresignedUrl({
          fileName: archive.fileName,
          fileKey: archive.fileKey,
        });
        return {
          fileName: archive.fileName,
          fileUrl,
          fileSize,
          createdAt: archive.createdAt,
        };
      }),
    );
    return result;
  }
}
