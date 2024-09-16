import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudyInfo } from './study-info.entity';
import { UpdateDateEntity } from './base/update-date.entity';

@Entity({ name: 'calendar' })
export class Calendar extends UpdateDateEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  dbCalendarId: number;

  @Column({ unique: true })
  @Generated('uuid')
  scheduleId: string;

  @Column()
  studyName: string;

  @ManyToOne(() => StudyInfo, (studyInfo) => studyInfo.relCalendar, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'studyId',
    referencedColumnName: 'dbStudyInfoId',
  })
  relstudyInfo: StudyInfo;

  @Column({ name: 'studyId' })
  dbStudyInfoId: number;

  @Column()
  title: string;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ default: false })
  isHomeView: boolean;

  @Column({ nullable: true })
  icon: number;
}
