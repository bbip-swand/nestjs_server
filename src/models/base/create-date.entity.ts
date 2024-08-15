import { CreateDateColumn } from 'typeorm';

export class CreateDateEntity {
  @CreateDateColumn()
  createdAt: Date;
}
