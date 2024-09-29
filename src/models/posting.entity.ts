import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreateDateEntity } from './base/create-date.entity';
import { Comment } from './comment.entity';
import { StudyInfo } from './study-info.entity';
import { StudyMember } from './study-member.entity';

@Entity({ name: 'posting' })
export class Posting extends CreateDateEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  dbPostingId: number;

  @Column({ unique: true })
  @Generated('uuid')
  postingId: string;

  @ManyToOne(() => StudyMember, (studyMember) => studyMember.relPosting, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'writerId',
    referencedColumnName: 'dbStudyMemberId',
  })
  writer: StudyMember;

  @ManyToOne(() => StudyInfo, (studyInfo) => studyInfo.relPosting, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'studyId',
    referencedColumnName: 'dbStudyInfoId',
  })
  relStudyInfo: StudyInfo;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  week: number;

  @Column({ default: false })
  isNotice: boolean;

  @OneToMany(() => Comment, (comment) => comment.relPosting)
  relComment: Comment[];
}
