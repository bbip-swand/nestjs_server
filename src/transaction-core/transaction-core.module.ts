import { Module } from '@nestjs/common';
import { TransactionCoreService } from './transaction-core.service';
import { TransactionManager } from './transaction-manager';

@Module({
  providers: [TransactionCoreService, TransactionManager],
  exports: [TransactionCoreService, TransactionManager],
})
export class TransactionCoreModule {}
