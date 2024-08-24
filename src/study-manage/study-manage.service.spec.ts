import { Test, TestingModule } from '@nestjs/testing';
import { StudyManageService } from './study-manage.service';

describe('StudyManageService', () => {
  let service: StudyManageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyManageService],
    }).compile();

    service = module.get<StudyManageService>(StudyManageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
