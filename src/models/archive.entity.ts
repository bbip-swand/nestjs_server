import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreateDateEntity } from './base/create-date.entity';
import { StudyInfo } from './study-info.entity';
import { StudyMember } from './study-member.entity';

@Entity('archive')
export class Archive extends CreateDateEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  dbArchiveId: number;

  @Column()
  fileName: string;

  @ManyToOne(() => StudyInfo, (studyInfo) => studyInfo.relArchive, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'studyId',
    referencedColumnName: 'dbStudyInfoId',
  })
  relStudyInfo: StudyInfo;

  @ManyToOne(() => StudyMember, (studyMember) => studyMember.relArchive, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'uploaderId',
    referencedColumnName: 'dbStudyMemberId',
  })
  uploader: StudyMember;
}
