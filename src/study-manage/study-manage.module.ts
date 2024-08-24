import { Module } from '@nestjs/common';
import { StudyManageService } from './study-manage.service';
import { StudyManageController } from './study-manage.controller';

@Module({
  controllers: [StudyManageController],
  providers: [StudyManageService],
})
export class StudyManageModule {}
