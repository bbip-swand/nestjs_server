import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addHours, subDays } from 'date-fns';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Comment } from 'src/models/comment.entity';
import { Posting } from 'src/models/posting.entity';
import { StudyInfo } from 'src/models/study-info.entity';
import { StudyMember } from 'src/models/study-member.entity';
import { UserInfo } from 'src/models/user-info.entity';
import { Between, In, Not, Repository } from 'typeorm';
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
    private firebaseService: FirebaseService,
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
      order: { createdAt: 'DESC' },
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
      week: posting.week,
      content: posting.content,
      isNotice: posting.isNotice,
      createdAt: posting.createdAt,
    }));

    return postingsWithStudyNames;
  }

  async findOne(postingId: string, user) {
    const posting: Posting = await this.postingRepository.findOne({
      where: { postingId },
      relations: ['relComment', 'relStudyInfo', 'writer'],
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
    const { relStudyInfo, dbPostingId, relComment, writer, ...rest } = posting;
    const writerInfo = await this.userInfoRepository.findOne({
      where: { dbUserId: posting.writer.dbUserId },
    });
    const comments = await Promise.all(
      relComment.map(async (comment) => {
        const commentWriter = await this.commentRepository.findOne({
          where: { dbCommentId: comment.dbCommentId },
          relations: ['writer'],
        });
        const commentWriterInfo = await this.userInfoRepository.findOne({
          where: { dbUserId: commentWriter.writer.dbUserId },
        });
        return {
          writer: commentWriterInfo.name,
          isManager: commentWriter.writer.isManager,
          profileImageUrl: commentWriterInfo.profileImageUrl,
          content: comment.content,
          createdAt: comment.createdAt,
        };
      }),
    );
    const result = {
      studyName: relStudyInfo.studyName,
      writer: writerInfo.name,
      isManager: writer.isManager,
      profileImageUrl: writerInfo.profileImageUrl,
      comments,
      ...rest,
    };
    return result;
  }

  async findAllPosting(studyId: string, user: any) {
    const studyInfo = await this.studyInfoRepository.findOne({
      where: { studyId: studyId },
    });

    const postings = await this.postingRepository.find({
      where: { relStudyInfo: In([studyInfo.dbStudyInfoId]) },
      relations: ['writer'],
    });

    const response = await Promise.all(
      postings.map(async (posting) => {
        const writer = await this.userInfoRepository.findOne({
          where: { dbUserId: posting.writer.dbUserId },
        });
        return {
          studyName: studyInfo.studyName,
          postingId: posting.postingId,
          writer: writer.name,
          title: posting.title,
          content: posting.content,
          week: posting.week,
          isNotice: posting.isNotice,
          createdAt: posting.createdAt,
        };
      }),
    );
    return response;
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

    const posting: Posting = new Posting();
    posting.title = createPostingRequestDto.title;
    posting.content = createPostingRequestDto.content;
    posting.isNotice = createPostingRequestDto.isNotice;
    posting.writer = studyMember;
    posting.relStudyInfo = studyInfo;
    posting.week = createPostingRequestDto.week;

    await this.postingRepository.save(posting);
    await this.firebaseService.multiFcm(
      fcmTokens,
      '새로운 게시글이 등록되었습니다.',
      createPostingRequestDto.title,
    );

    return posting;
  }

  async createComment(postingId: string, content: string, user) {
    const posting: Posting = await this.postingRepository.findOne({
      where: { postingId },
      relations: ['relStudyInfo', 'writer'],
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
    const postingUser = await this.studyMemberRepository.findOne({
      where: { dbUserId: posting.writer.dbUserId },
      relations: ['relUser'],
    });
    await this.firebaseService.fcm(
      postingUser.relUser.fcmToken,
      '새로운 댓글이 등록되었습니다.',
      posting.title,
    );
    await this.commentRepository.save(comment);

    return comment;
  }
}
