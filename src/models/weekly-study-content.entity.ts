import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UpdateDateEntity } from './base/update-date.entity';
import { StudyInfo } from './study-info.entity';

@Entity({ name: 'weekly_study_content' })
export class WeeklyStudyContent extends UpdateDateEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  dbWeeklyContentId: number;

  @Column()
  week: number;

  @Column({ nullable: false, default: '' })
  place: string;

  @Column({ type: 'date' })
  studyStartDate: Date;

  @Column()
  content: string;

  @ManyToOne(() => StudyInfo, (studyInfo) => studyInfo.relWeeklyStudyContent, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'studyInfoId', referencedColumnName: 'dbStudyInfoId' })
  relStudyInfo: StudyInfo;

  @Column({ name: 'studyInfoId' })
  dbStudyInfoId: number;
}
