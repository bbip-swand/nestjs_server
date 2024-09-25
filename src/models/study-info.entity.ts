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
import { Calendar } from './calendar.entity';
import { Posting } from './posting.entity';
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

  @Column({ type: 'simple-array' })
  daysOfWeek: number[];

  @Column({ type: 'simple-json' })
  studyTimes: {
    startTime: string;
    endTime: string;
  }[];

  @Column()
  studyDescription: string;

  @Column()
  studyInviteCode: string;

  @OneToMany(() => StudyMember, (studyMember) => studyMember.relStudyInfo)
  relStudyMember: StudyMember[];

  @OneToMany(
    () => WeeklyStudyContent,
    (weeklyStudyContent) => weeklyStudyContent.relStudyInfo,
  )
  relWeeklyStudyContent: WeeklyStudyContent[];

  @OneToMany(() => Posting, (posting) => posting.relStudyInfo)
  relPosting: Posting[];

  @OneToMany(() => Calendar, (calendar) => calendar.relstudyInfo)
  relCalendar: Calendar[];

  @ManyToOne(() => User, (user) => user.relStudyInfo, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'studyLeaderId', referencedColumnName: 'dbUserId' })
  relUser: User;

  @Column({ name: 'studyLeaderId', nullable: true })
  studyLeaderId: number;
}
