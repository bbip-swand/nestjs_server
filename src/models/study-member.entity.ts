import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Archive } from './archive.entity';
import { Attendance } from './attendance.entity';
import { UpdateDateEntity } from './base/update-date.entity';
import { Comment } from './comment.entity';
import { Posting } from './posting.entity';
import { StudyInfo } from './study-info.entity';
import { User } from './user.entity';

@Entity({ name: 'study_member' })
export class StudyMember extends UpdateDateEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  dbStudyMemberId: number;

  @PrimaryColumn({ name: 'userId' })
  dbUserId: number;

  @PrimaryColumn({ name: 'studyId' })
  dbStudyInfoId: number;

  @Column({ default: false })
  isManager: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joinedAt: Date;

  @ManyToOne(() => User, (user) => user.relStudyMember, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'dbUserId' })
  relUser: User;

  @ManyToOne(() => StudyInfo, (study) => study.relStudyMember, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'studyId', referencedColumnName: 'dbStudyInfoId' })
  relStudyInfo: StudyInfo;

  @OneToMany(() => Archive, (archive) => archive.uploader)
  relArchive: Archive[];

  @OneToMany(() => Attendance, (attendance) => attendance.relStudyMember)
  relAttendance: Attendance[];

  @OneToMany(() => Posting, (posting) => posting.writer)
  relPosting: Posting[];

  @OneToMany(() => Comment, (comment) => comment.writer)
  relComment: Comment[];
}
