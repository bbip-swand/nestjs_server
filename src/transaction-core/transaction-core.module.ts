import { Module } from '@nestjs/common';
import { TransactionCoreService } from './transaction-core.service';

@Module({
  providers: [TransactionCoreService],
  exports: [TransactionCoreService],
})
export class TransactionCoreModule {}
