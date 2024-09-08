import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UpdateDateEntity } from './base/update-date.entity';
import { StudyMember } from './study-member.entity';
import { User } from './user.entity';
import { WeeklyStudyContent } from './weekly-study-content.entity';

@Entity({ name: 'study_info' })
export class StudyInfo extends UpdateDateEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  dbStudyInfoId: number;

  @Column({ unique: true })
  @Generated('uuid')
  studyId: string;

  @Column()
  studyName: string;

  @Column({ nullable: true })
  studyImageUrl: string;

  @Column()
  studyField: number;

  @Column()
  totalWeeks: number;

  @Column({ type: 'date' })
  studyStartDate: Date;

  @Column({ type: 'date' })
  studyEndDate: Date;

  @Column('simple-array')
  daysOfWeek: string[]; //진행 요일

  @Column()
  studyDescription: string;

  @Column({ nullable: true })
  studyInviteCode: string;

  @OneToMany(() => StudyMember, (studyMember) => studyMember.relStudyInfo)
  relStudyMember: StudyMember[];

  @OneToMany(
    () => WeeklyStudyContent,
    (weeklyStudyContent) => weeklyStudyContent.relStudyInfo,
  )
  relWeeklyStudyContent: WeeklyStudyContent[];

  @ManyToOne(() => User, (user) => user.relStudyInfo, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'studyLeaderId', referencedColumnName: 'dbUserId' })
  relUser: User;

  @Column({ name: 'studyLeaderId', nullable: true })
  studyLeaderId: number;
}
