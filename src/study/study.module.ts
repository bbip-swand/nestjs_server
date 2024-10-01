import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { jwtConstants } from 'src/auth/constants';
import { StudyInfo } from 'src/models/study-info.entity';
import { WeeklyStudyContent } from 'src/models/weekly-study-content.entity';
import { TransactionCoreModule } from 'src/transaction-core/transaction-core.module';
import { UsersModule } from 'src/users/users.module';
import { StudyController } from './study.controller';
import { StudyService } from './study.service';
import { StudyMember } from 'src/models/study-member.entity';
import { UserInfo } from 'src/models/user-info.entity';
import { Attendance } from 'src/models/attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudyInfo,
      WeeklyStudyContent,
      StudyMember,
      UserInfo,
      Attendance,
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    forwardRef(() => TransactionCoreModule),
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
  ],
  controllers: [StudyController],
  providers: [StudyService],
  exports: [StudyService],
})
export class StudyModule {}
