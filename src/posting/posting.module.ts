import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/models/comment.entity';
import { Posting } from 'src/models/posting.entity';
import { StudyInfo } from 'src/models/study-info.entity';
import { StudyMember } from 'src/models/study-member.entity';
import { PostingController } from './posting.controller';
import { PostingService } from './posting.service';
import { UserInfo } from 'src/models/user-info.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Posting,
      Comment,
      StudyInfo,
      StudyMember,
      UserInfo,
    ]),
  ],
  controllers: [PostingController],
  providers: [PostingService],
})
export class PostingModule {}
