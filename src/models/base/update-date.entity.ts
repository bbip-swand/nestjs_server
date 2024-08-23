import { UpdateDateColumn } from 'typeorm';
import { CreateDateEntity } from './create-date.entity';

export class UpdateDateEntity extends CreateDateEntity {
  @UpdateDateColumn()
  updatedAt: Date;
}
