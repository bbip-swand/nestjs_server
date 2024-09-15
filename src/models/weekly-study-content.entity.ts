import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UpdateDateEntity } from './base/update-date.entity';
import { StudyInfo } from './study-info.entity';

//현재 필요한 내용만 잡아둔 상태-추가 예정
@Entity({ name: 'weekly_study_content' })
export class WeeklyStudyContent extends UpdateDateEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  dbWeeklyContentId: number;

  @Column()
  session: number;

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
