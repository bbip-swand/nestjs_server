import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreateDateEntity } from './base/create-date.entity';
import { Posting } from './posting.entity';
import { StudyMember } from './study-member.entity';

@Entity({ name: 'comment' })
export class Comment extends CreateDateEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  dbCommentId: number;

  @ManyToOne(() => Posting, (posting) => posting.relComment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'postingId',
    referencedColumnName: 'dbPostingId',
  })
  relPosting: Posting;

  @ManyToOne(() => StudyMember, (studyMember) => studyMember.relComment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'writerId',
    referencedColumnName: 'dbStudyMemberId',
  })
  writer: StudyMember;

  @Column()
  content: string;
}
