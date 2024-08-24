import { Test, TestingModule } from '@nestjs/testing';
import { StudyCreateService } from './study-create.service';

describe('StudyCreateService', () => {
  let service: StudyCreateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyCreateService],
    }).compile();

    service = module.get<StudyCreateService>(StudyCreateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
