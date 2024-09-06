import { Test, TestingModule } from '@nestjs/testing';
import { StudyCreateController } from './study-create.controller';
import { StudyCreateService } from './study-create.service';

describe('StudyCreateController', () => {
  let controller: StudyCreateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudyCreateController],
      providers: [StudyCreateService],
    }).compile();

    controller = module.get<StudyCreateController>(StudyCreateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
