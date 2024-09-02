import { DataSource, EntityManager, QueryRunner } from 'typeorm';

export class TransactionManager {
  private queryRunner: QueryRunner;
  jobs = [];

  constructor(private readonly dataSource: DataSource) {}

  get manager(): EntityManager {
    if (!this.queryRunner) {
      throw new Error('transaction을 먼저 시작해야합니다.');
    }
    return this.queryRunner.manager;
  }

  async create() {
    if (!this.queryRunner) {
      this.queryRunner = this.dataSource.createQueryRunner();
      return true;
    }
    return false;
  }

  async start() {
    await this.queryRunner.startTransaction();
  }

  async rollback() {
    for (const job of this.jobs.reverse()) {
      await job();
    }
    await this.queryRunner.rollbackTransaction();
  }

  async commit() {
    await this.queryRunner.commitTransaction();
  }

  async release() {
    await this.queryRunner.release();
  }

  async addRollbackJob(func: () => Promise<any>) {
    this.jobs.push(func);
  }
}
