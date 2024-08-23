import { Test, TestingModule } from '@nestjs/testing';
import { TransactionCoreService } from './transaction-core.service';

describe('TransactionCoreService', () => {
  let service: TransactionCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionCoreService],
    }).compile();

    service = module.get<TransactionCoreService>(TransactionCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
