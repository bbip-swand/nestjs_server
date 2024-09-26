import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Attendance } from 'src/models/attendance.entity';
import { StudyInfo } from 'src/models/study-info.entity';
import { StudyMember } from 'src/models/study-member.entity';
import { UsersModule } from 'src/users/users.module';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { UserInfo } from 'src/models/user-info.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudyInfo, StudyMember, Attendance, UserInfo]),
    UsersModule,
    AuthModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
