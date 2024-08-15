import { DeleteDateColumn } from 'typeorm';
import { UpdateDateEntity } from './update-date.entity';

export class DeleteDateEntity extends UpdateDateEntity {
  @DeleteDateColumn()
  deletedAt: Date;
}
