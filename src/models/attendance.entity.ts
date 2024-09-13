import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreateDateEntity } from './base/create-date.entity';
import { StudyMember } from './study-member.entity';

@Entity('attendance')
export class Attendance extends CreateDateEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  dbAttendanceId: number;

  @ManyToOne(() => StudyMember, (studyMember) => studyMember.relAttendance, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    { name: 'userId', referencedColumnName: 'dbUserId' },
    { name: 'studyId', referencedColumnName: 'dbStudyInfoId' },
  ])
  relStudyMember: StudyMember;

  @Column({ name: 'userId' })
  dbUserId: number;

  @Column({ name: 'studyId' })
  dbStudyInfoId: number;

  @Column({ type: 'int' })
  week: number;

  @Column({
    type: 'enum',
    enum: ['ATTENDED', 'ABSENT'],
    default: 'ABSENT',
  })
  status: 'ATTENDED' | 'ABSENT';
}
