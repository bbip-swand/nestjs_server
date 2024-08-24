import { Module } from '@nestjs/common';
import { StudyCreateService } from './study-create.service';
import { StudyCreateController } from './study-create.controller';

@Module({
  controllers: [StudyCreateController],
  providers: [StudyCreateService],
})
export class StudyCreateModule {}
