import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UpdateDateEntity } from './base/update-date.entity';
import { StudyInfo } from './study-info.entity';
import { User } from './user.entity';
import { Attendance } from './attendance.entity';

@Entity({ name: 'study_member' })
export class StudyMember extends UpdateDateEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  dbStudyMemberId: number;

  @PrimaryColumn({ name: 'userId' })
  dbUserId: number;

  @PrimaryColumn({ name: 'studyId' })
  dbStudyInfoId: number;

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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joinedAt: Date;

  @OneToMany(() => Attendance, (attendance) => attendance.relStudyMember)
  relAttendance: Attendance[];
}
