import { Test, TestingModule } from '@nestjs/testing';
import { StudyManageController } from './study-manage.controller';
import { StudyManageService } from './study-manage.service';

describe('StudyManageController', () => {
  let controller: StudyManageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudyManageController],
      providers: [StudyManageService],
    }).compile();

    controller = module.get<StudyManageController>(StudyManageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
