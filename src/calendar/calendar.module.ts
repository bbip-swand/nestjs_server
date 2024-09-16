import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from 'src/models/calendar.entity';
import { StudyInfo } from 'src/models/study-info.entity';
import { AuthModule } from 'src/auth/auth.module';
import { StudyMember } from 'src/models/study-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Calendar, StudyInfo, StudyMember]),
    AuthModule,
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
