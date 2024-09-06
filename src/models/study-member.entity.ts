import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { StudyInfo } from './study-info.entity';
import { UpdateDateEntity } from './base/update-date.entity';
import { UserRole } from './user.entity.types';

@Entity({ name: 'studymember' })
export class StudyMember extends UpdateDateEntity {
  //복합 기본키 설정 - 식별 관계
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  studyId: number;

  @ManyToOne(() => User, (user) => user.relStudyMember)
  relUser: User;

  @ManyToOne(() => StudyInfo, (study) => study.relStudyMember)
  relStudyInfo: StudyInfo;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: 'member',
  })
  role: UserRole;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joinedAt: Date;
}
