import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UpdateDateEntity } from './base/update-date.entity';
import { User } from './user.entity';

@Entity({ name: 'user_info' })
export class UserInfo extends UpdateDateEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  dbUserInfoId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @Column({ nullable: true })
  location1: string;

  @Column({ nullable: true })
  location2: string;

  @Column({ nullable: true })
  location3: string;

  @Column({ nullable: true })
  interest: string;

  @Column({ nullable: true })
  birthYear: number;

  @Column({ nullable: true })
  occupation: string;

  @OneToOne(() => User, (user) => user.relUserInfo, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'dbUserId' })
  relUser: User;

  @Column({ name: 'userId' })
  dbUserId: number;
}
