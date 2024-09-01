import { Injectable } from '@nestjs/common';
import { TransactionManager } from './transaction-manager';

@Injectable()
export class TransactionCoreService {
  async startTransaction(
    transaction: TransactionManager,
    func: () => Promise<any>,
  ) {
    const created = await transaction.create();
    let isRoot = false; // 가장 바깥의 startTransaction 호출 부 일때에만 commit/rollback/release 수행
    if (created) {
      isRoot = true;
      console.log('transaction created');
      transaction.start();
    }
    try {
      const result = await func();
      if (isRoot) {
        await transaction.commit();
      }
      return result;
    } catch (err) {
      if (isRoot) {
        console.log('transaction rollback');
        await transaction.rollback();
      }
      throw err;
    } finally {
      if (isRoot) {
        await transaction.release();
      }
    }
  }
}
