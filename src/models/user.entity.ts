import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UpdateDateEntity } from './base/update-date.entity';
import { UserStatus } from './common/enums';
import { UserInfo } from './user-info.entity';

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
}
