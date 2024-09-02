import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UpdateDateEntity } from './base/update-date.entity';
import { UserStatus } from './common/enums';
import { UserInfo } from './user-info.entity';
import { StudyInfo } from './study-info.entity';

@Entity({ name: 'user' })
export class User extends UpdateDateEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  dbUserId: number;

  @Column({ nullable: true, unique: true })
  appleId: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column()
  refreshToken: string;

  @OneToOne(() => UserInfo, (userInfo) => userInfo.relUser)
  relUserInfo: UserInfo;

  @OneToMany(() => StudyInfo, (studyInfo) => studyInfo.relUser, {
    cascade: true,
    eager: true, // eager: true를 설정하면 User를 select할 때 StudyInfo도 같이 select된다.
  })
  relStudyInfo: StudyInfo[];
}
