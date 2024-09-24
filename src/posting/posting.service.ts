import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addHours, subDays } from 'date-fns';
import { Comment } from 'src/models/comment.entity';
import { Posting } from 'src/models/posting.entity';
import { StudyInfo } from 'src/models/study-info.entity';
import { StudyMember } from 'src/models/study-member.entity';
import { UserInfo } from 'src/models/user-info.entity';
import { Between, In, Repository } from 'typeorm';
import { PostingResponseDto } from './dto/postingInfo-response.dto';

@Injectable()
export class PostingService {
  constructor(
    @InjectRepository(Posting)
    private postingRepository: Repository<Posting>,
    @InjectRepository(StudyInfo)
    private studyInfoRepository: Repository<StudyInfo>,
    @InjectRepository(StudyMember)
    private studyMemberRepository: Repository<StudyMember>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
  ) {}

  async findRecentPosting(user): Promise<PostingResponseDto[]> {
    const studyMembers: StudyMember[] = await this.studyMemberRepository.find({
      where: { dbUserId: user.dbUserId },
    });
    const studyIds: number[] = studyMembers.map(
      (studyMember) => studyMember.dbStudyInfoId,
    );

    const date = new Date();
    const todayDate: Date = addHours(date, 9);
    const weekAgoDate: Date = subDays(todayDate, 7);

    const postings: Posting[] = await this.postingRepository.find({
      where: {
        relStudyInfo: In(studyIds),
        createdAt: Between(weekAgoDate, todayDate),
      },
      relations: ['relStudyInfo', 'writer'],
      order: { createdAt: 'ASC' },
      take: 10,
    });
    const writer = await this.userInfoRepository.findOne({
      where: { dbUserId: user.dbUserId },
    });
    const postingsWithStudyNames = postings.map((posting) => ({
      studyName: posting.relStudyInfo.studyName,
      postingId: posting.postingId,
      writer: writer.name,
      title: posting.title,
      content: posting.content,
      isNotice: posting.isNotice,
      createdAt: posting.createdAt,
    }));

    return postingsWithStudyNames;
  }

  async findOne(postingId: string, user) {
    const posting: Posting = await this.postingRepository.findOne({
      where: { postingId },
      relations: ['relComment', 'relStudyInfo'],
    });
    if (!posting) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const studyMember: StudyMember = await this.studyMemberRepository.findOne({
      where: {
        dbUserId: user.dbUserId,
        dbStudyInfoId: posting.relStudyInfo.dbStudyInfoId,
      },
    });
    if (!studyMember) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const { relStudyInfo, ...result } = posting;
    return result;
  }

  async createPosting(createPostingRequestDto, user) {
    const studyInfo: StudyInfo = await this.studyInfoRepository.findOne({
      where: { studyId: createPostingRequestDto.studyId },
    });
    if (!studyInfo) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const studyMember: StudyMember = await this.studyMemberRepository.findOne({
      where: {
        dbUserId: user.dbUserId,
        dbStudyInfoId: studyInfo.dbStudyInfoId,
      },
    });

    if (!studyMember) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    if (createPostingRequestDto.isNotice && !studyMember.isManager) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const posting: Posting = new Posting();
    posting.title = createPostingRequestDto.title;
    posting.content = createPostingRequestDto.content;
    posting.isNotice = createPostingRequestDto.isNotice;
    posting.writer = studyMember;
    posting.relStudyInfo = studyInfo;

    await this.postingRepository.save(posting);

    return posting;
  }

  async createComment(postingId: string, content: string, user) {
    const posting: Posting = await this.postingRepository.findOne({
      where: { postingId },
      relations: ['relStudyInfo'],
    });
    if (!posting) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    const studyMember: StudyMember = await this.studyMemberRepository.findOne({
      where: {
        dbUserId: user.dbUserId,
        dbStudyInfoId: posting.relStudyInfo.dbStudyInfoId,
      },
    });
    if (!studyMember) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    const comment: Comment = new Comment();
    comment.content = content;
    comment.writer = studyMember;
    comment.relPosting = posting;

    await this.commentRepository.save(comment);

    return comment;
  }
}
