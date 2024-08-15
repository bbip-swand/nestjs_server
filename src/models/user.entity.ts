import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UpdateDateEntity } from './base/update-date.entity';

@Entity({ name: 'USER' })
export class User extends UpdateDateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, unique: true })
  appleId: string;

  @Column()
  name: string;

  @Column()
  uuid: string;

  @Column()
  refreshToken: string;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
