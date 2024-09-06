import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UpdateDateEntity } from './base/update-date.entity';
import { StudyInfo } from './study-info.entity';
import { StudyMember } from './study-member.entity';
import { UserInfo } from './user-info.entity';

@Entity({ name: 'user' })
export class User extends UpdateDateEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  dbUserId: number;

  @Column({ nullable: true, unique: true })
  appleId: string;

  @Column()
  refreshToken: string;

  @Column({ nullable: false, default: false })
  isUserInfoGenerated: boolean;

  @OneToOne(() => UserInfo, (userInfo) => userInfo.relUser)
  relUserInfo: UserInfo;

  @OneToMany(() => StudyMember, (studyMember) => studyMember.relUser, {
    cascade: true,
    eager: true, // eager: true를 설정하면 User를 select할 때 StudyInfo도 같이 select된다.
  })
  relStudyMember: StudyMember[];

  @OneToMany(() => StudyInfo, (studyInfo) => studyInfo.relUser)
  relStudyInfo: StudyInfo[];
}
