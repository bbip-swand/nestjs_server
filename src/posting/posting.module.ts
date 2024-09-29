import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { Comment } from 'src/models/comment.entity';
import { Posting } from 'src/models/posting.entity';
import { StudyInfo } from 'src/models/study-info.entity';
import { StudyMember } from 'src/models/study-member.entity';
import { UserInfo } from 'src/models/user-info.entity';
import { PostingController } from './posting.controller';
import { PostingService } from './posting.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Posting,
      Comment,
      StudyInfo,
      StudyMember,
      UserInfo,
    ]),
    FirebaseModule,
  ],
  controllers: [PostingController],
  providers: [PostingService],
})
export class PostingModule {}
